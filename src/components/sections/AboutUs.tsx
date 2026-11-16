import Image from "next/image";
import { assets } from "@/data/assets";
import AnimatedHeading from "@/components/animations/AnimatedHeading";
import Button from "@/components/ui/Button";

const pillars = [
  { k: "Create", v: "Photography, film & brand content" },
  { k: "Host", v: "Conferences, halls, studios & locations" },
  { k: "Coordinate", v: "Schedules, suppliers & on-site production" },
];

export default function AboutUs() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden border-y hair bg-charcoal sec">
      <span aria-hidden="true" className="ghost-num pointer-events-none absolute -right-4 top-6 text-[clamp(8rem,20vw,22rem)]">02</span>
      <div className="wrap relative grid items-center gap-x-8 gap-y-20 lg:grid-cols-12">
        <div className="relative lg:col-span-6">
          {/* viewfinder frame, offset behind the photo */}
          <div aria-hidden="true" className="pointer-events-none absolute -inset-4 md:-inset-6">
            <i className="vf vf-tl" /><i className="vf vf-tr" /><i className="vf vf-bl" /><i className="vf vf-br" />
          </div>
          <div data-reveal="mask" className="relative aspect-[5/5.2] overflow-hidden md:aspect-[4/4.4]">
            <div data-parallax="0.07" className="absolute inset-0 scale-[1.16]">
              <Image src={assets.about.src} alt={assets.about.alt} fill sizes="(min-width:1024px) 48vw, 100vw" className="object-cover object-[50%_16%]" />
            </div>
            <div aria-hidden="true" className="floaty pointer-events-none absolute right-[8%] top-[18%] h-40 w-40 rounded-full bg-glow/25 blur-[70px]" />
          </div>
          {/* agency card overlapping the photo edge */}
          <div data-reveal="up" data-delay="0.45" className="absolute -bottom-9 right-4 border hair bg-surface px-7 py-5 shadow-[0_24px_60px_-28px_rgba(0,0,0,.55)] md:-right-8 lg:-right-14">
            <p className="font-script text-[clamp(2rem,3vw,3rem)] leading-none text-accent">Badawy Productions</p>
            <p className="mt-2 text-[9px] tracking-[.3em] text-muted">PHOTOGRAPHY · MARKETING · EVENT PRODUCTION</p>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <div data-reveal="fade" className="eyebrow"><b>02</b><span data-draw aria-hidden="true" className="h-px w-14 bg-copper/60" />About the Agency</div>
          <AnimatedHeading id="about-title" className="h-lg mt-7" lines={["One agency.", <em key="e">Every production.</em>]} />
          <p data-reveal="up" data-delay="0.15" className="body-copy mt-8">
            Badawy Productions is a photography, marketing and event production agency. We bring together creative crews, studios, event venues and shooting locations &mdash; and coordinate them into one seamless production for individuals, brands and organisations.
          </p>
          <dl data-stagger="up" data-gap="0.1" className="mt-9 border-t hair">
            {pillars.map((p) => (
              <div key={p.k} data-item className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 border-b hair py-4">
                <dt className="font-serif text-lg italic text-accent">{p.k}</dt>
                <dd className="text-[.86rem] text-cream/85">{p.v}</dd>
              </div>
            ))}
          </dl>
          <div data-reveal="up" data-delay="0.35" className="mt-11">
            <Button href="/about" variant="outline">More About Us</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
