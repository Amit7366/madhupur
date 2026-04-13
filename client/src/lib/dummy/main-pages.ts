import type { ContentIconKey } from "@/lib/content-icons";

export type MainPageCard = {
  id: string;
  category: string;
  title: string;
  description: string;
  meta?: string;
  icon: ContentIconKey;
  href?: string;
};

/* —— Services —— */
export const SERVICES_ORDER = ["all", "permits", "utilities", "social"] as const;

export const SERVICES_ITEMS: MainPageCard[] = [
  {
    id: "s1",
    category: "permits",
    title: "Trade license renewal",
    description:
      "Apply or renew trade licenses online. Typical processing: 5–7 working days.",
    meta: "Digital service",
    icon: "briefcase",
    href: "#",
  },
  {
    id: "s2",
    category: "utilities",
    title: "Water connection request",
    description:
      "New meter installation and transfer forms for residential blocks.",
    meta: "Utilities",
    icon: "waves",
  },
  {
    id: "s3",
    category: "social",
    title: "Senior citizen allowance",
    description:
      "Eligibility check and document checklist for municipal social support.",
    meta: "Social",
    icon: "heartHandshake",
  },
  {
    id: "s4",
    category: "permits",
    title: "Building plan approval",
    description:
      "Submit structural drawings for review before construction begins.",
    meta: "Planning",
    icon: "fileText",
  },
];

/* —— Offices —— */
export const OFFICES_ORDER = ["all", "ward", "central", "field"] as const;

export const OFFICES_ITEMS: MainPageCard[] = [
  {
    id: "o1",
    category: "ward",
    title: "Ward 4 service desk",
    description: "Birth certificates, assessments, and local grievances.",
    meta: "Mon–Fri · 9–5",
    icon: "building2",
  },
  {
    id: "o2",
    category: "central",
    title: "Municipal headquarters",
    description: "Mayor’s office, treasury, and engineering counters.",
    meta: "Main plaza",
    icon: "landmark",
  },
  {
    id: "o3",
    category: "field",
    title: "Mobile help unit",
    description: "Rotating visits to outer villages — schedule posted monthly.",
    meta: "Field team",
    icon: "bus",
  },
];

/* —— Health —— */
export const HEALTH_ORDER = ["all", "clinic", "programs", "pharmacy"] as const;

export const HEALTH_ITEMS: MainPageCard[] = [
  {
    id: "h1",
    category: "clinic",
    title: "Town health center",
    description: "OPD, immunization, and maternal health walk-ins.",
    meta: "Open daily",
    icon: "stethoscope",
  },
  {
    id: "h2",
    category: "programs",
    title: "Diabetes screening drive",
    description: "Free HbA1c slots every second Thursday — booking opens Monday.",
    meta: "Program",
    icon: "heartPulse",
  },
  {
    id: "h3",
    category: "pharmacy",
    title: "Generic medicine outlet",
    description: "Subsidized prescriptions for enrolled chronic-care patients.",
    meta: "Wing B",
    icon: "briefcase",
  },
];

/* —— Education —— */
export const EDUCATION_ORDER = ["all", "schools", "training", "childcare"] as const;

export const EDUCATION_ITEMS: MainPageCard[] = [
  {
    id: "e1",
    category: "schools",
    title: "Enrollment window · 2026",
    description: "Documents and online pre-registration for primary sections.",
    meta: "Jan15–Feb 15",
    icon: "school",
  },
  {
    id: "e2",
    category: "training",
    title: "Youth skills lab",
    description: "Carpentry and digital literacy cohorts — 12-week cycles.",
    meta: "Apply online",
    icon: "gradCap",
  },
  {
    id: "e3",
    category: "childcare",
    title: "Early learning hubs",
    description: "Play-based readiness programs in three community centers.",
    meta: "Ages 3–5",
    icon: "baby",
  },
];

/* —— Emergency —— */
export const EMERGENCY_ORDER = ["all", "numbers", "shelters", "tips"] as const;

export const EMERGENCY_ITEMS: MainPageCard[] = [
  {
    id: "em1",
    category: "numbers",
    title: "National emergency hotline",
    description: "Use for life-threatening incidents requiring immediate response.",
    meta: "24/7",
    icon: "siren",
    href: "tel:999",
  },
  {
    id: "em2",
    category: "numbers",
    title: "Municipal duty officer",
    description: "After-hours line for floods, fallen trees, and power hazards.",
    meta: "Night & weekends",
    icon: "phone",
    href: "tel:+15550001122",
  },
  {
    id: "em3",
    category: "shelters",
    title: "Storm shelter — East hall",
    description: "Capacity 120, wheelchair access, pet-friendly zone in annex.",
    meta: "Map grid C4",
    icon: "shield",
  },
  {
    id: "em4",
    category: "tips",
    title: "Flood readiness checklist",
    description: "Sandbag points, valve shutdown, and evacuation kit PDF.",
    meta: "Guide",
    icon: "fileText",
  },
];

/* —— Tourism —— */
export const TOURISM_ORDER = ["all", "heritage", "nature", "food"] as const;

export const TOURISM_ITEMS: MainPageCard[] = [
  {
    id: "t1",
    category: "heritage",
    title: "Old courthouse walk",
    description: "Self-guided plaques and weekend volunteer-led tours.",
    meta: "Heritage trail",
    icon: "landmark",
  },
  {
    id: "t2",
    category: "nature",
    title: "River overlook trail",
    description: "3 km loop, bird hides, and seasonal wildflower markers.",
    meta: "Easy hike",
    icon: "trees",
  },
  {
    id: "t3",
    category: "food",
    title: "Night market — Fridays",
    description: "Street food permits, live music, and family seating zones.",
    meta: "6–11 pm",
    icon: "utensils",
  },
];

/* —— Notices —— */
export const NOTICES_ORDER = ["all", "infrastructure", "events", "council"] as const;

export const NOTICES_ITEMS: MainPageCard[] = [
  {
    id: "n1",
    category: "infrastructure",
    title: "Road resurfacing — Lake Road",
    description: "Single-lane closures Apr 22–26. Detour via Hill Street.",
    meta: "Apr 10, 2025",
    icon: "bell",
  },
  {
    id: "n2",
    category: "events",
    title: "Independence fair — vendor lottery",
    description: "Applications close Apr 30. Results published May 5.",
    meta: "Apr 2, 2025",
    icon: "fileText",
  },
  {
    id: "n3",
    category: "council",
    title: "Budget hearing — public comment",
    description: "Register to speak by noon the day before the session.",
    meta: "Mar 28, 2025",
    icon: "building2",
  },
];

/* —— News —— empty to showcase empty state */
export const NEWS_ORDER = ["all", "local", "region"] as const;

export const NEWS_ITEMS: MainPageCard[] = [];

/* —— Gallery —— */
export const GALLERY_ORDER = ["all", "landmarks", "events", "culture"] as const;

export const GALLERY_ITEMS: MainPageCard[] = [
  {
    id: "g1",
    category: "landmarks",
    title: "Sunrise at the old bridge",
    description: "Winter photo walk contest — honorable mention collection.",
    meta: "Photo",
    icon: "camera",
  },
  {
    id: "g2",
    category: "events",
    title: "Harvest festival parade",
    description: "Float lineup and marching bands along Main Street.",
    meta: "Album · 48",
    icon: "camera",
  },
  {
    id: "g3",
    category: "culture",
    title: "Youth theater rehearsal",
    description: "Behind-the-scenes from the spring production.",
    meta: "Video stills",
    icon: "camera",
  },
];

/* —— Contacts —— */
export const CONTACTS_ORDER = ["all", "admin", "technical", "public"] as const;

export const CONTACTS_ITEMS: MainPageCard[] = [
  {
    id: "c1",
    category: "admin",
    title: "General inquiries",
    description: "Front desk routing for certificates, taxes, and appointments.",
    meta: "info@town.gov",
    icon: "phone",
    href: "mailto:info@town.gov",
  },
  {
    id: "c2",
    category: "technical",
    title: "IT & portal support",
    description: "Password resets and online form errors — include screenshot.",
    meta: "help@town.gov",
    icon: "fileText",
    href: "mailto:help@town.gov",
  },
  {
    id: "c3",
    category: "public",
    title: "Visit us",
    description: "100 Civic Square — reception guides you to the right counter.",
    meta: "Map · Pin A",
    icon: "mapPin",
  },
];

/* —— About —— (no filters) */
export const ABOUT_ITEMS: MainPageCard[] = [
  {
    id: "a1",
    category: "about",
    title: "Our mission",
    description:
      "Transparent services, inclusive growth, and resilient infrastructure for every neighborhood.",
    meta: "Who we are",
    icon: "target",
  },
  {
    id: "a2",
    category: "about",
    title: "Values",
    description:
      "Accountability, respect, and data-informed decisions guide our daily work.",
    meta: "Principles",
    icon: "heartHandshake",
  },
  {
    id: "a3",
    category: "about",
    title: "Open information",
    description:
      "Budget summaries and council minutes are published within five working days.",
    meta: "Transparency",
    icon: "info",
  },
];
