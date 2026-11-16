/**
 * Editable site content.
 *
 * ⚠ UNVERIFIED / DEMO values are flagged with `demo: true`. They come from the design mockup and
 * must be confirmed by the client before public launch. Set NEXT_PUBLIC_SHOW_DEMO_LABELS=false
 * once everything is verified to hide the on-page "demo" tags.
 */
export const SHOW_DEMO_LABELS = process.env.NEXT_PUBLIC_SHOW_DEMO_LABELS !== "false";

export const site = {
  name: "Badawy Productions",
  tagline: "Photography, Marketing & Event Production Agency",
  title: "BADAWY PRODUCTIONS — Photography, Marketing & Event Production Agency",
  description:
    "Photography, filming, conferences, event halls, studios and shooting locations — coordinated by one production agency, from first brief to final delivery.",
  phoneDisplay: "+20 111 966 6345",
  phoneHref: "tel:+201119666345",
  whatsappHref: "https://wa.me/201119666345",
  email: "M.Badawyproductions@gmail.com",
  emailHref: "mailto:M.Badawyproductions@gmail.com",
  social: {
    label: "Badawy Productions",
    // Only verified profile URLs (NEXT_PUBLIC_FACEBOOK_URL / NEXT_PUBLIC_INSTAGRAM_URL). Icons are hidden while unset.
    facebook: (process.env.NEXT_PUBLIC_FACEBOOK_URL || null) as string | null,
    instagram: (process.env.NEXT_PUBLIC_INSTAGRAM_URL || null) as string | null,
  },
};

/**
 * Contact-page map. No verified address/coordinates were supplied, so by default the map shows the country
 * (derived from the +20 phone number) and NO street address is invented. Configure any ONE of these:
 *   NEXT_PUBLIC_MAP_EMBED_URL   full Google Maps "Embed a map" iframe src (most precise)
 *   NEXT_PUBLIC_MAP_LAT + NEXT_PUBLIC_MAP_LNG   coordinates
 *   NEXT_PUBLIC_MAP_QUERY       address / place name to search
 * plus optional NEXT_PUBLIC_LOCATION_LABEL (e.g. "New Cairo, Egypt") and NEXT_PUBLIC_LOCATION_ADDRESS (street address shown as text).
 */
const v = (s: string | undefined) => s?.trim() || null; // static process.env.X accesses so Next can inline them
const mapEmbed = v(process.env.NEXT_PUBLIC_MAP_EMBED_URL);
const mapLat = v(process.env.NEXT_PUBLIC_MAP_LAT);
const mapLng = v(process.env.NEXT_PUBLIC_MAP_LNG);
const mapQ = v(process.env.NEXT_PUBLIC_MAP_QUERY);
const locAddress = v(process.env.NEXT_PUBLIC_LOCATION_ADDRESS);
const mapQuery = mapLat && mapLng ? `${mapLat},${mapLng}` : mapQ ?? locAddress ?? "Egypt";
const precise = !!(mapEmbed || (mapLat && mapLng) || mapQ || locAddress);
export const location = {
  label: v(process.env.NEXT_PUBLIC_LOCATION_LABEL) ?? "Egypt",
  address: locAddress,
  precise,
  embedUrl: mapEmbed ?? `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=${precise ? 15 : 6}&output=embed`,
  mapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
};

/** Primary navigation — real App Router pages. */
export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
] as const;

/** Featured projects (images = assets.works, same order). `service` = /services/[slug]; `book` = booking form service id. */
export const projects = [
  { title: "Wedding Film", sub: "A Timeless Love Story", category: "Wedding Film", service: "wedding-photography", book: "wedding-photography" },
  { title: "Commercial Shoot", sub: "Product & Brand Film", category: "Commercial Shoot", service: "commercial-photography", book: "commercial-photography" },
  { title: "Cinematic Portraits", sub: "People · Identity · Emotion", category: "Cinematic Portraits", service: "portrait-photography", book: "portrait-photography" },
  { title: "Events & Coverage", sub: "Conferences, Launches & Special Events", category: "Events & Coverage", service: "event-coverage", book: "event-photography" },
] as const;

/** How a request is handled — describes the process, makes no performance claims. */
export const workflow = [
  { n: "01", title: "Brief", text: "Tell us what you need — a shoot, an event, a venue or all three." },
  { n: "02", title: "Plan", text: "We propose crew, venue or location, schedule and deliverables." },
  { n: "03", title: "Book & produce", text: "We confirm bookings and run the production on the day." },
  { n: "04", title: "Deliver", text: "Edited photos, films and assets — ready for every channel." },
] as const;

/** Draft marketing copy pending client approval. */
export const benefits = [
  { title: "One Point of Contact", icon: "users", text: "One coordinated team for the shoot, the venue and the schedule — no juggling suppliers." },
  { title: "Venues, Studios & Locations", icon: "map", text: "We arrange the space as well as the shoot: conference halls, event venues, studios and outdoor sets." },
  { title: "Creative & Marketing Thinking", icon: "gem", text: "Content planned around your audience and goals, not just good-looking pictures." },
  { title: "Production You Can Rely On", icon: "award", text: "Professional crews, cinema-grade equipment and organised, on-time delivery." },
] as const;

/** DEMO values from the mockup — not verified company achievements. */
export const stats = [
  { value: 500, suffix: "+", label: "Projects Completed", icon: "camera", demo: true },
  { value: 200, suffix: "+", label: "Satisfied Clients", icon: "users", demo: true },
  { value: 15, suffix: "+", label: "Years of Experience", icon: "trophy", demo: true },
  { value: 50, suffix: "M+", label: "Views Generated", icon: "play", demo: true },
] as const;

/** DEMO testimonials for development only — replace with verified client quotes. */
export const testimonials = [
  {
    quote: "An exceptional team with a true artistic vision. They turned our idea into a stunning visual story that exceeded our expectations.",
    name: "Ahmed Fathy",
    role: "Marketing Manager – ABC Brand",
    rating: 5,
    demo: true,
  },
  {
    quote: "Placeholder testimonial — replace this slot with a verified client quote before launch.",
    name: "Client Name",
    role: "Role – Company",
    rating: 5,
    demo: true,
  },
  {
    quote: "Placeholder testimonial — replace this slot with a verified client quote before launch.",
    name: "Client Name",
    role: "Role – Company",
    rating: 5,
    demo: true,
  },
] as const;

/** Client logos shown in the mockup. Require client confirmation before public deployment. */
export const CLIENT_LOGOS_NEED_CONFIRMATION = true;
