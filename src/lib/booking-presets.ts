import { serviceById, type BookingCategory } from "@/lib/booking";

/** Entry points into the booking form. Each CTA opens the form already focused on the right request type. */
export type PresetId = "shoot" | "event" | "location" | "project";

export type Preset = {
  title: string;
  kicker: string;
  text: string;
  category: BookingCategory;
  /** Limit the service choices shown first (user can still reveal all). */
  only?: string[];
  image: string;
  imagePosition?: string;
};

export const PRESETS: Record<PresetId, Preset> = {
  shoot: {
    title: "Book a Shoot",
    kicker: "Photography & Filming",
    text: "Commercial, wedding, portrait, event or brand content — tell us what you want to create.",
    category: "production",
    image: "/images/capture-3.png",
    imagePosition: "50% 30%",
  },
  event: {
    title: "Book an Event",
    kicker: "Conferences & Events",
    text: "Conference spaces, event halls and full production coordination — with coverage built in.",
    category: "events",
    only: ["conference-booking", "event-hall-booking", "event-production"],
    image: "/images/work-4.png",
  },
  location: {
    title: "Find Your Location",
    kicker: "Studios & Shooting Locations",
    text: "Studios, interiors and outdoor locations arranged around your concept and schedule.",
    category: "events",
    only: ["studio-booking", "indoor-location", "outdoor-location"],
    image: "/images/your-story.png",
    imagePosition: "16% 55%",
  },
  project: {
    title: "Let’s Plan Your Project",
    kicker: "Custom Project",
    text: "A full production or not sure where to start? Describe the idea and we’ll shape the plan.",
    category: "project",
    image: "/images/hero.png",
    imagePosition: "70% 50%",
  },
};

export const isPreset = (v: unknown): v is PresetId => typeof v === "string" && v in PRESETS;

/** Best preset for a service id. */
export function presetFor(service?: string): PresetId {
  const s = service ? serviceById(service) : undefined;
  if (!s) return "project";
  if (s.category === "production") return "shoot";
  if (s.category === "project") return "project";
  return PRESETS.location.only!.includes(s.id) ? "location" : "event";
}

/** href for a booking CTA. Works without JS (/book page); with JS the BookingProvider opens the modal instead. */
export function bookHref(o: { preset?: PresetId; service?: string } = {}) {
  const p = new URLSearchParams();
  const preset = o.preset ?? presetFor(o.service);
  p.set("type", preset);
  if (o.service) p.set("service", o.service);
  return `/book?${p.toString()}`;
}
