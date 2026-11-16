import Image from "next/image";
import { assets } from "@/data/assets";
import AnimatedHeading from "@/components/animations/AnimatedHeading";

/**
 * NEEDS CLIENT CONFIRMATION before public launch — these brand marks come from the design mockup
 * and do not establish a commercial relationship.
 * Static row on desktop; on smaller screens it becomes a seamless two-track marquee (second track is aria-hidden).
 */
function Track({ hidden }: { hidden?: boolean }) {
  return (
    <ul className={`marquee-track flex shrink-0 items-center lg:w-full lg:justify-between ${hidden ? "lg:hidden" : ""}`} aria-hidden={hidden || undefined}>
      {assets.clients.map((c) => {
        const h = Math.round(c.name === "Samsung" ? 22 : c.name === "Emirates" ? 44 : 34);
        return (
          <li key={c.name} className="logo-item flex items-center justify-center border-copper/25 px-9 lg:flex-1 lg:border-r lg:px-4 lg:last:border-r-0">
            <Image src={c.src} alt={hidden ? "" : c.name} width={c.width} height={c.height} sizes="160px" className="logo-img w-auto" style={{ height: h }} />
          </li>
        );
      })}
    </ul>
  );
}

export default function ClientLogos() {
  return (
    <section aria-labelledby="clients-title" className="border-y hair bg-charcoal">
      <div className="wrap flex flex-col items-start gap-5 py-[clamp(48px,5vw,88px)] lg:flex-row lg:items-center lg:gap-0">
        <div className="lg:w-[210px] lg:shrink-0 lg:border-r lg:border-copper/30 lg:pr-6">
          <AnimatedHeading id="clients-title" className="serif-h text-[clamp(1.2rem,1.7vw,2rem)] !leading-[1.12]" lines={["OUR", <span key="c" className="text-accent">CLIENTS</span>]} />
        </div>
        <div data-reveal="fade" data-delay="0.15" className="marquee w-full min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] lg:flex lg:[mask-image:none]">
          <div className="flex w-max items-center lg:w-full">
            <Track />
            <Track hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
