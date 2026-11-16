import { NextResponse } from "next/server";
import { coerceBooking, summarize, toRecord, validateBooking, type BookingRecord } from "@/lib/booking";

/**
 * POST /api/booking — validated booking/project request handler.
 *
 * Delivery channels (configure in .env.local / hosting env — see .env.example). Nothing is hard-coded:
 *   BOOKING_WEBHOOK_URL     JSON POST of the structured record (CRM, Zapier/Make, n8n, Google Apps Script, own backend…)
 *   BOOKING_WEBHOOK_SECRET  optional, sent as "Authorization: Bearer <secret>"
 *   RESEND_API_KEY + BOOKING_NOTIFY_EMAIL + BOOKING_FROM_EMAIL   optional email notification via Resend
 *
 * The request is reported as accepted ONLY if at least one configured channel accepted it.
 * With no channel configured the route answers 503 { code: "not_configured" } and the UI offers direct contact instead.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const env = () => ({
  webhook: process.env.BOOKING_WEBHOOK_URL?.trim() || "",
  secret: process.env.BOOKING_WEBHOOK_SECRET?.trim() || "",
  resendKey: process.env.RESEND_API_KEY?.trim() || "",
  notify: process.env.BOOKING_NOTIFY_EMAIL?.trim() || "",
  from: process.env.BOOKING_FROM_EMAIL?.trim() || "",
});
const configured = () => {
  const c = env();
  return { webhook: !!c.webhook, email: !!(c.resendKey && c.notify && c.from) };
};

// ---- Best-effort in-memory protection (per server instance). Use a shared store if you scale horizontally. ----
const seen = new Map<string, { at: number; id: string }>(); // client request key → accepted id (duplicate protection)
const hits = new Map<string, number[]>(); // ip → timestamps (rate limit)
const WINDOW = 10 * 60_000;
const LIMIT = 5;
function sweep(now: number) {
  for (const [k, v] of seen) if (now - v.at > WINDOW) seen.delete(k);
  for (const [k, v] of hits) {
    const keep = v.filter((t) => now - t < WINDOW);
    if (keep.length) hits.set(k, keep);
    else hits.delete(k);
  }
}

const json = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

async function toWebhook(record: BookingRecord) {
  const c = env();
  const res = await fetch(c.webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(c.secret ? { Authorization: `Bearer ${c.secret}` } : {}) },
    body: JSON.stringify({ type: "booking_request", ...record }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`webhook responded ${res.status}`);
}

async function toEmail(record: BookingRecord, text: string) {
  const c = env();
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${c.resendKey}` },
    body: JSON.stringify({
      from: c.from,
      to: c.notify.split(",").map((s) => s.trim()).filter(Boolean),
      reply_to: record.contact.email,
      subject: `New request: ${record.service.label} — ${record.contact.name} [${record.id}]`,
      text: `Reference: ${record.id}\nReceived: ${record.receivedAt}\n\n${text}`,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`email provider responded ${res.status}`);
}

export async function GET() {
  const c = configured();
  return json(200, { configured: c.webhook || c.email });
}

export async function POST(req: Request) {
  const ch = configured();
  if (!ch.webhook && !ch.email) return json(503, { ok: false, code: "not_configured", message: "Online requests are not connected yet." });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(400, { ok: false, code: "bad_json", message: "Invalid request body." });
  }
  const data = coerceBooking((body as { data?: unknown })?.data);
  const key = typeof (body as { key?: unknown })?.key === "string" ? String((body as { key: string }).key).slice(0, 80) : "";
  const source = typeof (body as { source?: unknown })?.source === "string" ? String((body as { source: string }).source).slice(0, 120) : undefined;

  if (data.website) return json(400, { ok: false, code: "rejected", message: "Request rejected." }); // honeypot

  const errors = validateBooking(data);
  if (Object.keys(errors).length) return json(422, { ok: false, code: "invalid", message: "Please correct the highlighted fields.", errors });

  const now = Date.now();
  sweep(now);
  if (key && seen.has(key)) return json(200, { ok: true, id: seen.get(key)!.id, duplicate: true });

  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "local").trim();
  const list = hits.get(ip) ?? [];
  if (list.length >= LIMIT) return json(429, { ok: false, code: "rate_limited", message: "Too many requests. Please try again later or contact us directly." });

  const id = `BP-${new Date(now).toISOString().slice(2, 10).replace(/-/g, "")}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const record = toRecord(data, { id, receivedAt: new Date(now).toISOString(), source });
  const text = summarize(data);

  const jobs: Promise<void>[] = [];
  if (ch.webhook) jobs.push(toWebhook(record));
  if (ch.email) jobs.push(toEmail(record, text));
  const results = await Promise.allSettled(jobs);
  const delivered = results.filter((r) => r.status === "fulfilled").length;
  results.forEach((r) => r.status === "rejected" && console.error("[booking] delivery failed:", (r.reason as Error)?.message));

  if (!delivered) return json(502, { ok: false, code: "delivery_failed", message: "We couldn't deliver your request right now." });

  hits.set(ip, [...list, now]);
  if (key) seen.set(key, { at: now, id });
  return json(200, { ok: true, id });
}
