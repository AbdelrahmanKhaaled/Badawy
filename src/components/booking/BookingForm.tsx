"use client";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CircleCheck, LoaderCircle, Mail, MessageCircle, Phone, RotateCcw, TriangleAlert } from "lucide-react";
import {
  BOOKING_CATEGORIES, DURATIONS, EMPTY_BOOKING, SETTINGS, STEPS, labelFor, serviceById, servicesForCategory, summarize, validateBooking, venueNeedsFor,
  type BookingCategory, type BookingData, type Errors,
} from "@/lib/booking";
import { PRESETS, type PresetId } from "@/lib/booking-presets";
import { site } from "@/data/content";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; id: string }
  | { kind: "error"; code: string; message: string };

export type BookingFormProps = {
  preset: PresetId;
  service?: string;
  /** Draft to resume (modal keeps it between openings). */
  draft?: BookingData;
  onDraft?: (d: BookingData | null) => void;
  onClose?: () => void;
  source?: string;
  /** Scroll container to reset on step change (modal body); defaults to window. */
  scrollRef?: React.RefObject<HTMLElement | null>;
};

const ease = [0.2, 0.7, 0.2, 1] as const;
const newKey = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function initial(preset: PresetId, service?: string, draft?: BookingData): BookingData {
  const s = service ? serviceById(service) : undefined;
  const contactOnly = (): BookingData => ({ ...EMPTY_BOOKING, name: draft?.name ?? "", email: draft?.email ?? "", phone: draft?.phone ?? "" });
  if (s) {
    const base = draft && draft.service === s.id ? { ...draft } : contactOnly();
    return { ...base, category: s.category, service: s.id };
  }
  // Same kind of request as the draft → resume it; otherwise start fresh but keep the contact details.
  if (draft && draft.category === PRESETS[preset].category) return { ...draft };
  return { ...contactOnly(), category: PRESETS[preset].category };
}

export default function BookingForm({ preset, service, draft, onDraft, onClose, source, scrollRef }: BookingFormProps) {
  const uid = useId();
  const P = PRESETS[preset];
  const [d, setD] = useState<BookingData>(() => initial(preset, service, draft));
  const [step, setStep] = useState(() => (service && serviceById(service) ? 1 : 0));
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [showAll, setShowAll] = useState(false);
  const [online, setOnline] = useState<boolean | null>(null);
  const key = useRef(newKey());
  const top = useRef<HTMLDivElement>(null);
  const svc = serviceById(d.service);
  const busy = status.kind === "submitting";

  // Is a submission channel configured? (Shown up front so nobody fills a form that cannot be delivered.)
  useEffect(() => {
    let live = true;
    fetch("/api/booking", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => live && setOnline(!!j.configured))
      .catch(() => live && setOnline(null));
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (status.kind !== "success") onDraft?.(d);
  }, [d, status.kind, onDraft]);

  const set = <K extends keyof BookingData>(k: K, v: BookingData[K]) => {
    setD((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const pickCategory = (c: BookingCategory) => {
    setD((p) => (p.category === c ? p : { ...p, category: c, service: "", shootType: "", setting: "", attendees: "", venueNeeds: [], duration: "", crewSize: "" }));
    setErrors((e) => ({ ...e, category: undefined, service: undefined }));
  };
  const pickService = (id: string) => {
    setD((p) => (p.service === id ? p : { ...p, service: id, shootType: "", setting: "", attendees: "", venueNeeds: [], duration: "", crewSize: "" }));
    setErrors((e) => ({ ...e, service: undefined }));
  };

  const scrollTop = () => {
    const box = scrollRef?.current;
    if (box) box.scrollTo({ top: 0, behavior: "smooth" });
    else top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const focusFirstError = (e: Errors) => {
    const k = Object.keys(e)[0];
    if (!k) return;
    window.setTimeout(() => {
      const el = document.getElementById(`${uid}-${k}`) ?? document.querySelector<HTMLElement>(`[data-field="${uid}-${k}"] input, [data-field="${uid}-${k}"] button`);
      el?.focus({ preventScroll: false });
    }, 60);
  };

  const validateStep = (i: number) => {
    const e = validateBooking(d, STEPS[i].fields);
    setErrors(e);
    if (Object.keys(e).length) focusFirstError(e);
    return !Object.keys(e).length;
  };

  const go = (i: number) => {
    setStep(i);
    scrollTop();
  };
  const next = () => validateStep(step) && go(step + 1);
  const prev = () => go(Math.max(0, step - 1));

  const submit = async () => {
    if (busy) return; // duplicate-submission guard (plus server-side idempotency key)
    const all = validateBooking(d);
    if (Object.keys(all).length) {
      setErrors(all);
      const s = STEPS.findIndex((st) => st.fields.some((f) => f in all));
      if (s !== step) go(s);
      focusFirstError(all);
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: d, key: key.current, source: source ?? (typeof window !== "undefined" ? window.location.pathname : "") }),
      });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: string; code?: string; message?: string; errors?: Errors };
      if (res.ok && j.ok && j.id) {
        setStatus({ kind: "success", id: j.id });
        onDraft?.(null);
        scrollTop();
        return;
      }
      if (res.status === 422 && j.errors) {
        setErrors(j.errors);
        const s = STEPS.findIndex((st) => st.fields.some((f) => f in j.errors!));
        if (s >= 0 && s !== step) go(s);
        setStatus({ kind: "idle" });
        return;
      }
      setStatus({ kind: "error", code: j.code ?? `http_${res.status}`, message: j.message ?? "Something went wrong while sending your request." });
    } catch {
      setStatus({ kind: "error", code: "network", message: "We couldn’t reach the server. Check your connection and try again." });
    }
  };

  const restart = () => {
    key.current = newKey();
    setD({ ...EMPTY_BOOKING, category: P.category, name: d.name, email: d.email, phone: d.phone });
    setErrors({});
    setStatus({ kind: "idle" });
    setStep(0);
    scrollTop();
  };

  const mailto = useMemo(() => {
    const subject = `Booking request: ${svc?.label ?? "Project"} — ${d.name || "Website visitor"}`;
    return `${site.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summarize(d))}`;
  }, [d, svc]);

  // ---------------- Success ----------------
  if (status.kind === "success") {
    return (
      <div ref={top} className="booking-done" role="status" aria-live="polite">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease: [0.2, 1.4, 0.4, 1] }} className="grid h-16 w-16 place-items-center rounded-full border border-copper/60 text-accent">
          <CircleCheck size={30} strokeWidth={1.4} aria-hidden="true" />
        </motion.div>
        <p className="eyebrow mt-8">Request received</p>
        <h2 className="h-lg mt-4 !text-[clamp(1.8rem,3vw,2.8rem)]">Thank you, <em>{d.name.trim().split(/\s+/)[0]}.</em></h2>
        <p className="body-copy mt-5">
          Your {svc?.label.toLowerCase()} request has been sent to our team. We’ll review it and reply to <strong className="text-cream">{d.email}</strong> or call you on <strong className="text-cream">{d.phone}</strong>.
        </p>
        <dl className="mt-8 grid gap-px overflow-hidden border hair bg-[var(--c-line)] text-sm sm:grid-cols-2">
          <div className="bg-surface p-4"><dt className="field-label">Reference</dt><dd className="mt-1.5 font-mono text-cream">{status.id}</dd></div>
          <div className="bg-surface p-4"><dt className="field-label">Service</dt><dd className="mt-1.5 text-cream">{svc?.label}</dd></div>
        </dl>
        <div className="mt-9 flex flex-wrap gap-3">
          {onClose ? (
            <button type="button" onClick={onClose} className="btn btn-solid"><span>Done</span></button>
          ) : (
            <Link href="/" className="btn btn-solid"><span>Back to home</span></Link>
          )}
          <button type="button" onClick={restart} className="btn btn-outline"><RotateCcw size={14} aria-hidden="true" /><span>New request</span></button>
        </div>
      </div>
    );
  }

  // ---------------- Form ----------------
  const visible = (() => {
    const list = servicesForCategory((d.category || P.category) as BookingCategory);
    if (P.only && !showAll && d.category === P.category && (!d.service || P.only.includes(d.service))) return list.filter((s) => P.only!.includes(s.id));
    return list;
  })();
  const limited = visible.length < servicesForCategory((d.category || P.category) as BookingCategory).length;
  const has = (k: Parameters<typeof labelFor>[1]) => (k === "location" || k === "date" ? true : !!svc?.fields.includes(k));
  const req = (k: Parameters<typeof labelFor>[1]) =>
    k === "date" ? !!svc?.dateRequired : k === "location" ? !!svc?.locationRequired : !!svc?.required.includes(k);

  return (
    <div ref={top} className="booking-form">
      {/* progress */}
      <ol className="grid grid-cols-3 gap-2" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s.id} aria-current={i === step ? "step" : undefined}>
            <button
              type="button"
              disabled={i > step || busy}
              onClick={() => i < step && go(i)}
              className="group block w-full text-left disabled:cursor-default"
              aria-label={`Step ${i + 1}: ${s.title}${i < step ? " (completed — edit)" : ""}`}
            >
              <span className="relative block h-[2px] overflow-hidden bg-[var(--c-line)]">
                <motion.span className="absolute inset-0 origin-left bg-copper-hi" initial={false} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: 0.6, ease }} />
              </span>
              <span className={`mt-3 flex items-center gap-2 text-[.62rem] font-semibold uppercase tracking-[.22em] ${i === step ? "text-accent" : i < step ? "text-cream group-hover:text-accent" : "text-muted"}`}>
                <span className="grid h-5 w-5 place-items-center rounded-full border border-current text-[.55rem]">{i < step ? <Check size={11} aria-hidden="true" /> : i + 1}</span>
                {s.title}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">Step {step + 1} of {STEPS.length}: {STEPS[step].title}</p>

      {online === false && (
        <div className="mt-7 flex gap-3 border border-copper/40 bg-copper/10 p-4 text-[.85rem] leading-relaxed text-cream">
          <TriangleAlert size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
          <p>
            Online requests aren’t connected yet. You can still prepare your request here and send it by email, or reach us directly at{" "}
            <a className="underline decoration-copper underline-offset-4" href={site.phoneHref}>{site.phoneDisplay}</a>.
          </p>
        </div>
      )}

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step < STEPS.length - 1) next();
          else submit();
        }}
        className="mt-8"
        aria-busy={busy}
      >
        {/* honeypot */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>Website<input tabIndex={-1} autoComplete="off" value={d.website} onChange={(e) => set("website", e.target.value)} /></label>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease }}>
            {step === 0 && (
              <div className="space-y-9">
                <fieldset data-field={`${uid}-category`}>
                  <legend className="field-label">Service category <Req /></legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-describedby={errors.category ? `${uid}-category-err` : undefined}>
                    {BOOKING_CATEGORIES.map((c) => (
                      <button key={c.id} type="button" role="radio" aria-checked={d.category === c.id} onClick={() => pickCategory(c.id)} className="opt">
                        <span className="block text-[.95rem] font-semibold text-cream">{c.label}</span>
                        <span className="mt-1 block text-[.78rem] text-muted">{c.hint}</span>
                      </button>
                    ))}
                  </div>
                  <Err id={`${uid}-category-err`} msg={errors.category} />
                </fieldset>

                <fieldset data-field={`${uid}-service`}>
                  <legend className="field-label">Specific service <Req /></legend>
                  <div className="mt-3 flex flex-wrap gap-2.5" role="radiogroup" aria-describedby={errors.service ? `${uid}-service-err` : undefined}>
                    {visible.map((s) => (
                      <button key={s.id} type="button" role="radio" aria-checked={d.service === s.id} onClick={() => pickService(s.id)} className="chip">
                        {d.service === s.id && <Check size={13} aria-hidden="true" />}
                        {s.label}
                      </button>
                    ))}
                  </div>
                  {limited && (
                    <button type="button" onClick={() => setShowAll(true)} className="mt-4 text-[.72rem] font-semibold uppercase tracking-[.18em] text-accent underline-offset-4 hover:underline">
                      Show all {BOOKING_CATEGORIES.find((c) => c.id === d.category)?.label.toLowerCase()} services
                    </button>
                  )}
                  <Err id={`${uid}-service-err`} msg={errors.service} />
                </fieldset>
              </div>
            )}

            {step === 1 && svc && (
              <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2">
                <p className="sm:col-span-2 -mb-2 text-[.8rem] text-muted">
                  <span className="text-accent">{svc.label}</span> — fields marked <Req /> are required.
                </p>
                {has("shootType") && svc.shootTypes && (
                  <Field id={`${uid}-shootType`} label={labelFor(svc, "shootType")} required={req("shootType")} error={errors.shootType}>
                    <select id={`${uid}-shootType`} className="input select" value={d.shootType} onChange={(e) => set("shootType", e.target.value)} {...aria(uid, "shootType", errors)}>
                      <option value="">Select…</option>
                      {svc.shootTypes.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                )}
                {has("setting") && (
                  <Field id={`${uid}-setting`} label={labelFor(svc, "setting")} error={errors.setting}>
                    <select id={`${uid}-setting`} className="input select" value={d.setting} onChange={(e) => set("setting", e.target.value)} {...aria(uid, "setting", errors)}>
                      <option value="">Select…</option>
                      {SETTINGS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                )}
                {has("attendees") && (
                  <Field id={`${uid}-attendees`} label={labelFor(svc, "attendees")} required={req("attendees")} error={errors.attendees}>
                    <input id={`${uid}-attendees`} className="input" type="number" inputMode="numeric" min={1} max={100000} placeholder="e.g. 150" value={d.attendees} onChange={(e) => set("attendees", e.target.value)} {...aria(uid, "attendees", errors)} />
                  </Field>
                )}
                {has("crewSize") && (
                  <Field id={`${uid}-crewSize`} label={labelFor(svc, "crewSize")} error={errors.crewSize}>
                    <input id={`${uid}-crewSize`} className="input" type="number" inputMode="numeric" min={1} max={500} placeholder="e.g. 6" value={d.crewSize} onChange={(e) => set("crewSize", e.target.value)} {...aria(uid, "crewSize", errors)} />
                  </Field>
                )}
                {has("duration") && (
                  <Field id={`${uid}-duration`} label={labelFor(svc, "duration")} required={req("duration")} error={errors.duration}>
                    <select id={`${uid}-duration`} className="input select" value={d.duration} onChange={(e) => set("duration", e.target.value)} {...aria(uid, "duration", errors)}>
                      <option value="">Select…</option>
                      {DURATIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </Field>
                )}
                <Field id={`${uid}-date`} label={labelFor(svc, "date")} required={req("date") && !d.dateFlexible} error={errors.date}>
                  <input id={`${uid}-date`} className="input" type="date" min={todayISO()} value={d.date} onChange={(e) => set("date", e.target.value)} {...aria(uid, "date", errors)} />
                  <label className="mt-2.5 flex cursor-pointer items-center gap-2.5 text-[.8rem] text-muted">
                    <input type="checkbox" className="check" checked={d.dateFlexible} onChange={(e) => { set("dateFlexible", e.target.checked); if (errors.date) setErrors((x) => ({ ...x, date: undefined })); }} />
                    My date is flexible
                  </label>
                </Field>
                <Field id={`${uid}-location`} label={labelFor(svc, "location")} required={req("location")} error={errors.location}>
                  <input id={`${uid}-location`} className="input" type="text" maxLength={120} autoComplete="address-level2" placeholder={svc.category === "events" ? "e.g. New Cairo, Sheikh Zayed…" : "e.g. our office, a studio, outdoors…"} value={d.location} onChange={(e) => set("location", e.target.value)} {...aria(uid, "location", errors)} />
                </Field>
                {has("venueNeeds") && (
                  <fieldset className="sm:col-span-2" data-field={`${uid}-venueNeeds`}>
                    <legend className="field-label">{labelFor(svc, "venueNeeds")} <span className="normal-case tracking-normal text-muted/80">(optional)</span></legend>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {venueNeedsFor(svc).map((o) => {
                        const on = d.venueNeeds.includes(o);
                        return (
                          <button key={o} type="button" role="checkbox" aria-checked={on} onClick={() => set("venueNeeds", on ? d.venueNeeds.filter((x) => x !== o) : [...d.venueNeeds, o])} className="chip">
                            {on && <Check size={13} aria-hidden="true" />}{o}
                          </button>
                        );
                      })}
                    </div>
                    <Err id={`${uid}-venueNeeds-err`} msg={errors.venueNeeds} />
                  </fieldset>
                )}
                <Field id={`${uid}-budget`} label="Estimated budget" optional error={errors.budget} className="sm:col-span-2">
                  <input id={`${uid}-budget`} className="input" type="text" maxLength={120} placeholder="e.g. 30,000 EGP — or “to be discussed”" value={d.budget} onChange={(e) => set("budget", e.target.value)} {...aria(uid, "budget", errors)} />
                </Field>
                <Field id={`${uid}-description`} label="Project description / requirements" required error={errors.description} className="sm:col-span-2">
                  <textarea id={`${uid}-description`} className="input min-h-[140px] resize-y" maxLength={3000} placeholder="What are you planning? Share the goal, the style you like, deliverables and anything we should know." value={d.description} onChange={(e) => set("description", e.target.value)} {...aria(uid, "description", errors)} />
                  <span className="mt-1.5 block text-right text-[.7rem] text-muted">{d.description.trim().length} / 3000</span>
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2">
                <Field id={`${uid}-name`} label="Full name" required error={errors.name} className="sm:col-span-2">
                  <input id={`${uid}-name`} className="input" type="text" autoComplete="name" maxLength={120} value={d.name} onChange={(e) => set("name", e.target.value)} {...aria(uid, "name", errors)} />
                </Field>
                <Field id={`${uid}-email`} label="Email address" required error={errors.email}>
                  <input id={`${uid}-email`} className="input" type="email" autoComplete="email" inputMode="email" maxLength={160} value={d.email} onChange={(e) => set("email", e.target.value)} {...aria(uid, "email", errors)} />
                </Field>
                <Field id={`${uid}-phone`} label="Phone number" required error={errors.phone}>
                  <input id={`${uid}-phone`} className="input" type="tel" autoComplete="tel" inputMode="tel" maxLength={20} placeholder="+20 1xx xxx xxxx" value={d.phone} onChange={(e) => set("phone", e.target.value)} {...aria(uid, "phone", errors)} />
                </Field>

                <div className="sm:col-span-2 border hair bg-surface/60 p-5">
                  <p className="field-label">Your request</p>
                  <dl className="mt-3 grid gap-x-6 gap-y-2 text-[.84rem] sm:grid-cols-2">
                    <Row k="Service" v={svc?.label} />
                    <Row k={labelFor(svc, "date")} v={d.date ? new Date(`${d.date}T00:00`).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }) : d.dateFlexible ? "Flexible" : "—"} />
                    {d.location && <Row k={labelFor(svc, "location")} v={d.location} />}
                    {d.attendees && <Row k={labelFor(svc, "attendees")} v={d.attendees} />}
                  </dl>
                  <button type="button" onClick={() => go(1)} className="mt-4 text-[.7rem] font-semibold uppercase tracking-[.18em] text-accent underline-offset-4 hover:underline">Edit details</button>
                </div>

                <label className="sm:col-span-2 flex cursor-pointer items-start gap-3 text-[.85rem] leading-relaxed text-muted" data-field={`${uid}-consent`}>
                  <input id={`${uid}-consent`} type="checkbox" className="check mt-0.5" checked={d.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? `${uid}-consent-err` : undefined} />
                  <span>I agree that Badawy Productions may contact me by email or phone about this request. <Req /></span>
                </label>
                <Err id={`${uid}-consent-err`} msg={errors.consent} className="sm:col-span-2 -mt-5" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {status.kind === "error" && (
          <div role="alert" className="mt-8 border border-[var(--c-error)]/50 bg-[var(--c-error)]/10 p-5">
            <p className="flex items-center gap-2.5 font-semibold text-cream"><TriangleAlert size={17} className="text-[var(--c-error)]" aria-hidden="true" />Your request was not sent.</p>
            <p className="mt-2 text-[.88rem] leading-relaxed text-muted">
              {status.code === "not_configured" ? "Online booking isn’t connected yet." : status.message} Your details are still here — send them another way:
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {status.code !== "not_configured" && status.code !== "rate_limited" && (
                <button type="submit" className="chip"><RotateCcw size={13} aria-hidden="true" />Try again</button>
              )}
              <a href={mailto} className="chip"><Mail size={13} aria-hidden="true" />Send by email</a>
              <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="chip"><MessageCircle size={13} aria-hidden="true" />WhatsApp</a>
              <a href={site.phoneHref} className="chip"><Phone size={13} aria-hidden="true" />{site.phoneDisplay}</a>
            </div>
          </div>
        )}

        {/* nav */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t hair pt-6">
          {step > 0 ? (
            <button type="button" onClick={prev} disabled={busy} className="btn btn-outline !px-4 disabled:opacity-50">
              <ArrowLeft size={15} aria-hidden="true" /><span>Previous</span>
            </button>
          ) : (
            <span className="text-[.7rem] uppercase tracking-[.2em] text-muted">Step 1 of {STEPS.length}</span>
          )}
          {step < STEPS.length - 1 ? (
            <button type="submit" className="btn btn-solid">
              <span>Continue</span><ArrowRight size={15} className="arr" aria-hidden="true" />
            </button>
          ) : (
            <button type="submit" disabled={busy} className="btn btn-solid min-w-[11.5rem] justify-center disabled:cursor-wait disabled:opacity-80">
              {busy ? <><LoaderCircle size={15} className="animate-spin" aria-hidden="true" /><span>Sending…</span></> : <><span>Submit request</span><ArrowRight size={15} className="arr" aria-hidden="true" /></>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const aria = (uid: string, k: keyof BookingData, e: Errors) => ({
  "aria-invalid": !!e[k],
  "aria-describedby": e[k] ? `${uid}-${k}-err` : undefined,
});

function Req() {
  return <span aria-hidden="true" className="text-accent">*</span>;
}

function Err({ id, msg, className = "" }: { id: string; msg?: string; className?: string }) {
  return (
    <AnimatePresence initial={false}>
      {msg && (
        <motion.p id={id} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`field-err ${className}`}>
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function Field({ id, label, required, optional, error, className = "", children }: { id: string; label: string; required?: boolean; optional?: boolean; error?: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label block">
        {label} {required && <Req />}
        {optional && <span className="normal-case tracking-normal text-muted/80">(optional)</span>}
        {required && <span className="sr-only">(required)</span>}
      </label>
      <div className="mt-2.5">{children}</div>
      <Err id={`${id}-err`} msg={error} />
    </div>
  );
}

function Row({ k, v }: { k: string; v?: string }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-muted">{k}:</dt>
      <dd className="min-w-0 truncate text-cream">{v ?? "—"}</dd>
    </div>
  );
}
