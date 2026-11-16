import Image from "next/image";
import Link from "next/link";
import { assets } from "@/data/assets";
import AnimatedHeading from "@/components/animations/AnimatedHeading";

/** Each tile opens the matching service page. */
const tileLinks = ["/services/wedding-photography", "/services/commercial-photography", "/services/portrait-photography", "/services/event-coverage"];

export default function CapturingMoments() {
  return (
    <section id="moments" aria-labelledby="capture-title" className="relative overflow-hidden bg-ink sec">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <div data-reveal="fade" className="eyebrow"><b>01</b><span data-draw aria-hidden="true" className="h-px w-14 bg-copper/60" />Capturing Moments</div>
          <AnimatedHeading
            id="capture-title"
            className="h-xl mt-7"
            lines={["Capturing moments.", <span key="c"><em>Producing</em> stories.</span>]}
          />
        </div>
        <div className="lg:col-span-4 lg:pb-3">
          <p data-reveal="up" data-delay="0.15" className="body-copy">
            Weddings, products, portraits and live events &mdash; our crews shoot them, and our team arranges the venue, studio or location around them.
          </p>
        </div>
      </div>

      <div data-stagger="right" data-gap="0.16" className="mosaic mt-[clamp(48px,6vw,104px)] min-h-0 md:ml-[max(32px,calc((100%-1280px)/2))]">
        {assets.capture.map((c, i) => (
          <div key={c.src} className="tile" data-item>
            <Link href={tileLinks[i]} className="tile-clip block" aria-label={`${c.label} — explore the service`}>
              <Image src={c.src} alt={c.alt} fill sizes="(min-width:768px) 24vw, 50vw" className="object-cover" style={{ objectPosition: c.position }} />
              <div className="tile-light" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night/75 to-transparent" />
              <span className="tile-cap label absolute bottom-4 left-[calc(var(--s)+12px)] text-[.62rem] text-snow">{c.label} →</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
