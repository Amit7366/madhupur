import { MAP_PLACE_CATEGORIES, type MapPlaceCategory } from "@/lib/map-place-categories";
import type { MapSearchUserIntent } from "@/lib/map-search-filters";

/** Strong phrase lists for high-signal categories; others use tokenized fallback. */
const CATEGORY_PATTERNS: Partial<Record<MapPlaceCategory, RegExp[]>> = {
  hospital: [
    /hospital|clinic|doctor|medical|health|icu|opd|diagnostic/i,
    /\u09b9\u09be\u09b8\u09aa\u09be\u09a4\u09be\u09b2|\u09b8\u09cd\u09ac\u09be\u09b8\u09cd\u09a5\u09cd\u09af|\u0995\u09cd\u09b2\u09bf\u09a8\u09bf\u0995|\u09a1\u09be\u0995\u09cd\u09a4\u09be\u09b0|\u099a\u09bf\u0995\u09bf\u09ce\u09a4\u09cd\u09b8\u09be|\u0985\u09b8\u09c1\u09b8\u09cd\u09a5/i,
  ],
  clinic: [/clinic|poly|physician|gp\b/i, /\u0995\u09cd\u09b2\u09bf\u09a8\u09bf\u0995|\u09aa\u09b0\u09be\u09ae\u09b0\u09cd\u09b6/i],
  pharmacy: [
    /pharmacy|medicine|drugstore|prescription|chemist/i,
    /\u09ab\u09be\u09b0\u09cd\u09ae\u09c7\u09b8\u09bf|\u0993\u09b7\u09c1\u09a6|\u09ae\u09c7\u09a1\u09bf\u09b8\u09bf\u09a8/i,
  ],
  diagnostic_center: [/diagnostic|lab\b|pathology|x-?ray|mri|ct\b/i, /\u09a1\u09be\u09af\u09bc\u09be\u0997\u09a8\u09cb\u09b8\u09cd\u099f\u09bf\u0995|\u09aa\u09b0\u09c0\u0995\u09cd\u09b7\u09be\u0997\u09be\u09b0/i],
  ambulance: [/ambulance|ems\b/i, /\u098f\u09ae\u09cd\u09ac\u09c1\u09b2\u09c7\u09a8\u09b8/i],
  blood_bank: [/blood\s*bank|donat(e|ion)\s*blood/i, /\u09b0\u0995\u09cd\u09a4|\u09ac\u09cd\u09b2\u09be\u09a1\s*\u09ac\u09cd\u09af\u09be\u0999\u09cd\u0995/i],
  veterinary: [/vet(erinary)?|animal\s*clinic|livestock\s*doctor/i, /\u09aa\u09b6\u09c1\u09aa\u09be\u09b2\u0995|\u09ad\u09c7\u099f\u09c7\u09b0\u09bf\u09a8\u09be\u09b0\u09bf/i],
  police: [
    /police|station|thana|law|officer|complaint|crime/i,
    /\u09a5\u09be\u09a8\u09be|\u09aa\u09c1\u09b2\u09bf\u09b6|\u0993\u09b8\u09bf/i,
  ],
  fire_service: [
    /fire\s*service|firefighter|fire\s*station|civil\s*defence|rescue/i,
    /\u09ab\u09be\u09af\u09bc\u09be\u09b0|\u0986\u0997\u09c1\u09a8|\u0989\u09a6\u09cd\u09a7\u09be\u09b0|\u09a6\u09ae\u0995\u09b2/i,
  ],
  disaster_shelter: [/shelter|cyclone\s*shelter|evacuation/i, /\u0986\u09b6\u09cd\u09f0\u09af\u09bc\u09a8|\u09aa\u09cd\u09b0\u09be\u0995\u09c3\u09a4\u09bf\u0995\u09c7\u09a8\u09cd\u09a6\u09cd\u09b0/i],
  legal_aid: [/legal\s*aid|lawyer|court|notary|advocate/i, /\u0986\u0987\u09a8\u09b8\u0982\u09b8\u09cd\u09a5\u09be|\u0989\u0995\u09bf\u09b2|\u0986\u09a6\u09be\u09b2\u09a4/i],
  union_office: [
    /\bunion\b|parishad|ward\s*office/i,
    /\u0987\u0989\u09a8\u09bf\u09af\u09bc\u09a8|\u09aa\u09b0\u09bf\u09b7\u09a6|\u0993\u09af\u09bc\u09be\u09b0\u09cd\u09a1/i,
  ],
  upazila_office: [/upazila|sub[- ]?district|uno\b/i, /\u0989\u09aa\u099c\u09c7\u09b2\u09be|\u0987\u0989\u09a8\u09cb/i],
  land_office: [/land\s*office|mutation|khatian|deed/i, /\u09aa\u09cd\u09b0\u09ae\u09be\u09a3|\u0996\u09be\u09a4\u09bf\u09af\u09bc\u09be\u09a8|\u099c\u09ae\u09bf/i],
  passport_office: [/passport|immigration/i, /\u09aa\u09be\u09b8\u09aa\u09cb\u09b0\u09cd\u099f|\u0987\u09ae\u09bf\u0997\u09cd\u09b0\u09c7\u09b6\u09a8/i],
  post_office: [/post\s*office|postal|mail\b/i, /\u09a1\u09be\u0995|\u09aa\u09cb\u09b8\u09cd\u099f/i],
  election_office: [/election|voter|commission/i, /\u09a8\u09bf\u09b0\u09cd\u09ac\u09be\u099a\u09a8|\u09ad\u09cb\u099f\u09be\u09b0/i],
  social_service_office: [/social\s*service|welfare|allowance/i, /\u09b8\u09be\u09ae\u09be\u099c\u09bf\u0995|\u09aa\u09cd\u09b0\u09a4\u09bf\u09b0\u09cb\u09a7/i],
  school: [
    /school|kindergarten|primary|secondary\s*school/i,
    /\u09ac\u09bf\u09a6\u09cd\u09af\u09be\u09b2\u09df|\u09b8\u09cd\u0995\u09c1\u09b2|\u09b6\u09bf\u0995\u09cd\u09b7\u09be|\u099b\u09be\u09a4\u09cd\u09b0/i,
  ],
  college: [/college|hsc|ssc\s*college/i, /\u0995\u09b2\u09c7\u099c|\u09ae\u09be\u09a6\u09cd\u09b0\u09be\u09b8\u09be/i],
  university: [/university|varsity|campus/i, /\u09ac\u09bf\u09b6\u09cd\u09ac\u09ac\u09bf\u09a6\u09cd\u09af\u09be\u09b2\u09df|\u0987\u0989\u09a8\u09bf\u09ad\u09be\u09b0\u09cd\u09b8\u09bf\u099f\u09bf/i],
  madrasa: [/madrasa|madrasah|qawmi/i, /\u09ae\u09be\u09a6\u09cd\u09b0\u09be\u09b8\u09be|\u0995\u09be\u09f1\u09ae\u09bf/i],
  coaching_center: [/coaching|admission\s*prep|tutor/i, /\u0995\u09cb\u099a\u09bf\u0982|\u09aa\u09cd\u09b0\u09b6\u09bf\u0995\u09cd\u09b7\u09a3/i],
  library: [/library|reading\s*room/i, /\u09aa\u09be\u09a0\u09be\u0997\u09be\u09b0|\u09b2\u09be\u0987\u09ac\u09cd\u09b0\u09c7\u09b0\u09bf/i],
  mosque: [/mosque|masjid|jame/i, /\u09ae\u09b8\u09cd\u099c\u09bf\u09a6|\u09ae\u09cb\u09b9\u09b2\u09cd\u09b2\u09be/i],
  temple: [/temple|mandir|pagoda/i, /\u09ae\u09a8\u09cd\u09a6\u09bf\u09b0|\u09ae\u09a8\u09cd\u09a6\u09bf\u09b0/i],
  church: [/church|cathedral|mission/i, /\u099a\u09be\u09b0\u09cd\u099a|\u0997\u09bf\u09b0\u099c\u09be/i],
  pagoda: [/pagoda|stupa/i, /\u09b8\u09cd\u09a4\u09c2\u09aa|\u09aa\u09cd\u09af\u09be\u0997\u09cb\u09a1\u09be/i],
  restaurant: [
    /restaurant|dining|eat|lunch|dinner/i,
    /\u09b0\u09c7\u09b8\u09cd\u099f\u09c1\u09b0\u09c7\u09a8\u09cd\u099f|\u0996\u09be\u09ac\u09be\u09b0/i,
  ],
  hotel_food: [/hotel(?!\s*booking)|lodging\s*food/i, /\u09b9\u09cb\u099f\u09c7\u09b2|\u09b2\u09cd\u09af\u09be\u099c|\u0996\u09be\u09ac\u09be\u09b0/i],
  fast_food: [/fast\s*food|burger|pizza|fried\s*chicken/i, /\u09ab\u09be\u09b8\u09cd\u099f\s*\u09ab\u09c1\u09a1|\u09ac\u09b0\u09cd\u0997\u09be\u09b0/i],
  cafe: [/cafe|coffee\s*shop|espresso/i, /\u0995\u09cd\u09af\u09be\u09ab\u09c7|\u0995\u09ab\u09bf/i],
  bakery: [/bakery|cake\s*shop|pastry/i, /\u09ac\u09c7\u0995\u09be\u09b0\u09bf|\u09aa\u09c7\u09b8\u09cd\u099f\u09cd\u09b0\u09bf/i],
  super_shop: [/super\s*shop|department\s*store|hypermarket/i, /\u09b8\u09c1\u09aa\u09be\u09b0\s*\u09b6\u09aa|\u09a1\u09bf\u09aa\u09be\u09b0\u09cd\u099f\u09ae\u09c7\u09a8\u09cd\u099f/i],
  grocery_store: [/grocery|provision|kirana/i, /\u09ae\u09c1\u09a6\u09bf\u09b0\u09be\u09ae|\u0997\u09cd\u09b0\u09cb\u09b8\u09be\u09b0\u09bf/i],
  bazaar: [/bazaar|market|hat\b/i, /\u09ac\u09be\u099c\u09be\u09b0|\u09b9\u09be\u099f|\u09ac\u09be\u099c\u09be\u09b0/i],
  shopping_mall: [/mall|shopping\s*cent(er|re)/i, /\u09ae\u09b2|\u09b8\u09aa\u09bf\u0982\s*\u09ae\u09b2/i],
  clothing_store: [/cloth(es|ing)?\s*shop|garments|boutique/i, /\u0995\u09be\u09aa\u09a1\u09bc|\u0997\u09be\u09b0\u09cd\u09ae\u09c7\u09a8\u09cd\u099f\u09b8/i],
  electronics_store: [/electronics|mobile\s*shop|computer\s*shop/i, /\u0987\u09b2\u09c7\u0995\u09cd\u099f\u09cd\u09b0\u09a8\u09bf\u0995\u09cd\u09b8|\u09ae\u09cb\u09ac\u09be\u0987\u09b2/i],
  tourist_spot: [/tourist|sightseeing|attraction/i, /\u09aa\u09b0\u09cd\u09af\u099f\u0995|\u09a6\u09b0\u09cd\u09b6\u09a8\u09c0\u09af\u09bc/i],
  park: [/park\b|playground|garden/i, /\u09aa\u09be\u09b0\u09cd\u0995|\u0996\u09c7\u09b2\u09be\u09b0\s*\u09ae\u09be\u09a0/i],
  resort: [/resort|eco\s*resort/i, /\u09b0\u09bf\u099c\u09b0\u09cd\u099f/i],
  guest_house: [/guest\s*house|bnb|bed\s*and\s*breakfast/i, /\u0997\u09c7\u09b8\u09cd\u099f\s*\u09b9\u09be\u0989\u09b8/i],
  historical_place: [/heritage|historic|museum|fort\b/i, /\u0987\u09a4\u09bf\u09b9\u09be\u09b8|\u099c\u09be\u09a4\u09c0\u09af\u09bc\s*\u09b8\u09cd\u09a5\u09be\u09a8|\u099c\u09be\u09a6\u09c1\u0998\u09b0/i],
  bus_stand: [
    /bus\s*stand|bus\s*stop|terminal|coach/i,
    /\u09ac\u09be\u09b8\s*\u09b8\u09cd\u099f\u09cd\u09af\u09be\u09a8\u09cd\u09a1|\u099f\u09be\u09b0\u09cd\u09ae\u09bf\u09a8\u09be\u09b2/i,
  ],
  train_station: [/train\s*station|railway/i, /\u09b0\u09c7\u09b2\u09b8\u09cd\u099f\u09c7\u09b6\u09a8|\u099f\u09cd\u09b0\u09c7\u09a8/i],
  ferry_terminal: [/ferry|launch\s*ghat|river\s*port/i, /\u09ab\u09c7\u09b0\u09bf|\u09b2\u09cd\u09af\u09be\u0982\u099a|\u0998\u09be\u099f/i],
  cng_stand: [/cng|auto\s*rickshaw\s*stand/i, /\u09b8\u09bf\u098f\u09a8\u099c\u09bf|\u0985\u099f\u09cb/i],
  car_rental: [/car\s*rent|hire\s*car|rent-a-car/i, /\u0997\u09be\u09dc\u09bf\s*\u09ad\u09a1\u09bc\u09be|\u09b0\u09c7\u09a8\u09cd\u099f\u09be\u09b2/i],
  bank: [/bank\b(?!ruptcy)|branch\s*office/i, /\u09ac\u09cd\u09af\u09be\u0999\u09cd\u0995|\u09ac\u09cd\u09af\u09be\u0999\u09cd\u0995\s*\u09b6\u09be\u0996\u09be/i],
  atm: [
    /atm|cash\s*machine|withdraw/i,
    /\u098f\u099f\u09bf\u098f\u09ae|\u09a8\u0997\u09a6|\u099f\u09be\u0995\u09be/i,
  ],
  mobile_banking_agent: [/bkash|nagad|rocket|upay|mobile\s*bank/i, /\u09ac\u09bf\u0995\u09be\u09b6|\u09a8\u0997\u09a6|\u09b0\u09be\u0995\u09c7\u099f/i],
  microfinance: [/micro\s*finance|microcredit|ngo\s*loan/i, /\u09ae\u09be\u0987\u0995\u09cd\u09b0\u09cb\u09ab\u09be\u0987\u09a8\u09cd\u09af\u09be\u09a8\u09cd\u09b8|\u09b8\u09c1\u09a6/i],
  electric_office: [/electric|power\s*office|palli\s*bidyut|desco|bpdb/i, /\u09ac\u09bf\u09a6\u09cd\u09af\u09c1\u09a4|\u09aa\u09cd\u09b0\u09ac\u09be\u09b9|\u09ac\u09bf\u09a6\u09cd\u09af\u09c1\u09a4\s*\u0985\u09ab\u09bf\u09b8/i],
  water_office: [/water\s*office|was|wasa/i, /\u09aa\u09be\u09a8\u09bf\u09af\u09bc|\u0993\u09af\u09bc\u09be\u09b8\u09be/i],
  internet_provider: [/internet|isp|broadband|fiber|wifi\s*provider/i, /\u0987\u09a8\u09cd\u099f\u09be\u09b0\u09a8\u09c7\u099f|\u09ac\u09cd\u09b0\u09cb\u09a1\u09ac\u09cd\u09af\u09be\u09a8\u09cd\u09a1/i],
  repair_service: [/repair|workshop|mechanic|service\s*center/i, /\u09ae\u09b0\u09be\u09ae\u09a4|\u0993\u09af\u09bc\u09be\u09b0\u09cd\u0995\u09b6\u09aa|\u09ae\u09bf\u0995\u09cd\u09af\u09be\u09a8\u09bf\u0995/i],
  printing_service: [/printing|press|photocopy|xerox/i, /\u09aa\u09cd\u09b0\u09bf\u09a8\u09cd\u099f\u09bf\u0982|\u09aa\u09cd\u09b0\u09c7\u09b8|\u09ab\u09cb\u099f\u09cb\u0995\u09aa\u09bf/i],
  company: [/company|corporate\s*office|head\s*office/i, /\u0995\u09cb\u09ae\u09cd\u09aa\u09be\u09a8\u09bf|\u0995\u09be\u09b0\u09cd\u09af\u09be\u09b2\u09df/i],
  factory: [/factory|mill\b|plant\b/i, /\u0995\u09b0\u0996\u09be\u09a8\u09be|\u09ae\u09bf\u09b2/i],
  job_center: [/job\s*center|employment|recruitment/i, /\u099a\u09be\u0995\u09b0\u09bf|\u0995\u09b0\u09cd\u09ae\u09b8\u0982\u09b8\u09cd\u09a5\u09be\u09a8/i],
  training_institute: [/training\s*institute|vocational|skill\s*dev/i, /\u09aa\u09cd\u09b0\u09b6\u09bf\u0995\u09cd\u09b7\u09a3|\u09a6\u0995\u09cd\u09b7\u09a4\u09be/i],
  community_center: [/community\s*center|club\s*house|multipurpose/i, /\u09b8\u09ae\u09be\u099c|\u0995\u09ae\u09bf\u09af\u09bc\u09c1\u09a8\u09bf\u099f\u09bf|\u09ac\u09b9\u09c1\u09ae\u09c1\u0996\u09c0\s*\u0995\u09c7\u09a8\u09cd\u09a6\u09cd\u09b0/i],
  ngo: [/ngo\b|non[- ]?government/i, /\u098f\u09a8\u099c\u09bf\u0993|\u098f\u09a8\u09cd\u099c\u09bf\u0993/i],
  club: [/sports\s*club|social\s*club|recreation\s*club/i, /\u0995\u09cd\u09b2\u09be\u09ac|\u0995\u09cd\u09b0\u09c0\u09a1\u09bc\u09be/i],
  event_venue: [/event\s*venue|convention|auditorium|community\s*hall/i, /\u0986\u09af\u09cb\u099c\u09a8|\u0985\u09a8\u09c1\u09b7\u09cd\u09a0\u09be\u09a8|\u0995\u09ae\u09bf\u09a8\u09bf\u099f\u09bf\s*\u09b9\u09b2/i],
  agriculture_office: [/agriculture\s*office|dae|extension\s*office/i, /\u0995\u09c3\u09b7\u09bf|\u0995\u09c3\u09b7\u09bf\s*\u0985\u09a4\u09bf\u09b0\u09bf\u0995\u09cd\u09a4/i],
  fertilizer_shop: [/fertilizer|urea|dap|tsp/i, /\u09b8\u09be\u09b0|\u09af\u09c1\u09b0\u09bf\u09af\u09bc\u09be|\u09b8\u09be\u09b0\s*\u09a6\u09cb\u0995\u09be\u09a8/i],
  seed_store: [/seed\s*store|seedling|agro\s*input/i, /\u09ac\u09c0\u099c|\u099a\u09be\u09b0\u09be/i],
  fishery_office: [/fishery|fish\s*farming|aquaculture/i, /\u09ae\u09be\u099b|\u09ae\u09be\u099b\u099a\u09be\u09b7|\u09ae\u09be\u099b\u09c7\u09b0/i],
  livestock_office: [/livestock|veterinary\s*office|cattle/i, /\u09aa\u09b6\u09c1\u09aa\u09be\u09b2|\u0997\u09ac\u09be\u09a6\u09bf/i],
  fuel_station: [
    /fuel|petrol|diesel|cng|gas\s*station|pump/i,
    /\u09aa\u09c7\u099f\u09cd\u09b0\u09cb\u09b2|\u09a1\u09bf\u099c\u09c7\u09b2|\u09b8\u09bf\u098f\u09a8\u099c\u09bf|\u09aa\u09be\u09ae\u09cd\u09aa|\u099c\u09cd\u09ac\u09be\u09b2\u09be\u09a8\u09bf/i,
  ],
  public_toilet: [/toilet|restroom|wc\b|public\s*latrine/i, /\u09b6\u09cc\u099a\u09be\u0997\u09be\u09b0|\u09aa\u09be\u09ac\u09cd\u09b2\u09bf\u0995\s*\u099f\u09af\u09bc\u09b2\u09c7\u099f/i],
  parking: [/parking|car\s*park|pay\s*&?\s*park/i, /\u09aa\u09be\u09b0\u09cd\u0995\u09bf\u0982|\u0997\u09be\u09dc\u09bf\s*\u09b0\u09be\u0996\u09be/i],
  graveyard: [/graveyard|cemetery|burial/i, /\u0995\u09ac\u09b0\u09b8\u09cd\u09a5\u09be\u09a8|\u0997\u09cb\u09b0\u09b8\u09cd\u09a5\u09be\u09a8/i],
  crematorium: [/cremat(e|ory)|burning\s*ghat/i, /\u09b6\u09cd\u09ae\u09b6\u09be\u09a8|\u099a\u09bf\u09a4\u09be\u09ad\u09b8\u09cd\u09ae/i],
};

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fallbackPatterns(category: MapPlaceCategory): RegExp[] {
  const parts = category.split("_").filter(Boolean);
  if (!parts.length) return [];
  const phrase = parts.join(" ");
  const compact = parts.join("");
  return [
    new RegExp(`\\b${escapeRegex(phrase)}\\b`, "i"),
    new RegExp(escapeRegex(compact), "i"),
  ];
}

function patternsFor(category: MapPlaceCategory): RegExp[] {
  return CATEGORY_PATTERNS[category] ?? fallbackPatterns(category);
}

const EMERGENCY_PATTERNS =
  /emergency|urgent|help|accident|bleeding|unconscious|ambulance|critical|\u099c\u09b0\u09c1\u09b0\u09bf|\u099c\u09b0\u09c1\u09b0\u09c0|\u09b8\u09be\u09b9\u09be\u09c7\u09be\u09af\u09bc|\u09a6\u09c1\u09b0\u09cd\u0998\u099f\u09a8\u09be|\u09b0\u0995\u09cd\u09a4|\u09ae\u09be\s*\u0985\u09b8\u09c1\u09b8\u09cd\u09a5/i;

const OPEN_NOW_PATTERNS =
  /open\s*now|currently\s*open|available\s*now|24\s*h|24h|24\/7|\u0996\u09cb\u09b2\u09be|\u098f\u0996\u09a8\s*\u0996\u09cb\u09b2\u09be|\u099a\u09be\u09b2\u09c1|\u09e8\u09ef\s*\u0998\u09a3\u09cd\u09f0\u09be|\u099a\u09ac\u09cd\u09ac\u09bf\u09b6\s*\u0998\u09a3\u09cd\u09f0\u09be/i;

function scoreCategory(text: string): Record<MapPlaceCategory, number> {
  const scores = {} as Record<MapPlaceCategory, number>;
  for (const c of MAP_PLACE_CATEGORIES) scores[c] = 0;
  for (const c of MAP_PLACE_CATEGORIES) {
    for (const re of patternsFor(c)) {
      if (re.test(text)) scores[c] += 1;
    }
  }
  return scores;
}

function pickCategory(scores: Record<MapPlaceCategory, number>): MapPlaceCategory {
  let best: MapPlaceCategory = "restaurant";
  let max = -1;
  for (const c of MAP_PLACE_CATEGORIES) {
    if (scores[c] > max) {
      max = scores[c];
      best = c;
    }
  }
  if (max <= 0) return "restaurant";
  return best;
}

function extractKeywords(
  query: string,
  category: MapPlaceCategory,
  emergency: boolean,
  needsOpen: boolean,
): string[] {
  const kw = new Set<string>();
  if (emergency) kw.add("emergency");
  if (needsOpen) kw.add("open");
  const lower = query.toLowerCase();
  const enTokens = lower.match(/[a-z]{3,}/g) ?? [];
  for (const t of enTokens) {
    if (t.length > 2 && t.length < 24) kw.add(t);
  }
  kw.add(category);
  return [...kw].slice(0, 8);
}

/**
 * Rule-based intent from Bangla / English (offline assistant for the map UI).
 */
export function detectMapSearchIntent(query: string): MapSearchUserIntent {
  const trimmed = query.trim();
  const emergency = EMERGENCY_PATTERNS.test(trimmed);
  const needsOpenNow = OPEN_NOW_PATTERNS.test(trimmed);
  const scores = scoreCategory(trimmed);
  let category = pickCategory(scores);
  if (emergency) {
    const h = scores.hospital;
    const p = scores.police;
    const f = scores.fire_service;
    const ph = scores.pharmacy;
    const am = scores.ambulance;
    const bestEmergency = Math.max(h, p, f, ph, am);
    if (bestEmergency === h) category = "hospital";
    else if (bestEmergency === f) category = "fire_service";
    else if (bestEmergency === p) category = "police";
    else if (bestEmergency === ph) category = "pharmacy";
    else if (bestEmergency === am) category = "ambulance";
    else category = "hospital";
  }
  const keywords = extractKeywords(trimmed, category, emergency, needsOpenNow);
  return { category, emergency, keywords, needsOpenNow };
}
