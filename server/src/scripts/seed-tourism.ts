/**
 * Upserts curated tourism-related places (Unsplash images). Safe to re-run (seedKey unique).
 *
 * Usage: `npm run seed:tourism` (requires MONGODB_URI).
 */
import { connectDb, disconnectDb } from "../config/db.js";
import { Place, buildSearchText } from "../models/place.model.js";

const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

type SeedRow = Readonly<{
  seedKey: string;
  category:
    | "tourist_spot"
    | "park"
    | "resort"
    | "guest_house"
    | "historical_place"
    | "restaurant"
    | "cafe";
  name: { bn: string; en: string };
  address: { bn: string; en: string };
  description: { bn: string; en: string };
  services: { bn: string; en: string };
  hours: { bn: string; en: string };
  dutyOfficer: { bn: string; en: string };
  image: string;
  galleryImages: string[];
  lat: number;
  lng: number;
  hotline?: string;
  tags: string[];
}>;

const ROWS: SeedRow[] = [
  {
    seedKey: "tourism-madhupur-sal-tract",
    category: "tourist_spot",
    name: {
      bn: "মধুপুর শালবন ট্র্যাক",
      en: "Madhupur Sal Forest belt",
    },
    address: {
      bn: "মধুপুর উপজেলা, টাংগাইল — গোবিন্দাসী / শোলাকুড়ি সড়ক সংলগ্ন",
      en: "Madhupur Upazila, Tangail — near Gobindashi / Sholakuri forest roads",
    },
    description: {
      bn: "শাল ও মিশ্র বনভূমি। স্থানীয় গাইড ও চা-স্টল। প্রবেশ নিয়ম ও আগুন নিরাপত্তা মেনে চলুন।",
      en: "Sal and mixed forest landscape. Local tea stalls and guides. Follow forest entry and fire-safety rules.",
    },
    services: {
      bn: "লাইট ট্রেকিং · স্থানীয় গাইড · চা",
      en: "Light forest walks · local guides · tea stalls",
    },
    hours: {
      bn: "দিনের বেলা; আবহাওয়া ও স্থানীয় নোটিশ অনুযায়ী",
      en: "Daytime; subject to weather and local notices",
    },
    dutyOfficer: {
      bn: "বন বিভাগ / উপজেলা তথ্য কেন্দ্র",
      en: "Forest dept. / upazila information desk",
    },
    image: UNSPLASH("photo-1441974231531-c6227db76b6e"),
    galleryImages: [
      UNSPLASH("photo-1441974231531-c6227db76b6e"),
      UNSPLASH("photo-1511497584788-876760111969"),
      UNSPLASH("photo-1470071459604-3b5ec3a7fe05"),
    ],
    lat: 24.72,
    lng: 90.08,
    tags: ["nature", "forest", "madhupur"],
  },
  {
    seedKey: "tourism-jalchatra-pine-belt",
    category: "tourist_spot",
    name: {
      bn: "জলছত্র আনারস বেল্ট",
      en: "Jalchatra pineapple belt (agri-tourism)",
    },
    address: {
      bn: "জলছত্র ইউনিয়ন, মধুপুর",
      en: "Jalchatra union, Madhupur",
    },
    description: {
      bn: "মৌসুমি আনারস ক্ষেত ও হাট। ছবি তোলা ও স্থানীয় রস চেখে দেখুন।",
      en: "Seasonal pineapple fields and markets. Photography and fresh juice stops.",
    },
    services: {
      bn: "ফার্ম ভিজিট · আনারস · স্থানীয় নাস্তা",
      en: "Farm visits · pineapple · local snacks",
    },
    hours: {
      bn: "সকাল–সন্ধ্যা (মৌসুম ভেদে)",
      en: "Morning–evening (seasonal)",
    },
    dutyOfficer: {
      bn: "স্থানীয় কৃষক সমবায় / হাট কমিটি",
      en: "Local farmer cooperative / market committee",
    },
    image: UNSPLASH("photo-1589829085413-e56cfdae3129"),
    galleryImages: [
      UNSPLASH("photo-1589829085413-e56cfdae3129"),
      UNSPLASH("photo-1610832958506-aa56368176cf"),
    ],
    lat: 24.58,
    lng: 89.98,
    tags: ["food", "agri", "market"],
  },
  {
    seedKey: "tourism-madhupur-park-view",
    category: "park",
    name: {
      bn: "মধুপুর রিভার ভিউ পার্ক",
      en: "Madhupur River View Park (illustrative)",
    },
    address: {
      bn: "মধুপুর সদর সংলগ্ন নদী তীর",
      en: "Riverside near Madhupur Sadar (illustrative pin)",
    },
    description: {
      bn: "হাঁটার পথ, বসার বেঞ্চ ও শিশুদের খোলা মাঠ। সূর্যাস্ত দেখার জন্য জনপ্রিয়।",
      en: "Walking paths, benches, and open lawn. Popular for sunset views.",
    },
    services: {
      bn: "পার্কিং · বেঞ্চ · ফুটপাথ",
      en: "Parking · benches · footpaths",
    },
    hours: {
      bn: "৬:০০–২০:০০",
      en: "06:00–20:00",
    },
    dutyOfficer: {
      bn: "পৌরসভা / পার্ক কেয়ারটেকার",
      en: "Municipality / park caretaker",
    },
    image: UNSPLASH("photo-1506905925346-21bda4d32df4"),
    galleryImages: [
      UNSPLASH("photo-1506905925346-21bda4d32df4"),
      UNSPLASH("photo-1472214103451-9374bd1c798e"),
    ],
    lat: 24.612,
    lng: 90.035,
    tags: ["nature", "park", "family"],
  },
  {
    seedKey: "tourism-pine-hill-guesthouse",
    category: "guest_house",
    name: {
      bn: "পাইন হিল গেস্ট হাউস (ডেমো)",
      en: "Pine Hill Guest House (demo listing)",
    },
    address: {
      bn: "মধুপুর–টাংগাইল সড়ক, মধুপুর",
      en: "Madhupur–Tangail Road, Madhupur",
    },
    description: {
      bn: "পরিবারের জন্য সাশ্রয়ী থাকা। সকালের নাস্তা ও ওয়াইফাই।",
      en: "Budget-friendly rooms for families. Breakfast and Wi‑Fi.",
    },
    services: {
      bn: "রুম · নাস্তা · ওয়াইফাই",
      en: "Rooms · breakfast · Wi‑Fi",
    },
    hours: {
      bn: "চেক-ইন ১৪:০০ · চেক-আউট ১১:০০",
      en: "Check-in 14:00 · check-out 11:00",
    },
    dutyOfficer: {
      bn: "ফ্রন্ট ডেস্ক",
      en: "Front desk",
    },
    hotline: "+880-0000-000000",
    image: UNSPLASH("photo-1566073771259-6a8506099945"),
    galleryImages: [
      UNSPLASH("photo-1566073771259-6a8506099945"),
      UNSPLASH("photo-1611892440504-42a792e54d66"),
    ],
    lat: 24.625,
    lng: 90.042,
    tags: ["stay", "guesthouse"],
  },
  {
    seedKey: "tourism-green-canopy-resort",
    category: "resort",
    name: {
      bn: "গ্রিন ক্যানোপি ইকো রিসোর্ট (ডেমো)",
      en: "Green Canopy Eco Resort (demo)",
    },
    address: {
      bn: "মধুপুর উপজেলা",
      en: "Madhupur Upazila",
    },
    description: {
      bn: "বনের কিনারে কটেজ। পাখি দেখা ও গাইডেড ওয়াক।",
      en: "Cottages near the forest belt. Birding and guided walks.",
    },
    services: {
      bn: "কটেজ · রেস্টুরেন্ট · গাইড",
      en: "Cottages · restaurant · guides",
    },
    hours: {
      bn: "২৪/৭ রিসেপশন",
      en: "24/7 reception",
    },
    dutyOfficer: {
      bn: "বুকিং ডেস্ক",
      en: "Booking desk",
    },
    image: UNSPLASH("photo-1520250497591-112f2f40a3f4"),
    galleryImages: [
      UNSPLASH("photo-1520250497591-112f2f40a3f4"),
      UNSPLASH("photo-1571896349842-33c89424de2d"),
    ],
    lat: 24.68,
    lng: 90.06,
    tags: ["stay", "nature", "resort"],
  },
  {
    seedKey: "tourism-freedom-monument",
    category: "historical_place",
    name: {
      bn: "স্বাধীনতা স্মৃতিস্তম্ভ চত্বর (ডেমো)",
      en: "Freedom monument plaza (demo)",
    },
    address: {
      bn: "মধুপুর সদর",
      en: "Madhupur Sadar",
    },
    description: {
      bn: "স্থানীয় ইতিহাস ও মুক্তিযুদ্ধ স্মৃতি। সাপ্তাহিক ভিজিটর।",
      en: "Local history and liberation war memorial. Weekend visitors.",
    },
    services: {
      bn: "প্লাক · গাইড বুকলেট",
      en: "Plaques · guide leaflet",
    },
    hours: {
      bn: "৮:০০–১৮:০০",
      en: "08:00–18:00",
    },
    dutyOfficer: {
      bn: "উপজেলা প্রশাসন",
      en: "Upazila administration",
    },
    image: UNSPLASH("photo-1467269204594-9661b134dd2b"),
    galleryImages: [
      UNSPLASH("photo-1467269204594-9661b134dd2b"),
      UNSPLASH("photo-1507608616759-54f48f0af692"),
    ],
    lat: 24.605,
    lng: 90.03,
    tags: ["heritage", "history"],
  },
  {
    seedKey: "tourism-pineapple-plate-kitchen",
    category: "restaurant",
    name: {
      bn: "পাইনঅ্যাপল প্লেট কিচেন",
      en: "Pineapple Plate Kitchen",
    },
    address: {
      bn: "মধুপুর বাজার সংলগ্ন",
      en: "Near Madhupur bazar",
    },
    description: {
      bn: "স্থানীয় আনারস চাটনি, ভাত ও মাংস। পর্যটকদের জন্য হালকা মেনু।",
      en: "Local pineapple chutney, rice, and meat dishes. Tourist-friendly menu.",
    },
    services: {
      bn: "খাবার · পানি · টেবিল সার্ভিস",
      en: "Dining · water · table service",
    },
    hours: {
      bn: "১১:০০–২২:০০",
      en: "11:00–22:00",
    },
    dutyOfficer: {
      bn: "ম্যানেজার",
      en: "Manager",
    },
    hotline: "+880-0000-000001",
    image: UNSPLASH("photo-1555939594-58d7cb561ad1"),
    galleryImages: [
      UNSPLASH("photo-1555939594-58d7cb561ad1"),
      UNSPLASH("photo-1540189549336-e6e99c3679fe"),
    ],
    lat: 24.618,
    lng: 90.038,
    tags: ["food", "restaurant"],
  },
  {
    seedKey: "tourism-forest-edge-cafe",
    category: "cafe",
    name: {
      bn: "ফরেস্ট এজ ক্যাফে",
      en: "Forest Edge Café",
    },
    address: {
      bn: "শালবন সড়ক, মধুপুর",
      en: "Forest road, Madhupur",
    },
    description: {
      bn: "এসpresso, চা ও স্ন্যাক। ড্রাইভ থামার জন্য ছোট বিশ্রাম।",
      en: "Espresso, tea, and snacks. Quick stop on forest drives.",
    },
    services: {
      bn: "কফি · চা · স্ন্যাক",
      en: "Coffee · tea · snacks",
    },
    hours: {
      bn: "৭:০০–১৯:০০",
      en: "07:00–19:00",
    },
    dutyOfficer: {
      bn: "অন-সাইট স্টাফ",
      en: "On-site staff",
    },
    image: UNSPLASH("photo-1501339847302-ac426a4a7cbb"),
    galleryImages: [
      UNSPLASH("photo-1501339847302-ac426a4a7cbb"),
      UNSPLASH("photo-1495474472287-4d71bcdd2085"),
    ],
    lat: 24.64,
    lng: 90.05,
    tags: ["food", "cafe"],
  },
];

async function main(): Promise<void> {
  await connectDb();
  let n = 0;
  for (const row of ROWS) {
    // updateOne (not findOneAndUpdate): avoids returning an existing doc on the wire.
    // Legacy rows with invalid UTF-8 in unrelated fields can otherwise trigger BSONError on deserialize.
    await Place.updateOne(
      { seedKey: row.seedKey },
      {
        $set: {
          category: row.category,
          name: row.name,
          address: row.address,
          description: row.description,
          services: row.services,
          hours: row.hours,
          dutyOfficer: row.dutyOfficer,
          image: row.image,
          galleryImages: row.galleryImages,
          lat: row.lat,
          lng: row.lng,
          location: { type: "Point", coordinates: [row.lng, row.lat] },
          searchText: buildSearchText({
            category: row.category,
            name: row.name,
            address: row.address,
            description: row.description,
            services: row.services,
            hours: row.hours,
            dutyOfficer: row.dutyOfficer,
            tags: row.tags,
          }),
          hotline: row.hotline,
          tags: row.tags,
          seedKey: row.seedKey,
          source: "import",
          moderationStatus: "approved",
        },
      },
      { upsert: true, runValidators: true },
    ).exec();
    n += 1;
  }
  console.log(`Tourism seed OK: ${n} place(s) upserted.`);
  await disconnectDb();
}

main().catch(async (e) => {
  console.error(e);
  await disconnectDb();
  process.exit(1);
});
