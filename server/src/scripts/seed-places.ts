/**
 * Inserts baseline map rows matching the frontend `MAP_PLACES` list.
 * Run: `npm run seed` (requires `MONGODB_URI` in `.env`).
 */
import "dotenv/config";
import { connectDb, disconnectDb } from "../config/db.js";
import { Place } from "../models/place.model.js";
import { MAP_PLACES_SEED } from "../seeds/map-places.seed.js";

async function main() {
  await connectDb();
  const keys = MAP_PLACES_SEED.map((p) => p.id);
  await Place.deleteMany({ seedKey: { $in: keys } });

  for (const p of MAP_PLACES_SEED) {
    await Place.create({
      seedKey: p.id,
      category: p.category,
      name: p.name,
      address: p.address,
      description: p.description,
      services: p.services,
      hours: p.hours,
      image: p.image,
      hotline: p.hotline,
      dutyPhone: p.dutyPhone,
      dutyOfficer: p.dutyOfficer,
      lat: p.lat,
      lng: p.lng,
      source: "import",
      moderationStatus: "approved",
    });
  }

  console.log(`Seeded ${MAP_PLACES_SEED.length} places (source=import, seedKey set).`);
  await disconnectDb();
}

main().catch(async (e) => {
  console.error(e);
  try {
    await disconnectDb();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
