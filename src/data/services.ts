/**
 * Service catalogue — single source of truth for the homepage, /services, /services/[slug] and the booking form.
 * Copy describes what the agency coordinates (per the client brief). It makes no claims about prices,
 * named venues, partner counts or results; add those only once the client verifies them.
 */

export type CategoryId = "production" | "events";
export type ServiceKind = "shoot" | "event" | "venue";

export type Service = {
  slug: string;
  category: CategoryId;
  kind: ServiceKind;
  title: string;
  /** One-line summary for cards and lists. */
  short: string;
  /** Paragraph for the detail page. */
  intro: string;
  includes: string[];
  idealFor: string[];
  image: { src: string; alt: string; position?: string };
  /** Booking form options (ids from BOOKING_SERVICES) this page books. The first one is preselected. */
  book: string[];
};

export const categories: Record<CategoryId, { title: string; short: string; eyebrow: string }> = {
  production: {
    title: "Photography & Creative Production",
    eyebrow: "Shoot · Film · Create",
    short: "Crews, direction and post-production for brands, people and celebrations.",
  },
  events: {
    title: "Events, Venues & Locations",
    eyebrow: "Book · Host · Coordinate",
    short: "Conference spaces, event halls, studios and shooting locations — arranged and run for you.",
  },
};

export const services: Service[] = [
  // ---------------- Photography & Creative Production ----------------
  {
    slug: "commercial-photography",
    category: "production",
    kind: "shoot",
    title: "Commercial Photography",
    short: "Product, food, fashion and corporate imagery built for campaigns and catalogues.",
    intro:
      "Studio and on-location commercial photography for brands that need imagery to sell. We handle the creative brief, styling coordination, lighting set-up and retouching, and deliver files sized for web, print and social.",
    includes: ["Creative brief & shot list", "Studio or location arrangement", "Lighting, styling & set coordination", "Retouching and format-ready delivery"],
    idealFor: ["Product launches", "E-commerce catalogues", "Corporate & team imagery", "Menus and hospitality"],
    image: { src: "/images/work-2.png", alt: "Perfume bottle with water droplets", position: "50% 50%" },
    book: ["commercial-photography"],
  },
  {
    slug: "portrait-photography",
    category: "production",
    kind: "shoot",
    title: "Portrait Photography",
    short: "Personal, professional and editorial portraits with cinematic light.",
    intro:
      "Portrait sessions for individuals, executives, artists and teams. We plan the look, book the right studio or location, and direct the session so every frame feels natural and considered.",
    includes: ["Look & mood planning", "Studio or location booking", "Directed session", "Selected, retouched portraits"],
    idealFor: ["Executive & LinkedIn portraits", "Artists and talent", "Family and personal sessions", "Team pages"],
    image: { src: "/images/capture-3.png", alt: "Portrait of a woman in warm light", position: "50% 30%" },
    book: ["portrait-photography"],
  },
  {
    slug: "wedding-photography",
    category: "production",
    kind: "shoot",
    title: "Wedding Photography",
    short: "Full-day wedding stories in photo and film, from preparations to the last dance.",
    intro:
      "Complete wedding coverage with photographers and filmmakers working as one crew. We coordinate the timeline with your planner and venue so nothing important is missed.",
    includes: ["Pre-wedding consultation", "Photo and/or film crew", "Timeline coordination with your venue", "Edited gallery and highlight film"],
    idealFor: ["Weddings", "Engagements & henna nights", "Pre-wedding sessions", "Anniversaries"],
    image: { src: "/images/work-1.png", alt: "Bride and groom embracing in golden light", position: "50% 40%" },
    book: ["wedding-photography"],
  },
  {
    slug: "videography-filmmaking",
    category: "production",
    kind: "shoot",
    title: "Videography & Filmmaking",
    short: "Brand films, documentaries, interviews and social video — shot and finished in-house.",
    intro:
      "Cinematic video production from concept to final cut: scripting support, crew and equipment, filming, editing, colour grading and sound finishing, delivered in every format you need.",
    includes: ["Concept & script support", "Camera, lighting & sound crew", "Editing and colour grading", "Deliverables for web, social and screens"],
    idealFor: ["Brand & corporate films", "Interviews and documentaries", "Social media content", "Music and creative videos"],
    image: { src: "/images/why-choose-us.png", alt: "Cinema camera on a slider under warm light", position: "9% 50%" },
    book: ["videography"],
  },
  {
    slug: "advertising-brand-content",
    category: "production",
    kind: "shoot",
    title: "Advertising & Brand Content",
    short: "Campaign visuals and content built around your marketing goals.",
    intro:
      "Creative and marketing-led production for campaigns. We shape the idea with your team, produce stills and motion in one shoot, and deliver assets sized for every channel.",
    includes: ["Campaign concept with your team", "Combined stills & motion production", "Talent, location and set coordination", "Channel-ready asset packages"],
    idealFor: ["Advertising campaigns", "Product launches", "Social media series", "Brand refreshes"],
    image: { src: "/images/capture-2.png", alt: "Luxury watch product photography", position: "50% 42%" },
    book: ["advertising-brand-content"],
  },
  {
    slug: "event-coverage",
    category: "production",
    kind: "event",
    title: "Event Coverage",
    short: "Photo and video coverage of conferences, launches, galas and celebrations.",
    intro:
      "Multi-camera photo and video coverage for live events. We scout the venue, plan positions around the run-of-show, and can deliver same-day selects for social media.",
    includes: ["Venue walkthrough & shot plan", "Photo and video crews", "Optional same-day social selects", "Edited gallery and recap film"],
    idealFor: ["Conferences & summits", "Product launches", "Galas and award nights", "Private celebrations"],
    image: { src: "/images/capture-4.png", alt: "Live event with stage lighting", position: "50% 50%" },
    book: ["event-photography"],
  },

  // ---------------- Events, Venues & Locations ----------------
  {
    slug: "conference-booking",
    category: "events",
    kind: "event",
    title: "Conference Booking",
    short: "Conference spaces matched to your audience, agenda and technical needs.",
    intro:
      "Tell us your audience size, date and format, and we source and book a suitable conference space, coordinate stage and AV requirements, and can cover the day with our photo and video crews.",
    includes: ["Venue sourcing to your brief", "Stage, AV & seating requirements", "Coordination with the venue team", "Optional photo & video coverage"],
    idealFor: ["Corporate conferences", "Summits and forums", "Training days", "Press conferences"],
    image: { src: "/images/work-4.png", alt: "Conference stage with blue spotlights and audience", position: "50% 50%" },
    book: ["conference-booking"],
  },
  {
    slug: "event-hall-booking",
    category: "events",
    kind: "event",
    title: "Event Hall Booking",
    short: "Halls for weddings, galas, launches and private occasions.",
    intro:
      "We shortlist and book event halls by capacity, style and location, then coordinate set-up details with the venue so your event — and its photography — runs smoothly.",
    includes: ["Hall shortlist by capacity & style", "Booking and date coordination", "Set-up & layout coordination", "Optional photo & film coverage"],
    idealFor: ["Weddings & engagements", "Galas and award nights", "Product launches", "Private celebrations"],
    image: { src: "/images/capture-4.png", alt: "Live event with stage lighting", position: "50% 30%" },
    book: ["event-hall-booking"],
  },
  {
    slug: "photography-studio-booking",
    category: "events",
    kind: "venue",
    title: "Photography Studio Booking",
    short: "Equipped studios for shoots, interviews and content days — with or without our crew.",
    intro:
      "Book a professional studio for a few hours or a full day. Tell us what you are shooting and we arrange the right space, backdrops and lighting — and a crew if you need one.",
    includes: ["Studio matched to your shoot", "Backdrops and lighting arrangement", "Hourly, half-day or full-day booking", "Optional photographer or film crew"],
    idealFor: ["Product & fashion shoots", "Interviews and podcasts", "Portrait sessions", "Content days"],
    image: { src: "/images/about-us.png", alt: "Photographer beside a studio light", position: "50% 16%" },
    book: ["studio-booking"],
  },
  {
    slug: "shooting-locations",
    category: "events",
    kind: "venue",
    title: "Indoor & Outdoor Shooting Locations",
    short: "Interiors, rooftops, landscapes and urban spots arranged for your shoot.",
    intro:
      "Looking for the right backdrop? We find and arrange indoor and outdoor shooting locations to fit your concept, crew size and schedule, and coordinate access on the day.",
    includes: ["Location ideas for your concept", "Access & schedule coordination", "Indoor and outdoor options", "Optional crew and equipment"],
    idealFor: ["Fashion & lifestyle shoots", "Music videos", "Pre-wedding sessions", "Brand films"],
    image: { src: "/images/your-story.png", alt: "Filmmaker silhouette with a camera on a tripod at sunset", position: "16% 55%" },
    book: ["outdoor-location", "indoor-location"],
  },
  {
    slug: "event-production-coordination",
    category: "events",
    kind: "event",
    title: "Event Production Coordination",
    short: "One team coordinating venue, schedule, suppliers and coverage for your event.",
    intro:
      "Complete production coordination for events: we align the venue, run-of-show, suppliers and photo and video coverage, so you deal with one point of contact from planning to delivery.",
    includes: ["Planning & run-of-show", "Venue and supplier coordination", "On-site production management", "Integrated photo & video coverage"],
    idealFor: ["Corporate events", "Launches and activations", "Conferences", "Weddings & private events"],
    image: { src: "/images/hero.png", alt: "Cinematographer operating a cinema camera under warm studio light", position: "70% 50%" },
    book: ["event-production"],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const servicesIn = (c: CategoryId) => services.filter((s) => s.category === c);

/** Icon name (see components/ui/Icon) per service slug. */
export const serviceIcons = {
  "commercial-photography": "camera",
  "portrait-photography": "user",
  "wedding-photography": "sparkles",
  "videography-filmmaking": "clapper",
  "advertising-brand-content": "megaphone",
  "event-coverage": "video",
  "conference-booking": "presentation",
  "event-hall-booking": "building",
  "photography-studio-booking": "studio",
  "shooting-locations": "map",
  "event-production-coordination": "calendar",
} as const;
