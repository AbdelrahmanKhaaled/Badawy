import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

/** Easing tokens shared across the site so motion feels like one language. */
export const ease = {
  out: "power3.out",
  expo: "expo.out",
  cine: "power4.out",
  spring: "back.out(1.7)",
} as const;

export const INTRO_EVENT = "badawy:reveal";
export const INTRO_KEY = "badawy-intro";

/** Slide-in-from-mask animation for `.line-in` children. Always uses explicit from/to values. */
export function revealLines(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars & { scrollTrigger?: ScrollTrigger.Vars } = {},
) {
  return gsap.fromTo(
    targets,
    { yPercent: 112, y: 0 },
    { yPercent: 0, y: 0, duration: 1.1, ease: ease.cine, stagger: 0.13, ...vars },
  );
}
