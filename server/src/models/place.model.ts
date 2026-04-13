import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

export const PLACE_CATEGORIES = [
  "hospital",
  "clinic",
  "pharmacy",
  "diagnostic_center",
  "ambulance",
  "blood_bank",
  "veterinary",
  "police",
  "fire_service",
  "disaster_shelter",
  "legal_aid",
  "union_office",
  "upazila_office",
  "land_office",
  "passport_office",
  "post_office",
  "election_office",
  "social_service_office",
  "school",
  "college",
  "university",
  "madrasa",
  "coaching_center",
  "library",
  "mosque",
  "temple",
  "church",
  "pagoda",
  "restaurant",
  "hotel_food",
  "fast_food",
  "cafe",
  "bakery",
  "super_shop",
  "grocery_store",
  "bazaar",
  "shopping_mall",
  "clothing_store",
  "electronics_store",
  "tourist_spot",
  "park",
  "resort",
  "guest_house",
  "historical_place",
  "bus_stand",
  "train_station",
  "ferry_terminal",
  "cng_stand",
  "car_rental",
  "bank",
  "atm",
  "mobile_banking_agent",
  "microfinance",
  "electric_office",
  "water_office",
  "internet_provider",
  "repair_service",
  "printing_service",
  "company",
  "factory",
  "job_center",
  "training_institute",
  "community_center",
  "ngo",
  "club",
  "event_venue",
  "agriculture_office",
  "fertilizer_shop",
  "seed_store",
  "fishery_office",
  "livestock_office",
  "fuel_station",
  "public_toilet",
  "parking",
  "graveyard",
  "crematorium",
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

const bilingualSchema = new Schema(
  {
    bn: { type: String, default: "" },
    en: { type: String, default: "" },
  },
  { _id: false },
);

const contributorSchema = new Schema(
  {
    name: { type: String },
    contact: { type: String },
  },
  { _id: false },
);

const placeSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: PLACE_CATEGORIES,
      index: true,
    },
    name: { type: bilingualSchema, required: true },
    address: { type: bilingualSchema, required: true },
    description: { type: bilingualSchema, required: true },
    services: { type: bilingualSchema, required: true },
    hours: { type: bilingualSchema, required: true },
    image: { type: String, default: "" },
    hotline: { type: String },
    dutyPhone: { type: String },
    dutyOfficer: { type: bilingualSchema, required: true },
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    contributor: contributorSchema,
    /**
     * Stable id matching frontend `MAP_PLACES[].id` when seeded from the app baseline.
     * Omitted for community submissions. Used to dedupe API + static seed on the map page.
     */
    seedKey: { type: String, sparse: true, unique: true, index: true },
    /** Concatenated BN/EN text for full-text + future AI / embeddings */
    searchText: { type: String, index: true },
    /** Optional labels for search ranking / facets */
    tags: [{ type: String }],
    source: {
      type: String,
      enum: ["community", "import"],
      default: "community",
      index: true,
    },
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
      index: true,
    },
  },
  { timestamps: true },
);

placeSchema.index({ location: "2dsphere" });
placeSchema.index({ searchText: "text" });

function buildSearchText(doc: {
  name: { bn: string; en: string };
  address: { bn: string; en: string };
  description: { bn: string; en: string };
  services: { bn: string; en: string };
  hours: { bn: string; en: string };
  dutyOfficer: { bn: string; en: string };
  category: string;
  tags?: string[];
}): string {
  const parts = [
    doc.category,
    doc.name.bn,
    doc.name.en,
    doc.address.bn,
    doc.address.en,
    doc.description.bn,
    doc.description.en,
    doc.services.bn,
    doc.services.en,
    doc.hours.bn,
    doc.hours.en,
    doc.dutyOfficer.bn,
    doc.dutyOfficer.en,
    ...(doc.tags ?? []),
  ];
  return parts.join(" \n ").replace(/\s+/g, " ").trim();
}

placeSchema.pre("validate", function (next) {
  if (this.lat != null && this.lng != null) {
    this.location = {
      type: "Point",
      coordinates: [this.lng, this.lat],
    };
  }
  this.searchText = buildSearchText({
    name: this.name,
    address: this.address,
    description: this.description,
    services: this.services,
    hours: this.hours,
    dutyOfficer: this.dutyOfficer,
    category: this.category,
    tags: this.tags,
  });
  next();
});

export type PlaceDocument = InferSchemaType<typeof placeSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Place: Model<PlaceDocument> =
  mongoose.models.Place ?? mongoose.model<PlaceDocument>("Place", placeSchema);
