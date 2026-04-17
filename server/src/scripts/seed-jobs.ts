/**
 * Upserts demo job postings. Safe to re-run (`seedKey` unique).
 *
 * Usage: `npm run seed:jobs` (requires MONGODB_URI).
 */
import { connectDb, disconnectDb } from "../config/db.js";
import { Job } from "../models/job.model.js";
import { JOB_SEED_ROWS } from "../seeds/job-listings.seed.js";

async function main(): Promise<void> {
  await connectDb();
  let n = 0;
  for (const row of JOB_SEED_ROWS) {
    await Job.updateOne(
      { seedKey: row.seedKey },
      {
        $set: {
          seedKey: row.seedKey,
          title: row.title,
          company: row.company,
          salaryRange: row.salaryRange,
          description: row.description,
          requirements: row.requirements,
          liveApplicants: row.liveApplicants,
          totalApplicants: row.totalApplicants,
          hrPhone: row.hrPhone,
          lat: row.lat,
          lng: row.lng,
          published: true,
        },
      },
      { upsert: true },
    ).exec();
    n += 1;
  }
  console.log(`Jobs seed OK: ${n} posting(s) upserted.`);
  await disconnectDb();
}

main().catch(async (e) => {
  console.error(e);
  await disconnectDb();
  process.exit(1);
});
