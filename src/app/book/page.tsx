import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { site } from "@/data/content";
import { serviceById } from "@/lib/booking";
import { PRESETS, isPreset, presetFor } from "@/lib/booking-presets";
import BookingForm from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Book",
  description: "Request a shoot, an event, a venue or a shooting location from Badawy Productions.",
};

type Props = { searchParams: Promise<{ type?: string; service?: string }> };

/** Dedicated booking page — the no-JS / deep-link destination of every booking CTA (with JS they open the modal). */
export default async function BookPage({ searchParams }: Props) {
  const q = await searchParams;
  const service = q.service && serviceById(q.service) ? q.service : undefined;
  const preset = isPreset(q.type) ? q.type : presetFor(service);
  const P = PRESETS[preset];

  return (
    <main id="main" className="pt-[84px]">
      <section aria-labelledby="book-title" className="bg-ink">
        <div className="wrap grid gap-10 py-[clamp(40px,5vw,80px)] lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <nav aria-label="Breadcrumb" className="text-[.66rem] uppercase tracking-[.2em] text-muted">
                <Link href="/" className="hover:text-accent">Home</Link> <span className="text-copper">/</span> <span aria-current="page" className="text-cream">Book</span>
              </nav>
              <p className="eyebrow mt-8">{P.kicker}</p>
              <h1 id="book-title" className="h-lg mt-4">{P.title}</h1>
              <p className="body-copy mt-5">{P.text}</p>
              <div className="relative mt-8 hidden aspect-[4/3] overflow-hidden rounded-md bg-night lg:block">
                <Image src={P.image} alt="" fill sizes="400px" className="object-cover" style={{ objectPosition: P.imagePosition ?? "50% 50%" }} />
                <i className="vf vf-tl !left-3 !top-3" /><i className="vf vf-br !bottom-3 !right-3" />
              </div>
              <div className="mt-8 space-y-3 text-[.88rem] text-cream/85">
                <p className="field-label">Prefer to talk?</p>
                <a href={site.phoneHref} className="flex items-center gap-3 hover:text-accent"><Phone size={15} className="text-accent" aria-hidden="true" />{site.phoneDisplay}</a>
                <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-accent"><MessageCircle size={15} className="text-accent" aria-hidden="true" />WhatsApp</a>
                <a href={site.emailHref} className="flex items-center gap-3 break-all hover:text-accent"><Mail size={15} className="shrink-0 text-accent" aria-hidden="true" />{site.email}</a>
              </div>
            </div>
          </aside>
          <div className="border hair bg-charcoal p-6 sm:p-9 lg:col-span-8">
            <BookingForm key={`${preset}-${service ?? ""}`} preset={preset} service={service} source="/book" />
          </div>
        </div>
      </section>
    </main>
  );
}
