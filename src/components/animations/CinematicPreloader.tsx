"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { assets } from "@/data/assets";
import { INTRO_EVENT, INTRO_KEY, prefersReducedMotion } from "@/lib/animations";

/* ---- Aperture geometry (viewBox -100..100). Six wedge blades pivoting on a ring of radius 70. ---- */
const BLADES = 6;
const PIVOT_R = 70;
const f = (n: number) => Math.round(n * 1000) / 1000;
const rot = (x: number, y: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [f(x * Math.cos(a) - y * Math.sin(a)), f(x * Math.sin(a) + y * Math.cos(a))];
};
const blades = Array.from({ length: BLADES }, (_, i) => {
  const deg = (360 / BLADES) * i;
  const local: [number, number][] = [
    [0, -PIVOT_R],
    [0, 3],
    [78 * Math.sin((78 * Math.PI) / 180), -78 * Math.cos((78 * Math.PI) / 180)],
    [78 * Math.sin((38 * Math.PI) / 180), -78 * Math.cos((38 * Math.PI) / 180)],
  ];
  const pts = local.map(([x, y]) => rot(x, y, deg));
  const pivot = rot(0, -PIVOT_R, deg);
  return { d: `M${pts.map((p) => p.join(" ")).join("L")}Z`, pivot: `${pivot[0]} ${pivot[1]}` };
});

const split = (text: string, group: "a" | "b") =>
  Array.from(text).map((ch, i) => (
    <span key={i} {...{ [`data-ch-${group}`]: "" }} className="inline-block" style={{ opacity: 0 }}>
      {ch === " " ? " " : ch}
    </span>
  ));

/** "The Camera Awakens" — full-screen intro: ring → aperture opens → logo → wordmark → iris wipe into hero. */
export default function CinematicPreloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || html.classList.contains("intro-done")) return;

    html.classList.add("preloading");
    let finished = false;
    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      html.dataset.intro = "reveal";
      window.dispatchEvent(new Event(INTRO_EVENT));
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      reveal();
      html.classList.remove("preloading");
      html.classList.add("intro-done");
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {}
    };

    // Failsafe: never block the interface, even if animation setup breaks.
    const failsafe = window.setTimeout(finish, 6500);
    const q = <T extends Element = HTMLElement>(s: string) => gsap.utils.toArray<T>(s, el);
    let ctx: gsap.Context | undefined;

    try {
      ctx = gsap.context(() => {
        if (prefersReducedMotion()) {
          gsap.set(["[data-logo]", "[data-glow]", "[data-blades]", "[data-ch-a]", "[data-ch-b]", "[data-sub]"], { opacity: 1 });
          gsap.timeline({ onComplete: finish })
            .to({}, { duration: 0.5 })
            .call(reveal)
            .to(el, { opacity: 0, duration: 0.4 });
          return;
        }

        const tl = gsap.timeline({ onComplete: finish, defaults: { ease: "power3.out" } });
        const ring = q<SVGCircleElement>("[data-ring]");
        const circ = 2 * Math.PI * 76;

        gsap.set(ring, { strokeDasharray: circ, strokeDashoffset: circ });
        gsap.set("[data-glow]", { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" });
        gsap.set("[data-blades]", { opacity: 0 });
        gsap.set("[data-logo]", { opacity: 0, scale: 0.85, filter: "blur(14px)" });
        gsap.set(["[data-ch-a]", "[data-ch-b]"], { opacity: 0, y: 14 });
        gsap.set("[data-sub]", { opacity: 0 });
        gsap.set(el, { "--r": "0vmax" });

        // Scene 1 – darkness, copper spark, lens outline draws
        tl.to("[data-glow]", { opacity: 0.55, scale: 0.7, duration: 0.7 }, 0.1)
          .to(ring, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 0.1)
          .to("[data-blades]", { opacity: 1, duration: 0.35 }, 0.55)
          // Scene 2 – blades rotate open
          .to(
            q<SVGPathElement>("[data-blade]"),
            { rotation: -58, svgOrigin: (i: number) => blades[i].pivot, duration: 1.05, ease: "power3.inOut" } as gsap.TweenVars,
            0.7,
          )
          .to("[data-glow]", { opacity: 1, scale: 1.1, duration: 1.0 }, 0.75)
          .to("[data-aperture]", { rotation: 24, transformOrigin: "50% 50%", duration: 1.2, ease: "power2.inOut" }, 0.7)
          // Scene 3 – logo focus-pull
          .to("[data-logo]", { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9 }, 1.15)
          // Scene 4 – typography
          .to("[data-ch-a]", { opacity: 1, y: 0, duration: 0.5, stagger: 0.03 }, 1.55)
          .to("[data-sub]", { opacity: 1, duration: 0.2 }, 1.9)
          .to("[data-ch-b]", { opacity: 0.8, y: 0, duration: 0.4, stagger: 0.018 }, 1.9)
          // Scene 5 – aperture expands, iris wipes away to reveal the hero
          .to(["[data-aperture]", "[data-logo]", "[data-text]"], { scale: 1.5, opacity: 0, duration: 0.7, ease: "power2.in", transformOrigin: "50% 50%" }, 2.6)
          .call(reveal, [], 2.75)
          .to(el, { "--r": "150vmax", duration: 1.15, ease: "power2.inOut" }, 2.75);
      }, el);
    } catch (err) {
      console.warn("Preloader failed, skipping intro", err);
      finish();
    }

    return () => {
      window.clearTimeout(failsafe);
      ctx?.revert();
      if (!finished) html.classList.remove("preloading");
    };
  }, []);

  return (
    <div id="preloader" data-theme="dark" ref={root} role="presentation" aria-hidden="true">
      <div data-stage className="relative flex flex-col items-center">
        <div className="relative aspect-square w-[min(74vw,340px)]">
          <div data-glow className="absolute inset-[-25%] rounded-full" style={{ opacity: 0, background: "radial-gradient(circle, rgba(226,154,99,.55) 0%, rgba(201,138,85,.18) 38%, transparent 68%)" }} />
          <svg data-aperture viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="blade" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#262220" />
                <stop offset="1" stopColor="#0d0c0b" />
              </linearGradient>
              <clipPath id="lens">
                <circle r="76" />
              </clipPath>
            </defs>
            <circle data-ring r="76" fill="none" stroke="#e29a63" strokeWidth="1.2" transform="rotate(-90)" />
            <circle r="81" fill="none" stroke="#c98a55" strokeOpacity=".35" strokeWidth=".5" />
            <g data-blades clipPath="url(#lens)" style={{ opacity: 0 }}>
              {blades.map((b, i) => (
                <path key={i} data-blade d={b.d} fill="url(#blade)" stroke="#c98a55" strokeOpacity=".7" strokeWidth=".8" />
              ))}
            </g>
          </svg>
          <Image
            data-logo
            src={assets.logo.src}
            alt=""
            width={assets.logo.width}
            height={assets.logo.height}
            priority
            sizes="220px"
            style={{ opacity: 0 }}
            className="absolute left-1/2 top-1/2 h-auto w-[62%] -translate-x-1/2 -translate-y-1/2"
          />
        </div>
        <div data-text className="mt-8 text-center">
          <div className="font-sans text-[clamp(.8rem,2.6vw,1.05rem)] font-semibold tracking-[.42em] text-cream">
            <span className="sr-only">BADAWY PRODUCTIONS</span>
            <span aria-hidden="true">{split("BADAWY PRODUCTIONS", "a")}</span>
          </div>
          <div data-sub className="mt-3 font-sans text-[.6rem] tracking-[.5em] text-copper-hi">
            {split("PHOTOGRAPHY & FILMING", "b")}
          </div>
        </div>
      </div>
    </div>
  );
}
