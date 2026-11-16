import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Mail, MessageCircle, Phone } from "lucide-react";
import { categories, serviceBySlug, services, servicesIn } from "@/data/services";
import { site } from "@/data/content";
import { serviceById } from "@/lib/booking";
import { bookHref } from "@/lib/booking-presets";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import ServiceCard from "@/components/ui/ServiceCard";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = serviceBySlug((await params).slug);
  if (!s) return {};
  return { title: s.title, description: s.short, openGraph: { images: [{ url: s.image.src }] } };
}

export default async function ServicePage({ params }: Props) {
  const s = serviceBySlug((await params).slug);
  if (!s) notFound();
  const related = servicesIn(s.category).filter((x) => x.slug !== s.slug).slice(0, 3);
  const [first, words] = (() => {
    const w = s.title.split(" ");
    return [w.slice(0, -1).join(" "), w[w.length - 1]];
  })();

  return (
    <main id="main" className="pt-[84px]">
      <PageHeader
        id="service-title"
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: s.title }]}
        eyebrow={categories[s.category].title}
        title={first ? [first, <em key="l">{words}</em>] : [<em key="l">{words}</em>]}
        intro={s.short}
        actions={<Button book={{ service: s.book[0] }}>{s.category === "events" ? "Request a Booking" : "Book This Service"}</Button>}
        image={s.image}
      />

      <section aria-label="Service details" className="sec-sm bg-ink">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p data-reveal="up" className="font-serif text-[clamp(1.3rem,1.9vw,1.85rem)] leading-[1.45] text-cream">{s.intro}</p>

            <div className="mt-14 grid gap-12 sm:grid-cols-2">
              <div>
                <h2 data-reveal="fade" className="eyebrow">What’s included</h2>
                <ul data-stagger="up" data-gap="0.08" className="mt-6 border-t hair">
                  {s.includes.map((x) => (
                    <li key={x} data-item className="flex items-start gap-3 border-b hair py-4 text-[.92rem] text-cream/90">
                      <Check size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />{x}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 data-reveal="fade" className="eyebrow">Ideal for</h2>
                <ul data-stagger="up" data-gap="0.08" className="mt-6 border-t hair">
                  {s.idealFor.map((x) => (
                    <li key={x} data-item className="flex items-center gap-3 border-b hair py-4 text-[.92rem] text-cream/90">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-copper" />{x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* booking card */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div data-reveal="up" className="border hair bg-surface p-7 lg:sticky lg:top-28">
              <p className="field-label !text-accent">Book this service</p>
              <p className="mt-4 font-serif text-[1.5rem] leading-snug">Tell us the date, place and what you need — we’ll reply with a plan.</p>
              <div className="mt-6 flex flex-col gap-3">
                {s.book.map((id, i) => (
                  <a key={id} href={bookHref({ service: id })} data-book="" className={`btn ${i === 0 ? "btn-solid" : "btn-outline"} justify-center`}>
                    <span>{s.book.length > 1 ? `Request: ${serviceById(id)?.label}` : "Start a request"}</span>
                  </a>
                ))}
              </div>
              <div className="mt-7 space-y-3 border-t hair pt-6 text-[.88rem] text-cream/85">
                <p className="field-label">Or reach us directly</p>
                <a href={site.phoneHref} className="flex items-center gap-3 hover:text-accent"><Phone size={15} className="text-accent" aria-hidden="true" />{site.phoneDisplay}</a>
                <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-accent"><MessageCircle size={15} className="text-accent" aria-hidden="true" />WhatsApp</a>
                <a href={site.emailHref} className="flex items-center gap-3 break-all hover:text-accent"><Mail size={15} className="shrink-0 text-accent" aria-hidden="true" />{site.email}</a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="related-title" className="sec border-t hair bg-charcoal">
        <div className="wrap">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="related-title" data-reveal="up" className="h-lg">Related <em>services.</em></h2>
            <div data-reveal="up"><Button href="/services" variant="outline">All Services</Button></div>
          </div>
          <div data-stagger="up" data-gap="0.1" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => <ServiceCard key={r.slug} s={r} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
