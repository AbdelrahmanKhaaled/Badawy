/**
 * Booking request schema — shared by the form (client) and /api/booking (server) so both validate identically.
 * Pure TypeScript, no runtime dependencies.
 */

export type BookingCategory = "production" | "events" | "project";
export type FieldKey = "shootType" | "setting" | "attendees" | "venueNeeds" | "duration" | "crewSize";

export type BookingService = {
  id: string;
  category: BookingCategory;
  label: string;
  /** /services/[slug] page that describes it (if any). */
  page?: string;
  /** Extra, service-specific fields. Required ones are listed in `required`. */
  fields: FieldKey[];
  required: FieldKey[];
  shootTypes?: string[];
  /** Label overrides for this service. */
  labels?: Partial<Record<FieldKey | "location" | "date", string>>;
  dateRequired: boolean;
  locationRequired: boolean;
};

export const BOOKING_CATEGORIES: { id: BookingCategory; label: string; hint: string }[] = [
  { id: "production", label: "Photography & Filming", hint: "Shoots, films and coverage" },
  { id: "events", label: "Events & Locations", hint: "Conferences, halls, studios, locations" },
  { id: "project", label: "Custom Project", hint: "A full production or not sure yet" },
];

const shoot = (id: string, label: string, page: string, shootTypes: string[]): BookingService => ({
  id, category: "production", label, page, shootTypes,
  fields: ["shootType", "setting"], required: ["shootType"],
  dateRequired: true, locationRequired: false,
  labels: { location: "Preferred location or venue", date: "Shoot date" },
});

export const BOOKING_SERVICES: BookingService[] = [
  shoot("commercial-photography", "Commercial Photography", "commercial-photography", ["Product", "Food & hospitality", "Fashion & apparel", "Corporate & team", "Real estate & interiors", "Other"]),
  shoot("wedding-photography", "Wedding Photography", "wedding-photography", ["Photo coverage", "Photo + film coverage", "Pre-wedding / engagement session", "Henna / pre-wedding party", "Other"]),
  shoot("portrait-photography", "Portrait Photography", "portrait-photography", ["Professional / executive", "Personal", "Family", "Artist / talent", "Team portraits", "Other"]),
  shoot("videography", "Videography", "videography-filmmaking", ["Brand / corporate film", "Social media content", "Interview / documentary", "Music video", "Event film", "Other"]),
  {
    id: "event-photography", category: "production", label: "Event Photography", page: "event-coverage",
    fields: ["shootType", "attendees", "duration"], required: ["shootType"],
    shootTypes: ["Photo coverage", "Video coverage", "Photo + video coverage", "Live streaming support"],
    dateRequired: true, locationRequired: true,
    labels: { shootType: "Coverage type", location: "Event venue / location", date: "Event date", attendees: "Expected number of attendees" },
  },
  shoot("advertising-brand-content", "Advertising & Brand Content", "advertising-brand-content", ["Campaign stills", "Campaign video", "Stills + video", "Social content series", "Other"]),

  {
    id: "conference-booking", category: "events", label: "Conference Booking", page: "conference-booking",
    fields: ["attendees", "venueNeeds", "duration"], required: ["attendees"],
    dateRequired: true, locationRequired: true,
    labels: { location: "Preferred city / area", date: "Conference date", attendees: "Expected number of attendees", venueNeeds: "Venue requirements" },
  },
  {
    id: "event-hall-booking", category: "events", label: "Event Hall Booking", page: "event-hall-booking",
    fields: ["attendees", "venueNeeds", "duration"], required: ["attendees"],
    dateRequired: true, locationRequired: true,
    labels: { location: "Preferred city / area", date: "Event date", attendees: "Guest capacity needed", venueNeeds: "Hall requirements" },
  },
  {
    id: "studio-booking", category: "events", label: "Photography Studio Booking", page: "photography-studio-booking",
    fields: ["duration", "crewSize", "shootType"], required: ["duration"],
    shootTypes: ["Photo shoot", "Video shoot", "Interview / podcast", "Content day", "Other"],
    dateRequired: true, locationRequired: true,
    labels: { location: "Preferred city / area", date: "Booking date", shootType: "What will you shoot?", crewSize: "People on set (capacity)" },
  },
  {
    id: "indoor-location", category: "events", label: "Indoor Shooting Location", page: "shooting-locations",
    fields: ["duration", "crewSize", "shootType"], required: ["duration"],
    shootTypes: ["Home / apartment", "Office / workspace", "Restaurant / café", "Hotel / luxury interior", "Industrial / warehouse", "Other"],
    dateRequired: true, locationRequired: true,
    labels: { location: "Preferred city / area", date: "Shoot date", shootType: "Location style", crewSize: "People on set (capacity)" },
  },
  {
    id: "outdoor-location", category: "events", label: "Outdoor Shooting Location", page: "shooting-locations",
    fields: ["duration", "crewSize", "shootType"], required: ["duration"],
    shootTypes: ["Desert / nature", "Beach / coast", "Urban / street", "Garden / park", "Rooftop", "Historic site", "Other"],
    dateRequired: true, locationRequired: true,
    labels: { location: "Preferred city / area", date: "Shoot date", shootType: "Location style", crewSize: "People on set (capacity)" },
  },
  {
    id: "event-production", category: "events", label: "Event Production Coordination", page: "event-production-coordination",
    fields: ["attendees", "venueNeeds", "duration"], required: ["attendees"],
    dateRequired: true, locationRequired: false,
    labels: { location: "Venue (if already booked) or preferred area", date: "Event date", attendees: "Expected number of attendees", venueNeeds: "What should we coordinate?" },
  },

  {
    id: "full-production", category: "project", label: "Full Production Package",
    fields: ["attendees"], required: [], dateRequired: false, locationRequired: false,
    labels: { location: "Location or preferred venue", date: "Project date", attendees: "Expected number of attendees (if an event)" },
  },
  {
    id: "not-sure", category: "project", label: "Not sure yet — advise me",
    fields: [], required: [], dateRequired: false, locationRequired: false,
    labels: { location: "Location or preferred venue", date: "Project date" },
  },
];

export const SETTINGS = ["Studio", "Indoor location", "Outdoor location", "At our own venue", "Not sure yet"];
export const DURATIONS = ["Up to 4 hours", "Half day", "Full day", "Multiple days"];
export const VENUE_NEEDS_EVENTS = ["Stage & AV", "Theatre seating", "Banquet / round tables", "Breakout rooms", "Catering area", "Registration desk", "Live streaming", "Parking"];
export const VENUE_NEEDS_PRODUCTION = ["Venue sourcing", "Stage & AV", "Suppliers & catering", "Run-of-show", "Photo coverage", "Video coverage", "Live streaming", "Guest registration"];

export const DEFAULT_LABELS: Record<FieldKey | "location" | "date", string> = {
  shootType: "Shoot type",
  setting: "Preferred setting",
  attendees: "Expected number of attendees",
  venueNeeds: "Requirements",
  duration: "Booking duration",
  crewSize: "People on set",
  location: "Location or preferred venue",
  date: "Event / project date",
};

export const serviceById = (id: string) => BOOKING_SERVICES.find((s) => s.id === id);
export const servicesForCategory = (c: BookingCategory) => BOOKING_SERVICES.filter((s) => s.category === c);
export const labelFor = (s: BookingService | undefined, k: FieldKey | "location" | "date") => s?.labels?.[k] ?? DEFAULT_LABELS[k];
export const venueNeedsFor = (s: BookingService | undefined) => (s?.id === "event-production" ? VENUE_NEEDS_PRODUCTION : VENUE_NEEDS_EVENTS);

export type BookingData = {
  category: BookingCategory | "";
  service: string;
  shootType: string;
  setting: string;
  attendees: string;
  venueNeeds: string[];
  duration: string;
  crewSize: string;
  date: string;
  dateFlexible: boolean;
  location: string;
  budget: string;
  description: string;
  name: string;
  email: string;
  phone: string;
  consent: boolean;
  /** Honeypot — must stay empty. */
  website: string;
};

export const EMPTY_BOOKING: BookingData = {
  category: "", service: "", shootType: "", setting: "", attendees: "", venueNeeds: [], duration: "", crewSize: "",
  date: "", dateFlexible: false, location: "", budget: "", description: "", name: "", email: "", phone: "", consent: false, website: "",
};

export type Errors = Partial<Record<keyof BookingData, string>>;

/** Steps of the form and the fields each one validates. */
export const STEPS = [
  { id: "service", title: "Service", fields: ["category", "service"] },
  { id: "details", title: "Details", fields: ["shootType", "setting", "attendees", "venueNeeds", "duration", "crewSize", "date", "location", "budget", "description"] },
  { id: "contact", title: "Contact", fields: ["name", "email", "phone", "consent"] },
] as const satisfies readonly { id: string; title: string; fields: readonly (keyof BookingData)[] }[];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9\s().-]{7,20}$/;
const MAX = { text: 120, long: 3000 };

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** Validate everything, or only the fields of one step. Returns a field → message map (empty = valid). */
export function validateBooking(d: BookingData, only?: readonly (keyof BookingData)[]): Errors {
  const e: Errors = {};
  const want = (k: keyof BookingData) => !only || only.includes(k);
  const s = serviceById(d.service);
  const has = (k: FieldKey) => !!s?.fields.includes(k);
  const req = (k: FieldKey) => !!s?.required.includes(k);

  if (want("category") && !BOOKING_CATEGORIES.some((c) => c.id === d.category)) e.category = "Choose a service category.";
  if (want("service")) {
    if (!s) e.service = "Choose the specific service you need.";
    else if (s.category !== d.category) e.service = "This service does not belong to the selected category.";
  }

  if (s) {
    if (want("shootType") && has("shootType") && req("shootType") && !d.shootType) e.shootType = `Select ${labelFor(s, "shootType").toLowerCase()}.`;
    if (want("shootType") && d.shootType && s.shootTypes && !s.shootTypes.includes(d.shootType)) e.shootType = "Select one of the listed options.";
    if (want("setting") && d.setting && !SETTINGS.includes(d.setting)) e.setting = "Select one of the listed options.";
    if (want("duration") && has("duration") && req("duration") && !d.duration) e.duration = "Select how long you need.";
    if (want("duration") && d.duration && !DURATIONS.includes(d.duration)) e.duration = "Select one of the listed options.";
    if (want("attendees") && has("attendees")) {
      const n = Number(d.attendees);
      if (!d.attendees && req("attendees")) e.attendees = "Enter the expected number of people.";
      else if (d.attendees && (!Number.isInteger(n) || n < 1 || n > 100000)) e.attendees = "Enter a whole number between 1 and 100,000.";
    }
    if (want("crewSize") && has("crewSize") && d.crewSize) {
      const n = Number(d.crewSize);
      if (!Number.isInteger(n) || n < 1 || n > 500) e.crewSize = "Enter a whole number between 1 and 500.";
    }
    if (want("venueNeeds") && d.venueNeeds.some((v) => !venueNeedsFor(s).includes(v))) e.venueNeeds = "Select from the listed options.";
    if (want("date")) {
      if (!d.date && s.dateRequired && !d.dateFlexible) e.date = "Pick a date, or tick “My date is flexible”.";
      else if (d.date && !/^\d{4}-\d{2}-\d{2}$/.test(d.date)) e.date = "Enter a valid date.";
      else if (d.date && d.date < today()) e.date = "The date cannot be in the past.";
    }
    if (want("location")) {
      if (s.locationRequired && d.location.trim().length < 2) e.location = `Enter the ${labelFor(s, "location").toLowerCase()}.`;
      else if (d.location.length > MAX.text) e.location = `Keep it under ${MAX.text} characters.`;
    }
  }
  if (want("budget") && d.budget.length > MAX.text) e.budget = `Keep it under ${MAX.text} characters.`;
  if (want("description")) {
    const len = d.description.trim().length;
    if (len < 20) e.description = "Tell us a little more (at least 20 characters).";
    else if (len > MAX.long) e.description = `Keep it under ${MAX.long} characters.`;
  }
  if (want("name")) {
    const n = d.name.trim();
    if (n.length < 2) e.name = "Enter your full name.";
    else if (n.length > MAX.text) e.name = `Keep it under ${MAX.text} characters.`;
  }
  if (want("email") && !EMAIL.test(d.email.trim())) e.email = "Enter a valid email address.";
  if (want("phone") && !PHONE.test(d.phone.trim())) e.phone = "Enter a valid phone number (digits, spaces, +).";
  if (want("consent") && !d.consent) e.consent = "Please confirm we may contact you about this request.";
  return e;
}

/** Structured, processing-friendly record (what the webhook / email receives). Drops fields that do not apply. */
export function toRecord(d: BookingData, meta: { id: string; receivedAt: string; source?: string }) {
  const s = serviceById(d.service)!;
  const cat = BOOKING_CATEGORIES.find((c) => c.id === d.category)!;
  const details: Record<string, string | number | string[] | boolean> = {};
  for (const k of s.fields) {
    const v = d[k];
    if (Array.isArray(v) ? v.length : v) details[k] = k === "attendees" || k === "crewSize" ? Number(v) : v;
  }
  return {
    id: meta.id,
    receivedAt: meta.receivedAt,
    source: meta.source ?? "website",
    category: { id: cat.id, label: cat.label },
    service: { id: s.id, label: s.label },
    contact: { name: d.name.trim(), email: d.email.trim(), phone: d.phone.trim() },
    schedule: { date: d.date || null, dateFlexible: d.dateFlexible },
    location: d.location.trim() || null,
    budget: d.budget.trim() || null,
    details,
    fieldLabels: Object.fromEntries(s.fields.map((k) => [k, labelFor(s, k)])),
    description: d.description.trim(),
  };
}
export type BookingRecord = ReturnType<typeof toRecord>;

/** Coerce untrusted JSON into BookingData (unknown keys dropped, wrong types blanked). */
export function coerceBooking(input: unknown): BookingData {
  const o = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const str = (k: keyof BookingData) => (typeof o[k] === "string" ? (o[k] as string).slice(0, 4000) : "");
  return {
    category: str("category") as BookingCategory,
    service: str("service"),
    shootType: str("shootType"),
    setting: str("setting"),
    attendees: typeof o.attendees === "number" ? String(o.attendees) : str("attendees"),
    venueNeeds: Array.isArray(o.venueNeeds) ? o.venueNeeds.filter((v): v is string => typeof v === "string").slice(0, 20) : [],
    duration: str("duration"),
    crewSize: typeof o.crewSize === "number" ? String(o.crewSize) : str("crewSize"),
    date: str("date"),
    dateFlexible: o.dateFlexible === true,
    location: str("location"),
    budget: str("budget"),
    description: str("description"),
    name: str("name"),
    email: str("email"),
    phone: str("phone"),
    consent: o.consent === true,
    website: str("website"),
  };
}

/** Plain-text summary — used for the email notification and the mailto fallback. */
export function summarize(d: BookingData) {
  const s = serviceById(d.service);
  const cat = BOOKING_CATEGORIES.find((c) => c.id === d.category);
  const lines = [
    `Service: ${cat?.label ?? "-"} — ${s?.label ?? "-"}`,
    ...(s?.fields ?? []).flatMap((k) => {
      const v = d[k];
      const out = Array.isArray(v) ? v.join(", ") : v;
      return out ? [`${labelFor(s, k)}: ${out}`] : [];
    }),
    `${labelFor(s, "date")}: ${d.date || (d.dateFlexible ? "Flexible" : "-")}`,
    `${labelFor(s, "location")}: ${d.location || "-"}`,
    `Estimated budget: ${d.budget || "-"}`,
    "",
    "Project description:",
    d.description,
    "",
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Phone: ${d.phone}`,
  ];
  return lines.join("\n");
}
