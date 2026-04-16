/**
 * Idempotent demo seed: creates users + donors + sample requests when the Donor
 * collection is empty. Safe to re-run after wiping donors (users upserted by email).
 *
 * Usage: `npm run seed:blood` (requires MONGODB_URI).
 */
import { connectDb, disconnectDb } from "../config/db.js";
import { BloodRequest } from "../models/blood-request.model.js";
import { Donor } from "../models/donor.model.js";
import { User } from "../models/user.model.js";

const COOLING_OK = new Date(Date.now() - 200 * 24 * 60 * 60 * 1000);

const USER_SPECS = [
  {
    name: "Rahima Begum",
    email: "rahima.begum@bloodbank.seed",
    phone: "8801711000001",
  },
  {
    name: "Karim Uddin",
    email: "karim.uddin@bloodbank.seed",
    phone: "8801711000002",
  },
  {
    name: "Nasrin Akter",
    email: "nasrin.akter@bloodbank.seed",
    phone: "8801711000003",
  },
  {
    name: "Zahid Hasan",
    email: "zahid.hasan@bloodbank.seed",
    phone: "8801711000004",
  },
  {
    name: "Emergency Desk",
    email: "emergency.desk@bloodbank.seed",
    phone: "8801711000099",
  },
] as const;

async function main(): Promise<void> {
  await connectDb();

  const donorCount = await Donor.countDocuments();
  if (donorCount > 0) {
    console.log(`Blood bank seed skipped: ${donorCount} donor(s) already in DB.`);
    await disconnectDb();
    return;
  }

  for (const s of USER_SPECS) {
    await User.findOneAndUpdate(
      { email: s.email },
      { $set: { name: s.name, email: s.email, phone: s.phone } },
      { upsert: true, new: true, runValidators: true },
    ).exec();
  }

  const emails = USER_SPECS.map((s) => s.email);
  const users = await User.find({ email: { $in: emails } }).exec();
  const byEmail = new Map(users.map((u) => [u.email, u]));

  const u0 = byEmail.get(USER_SPECS[0].email);
  const u1 = byEmail.get(USER_SPECS[1].email);
  const u2 = byEmail.get(USER_SPECS[2].email);
  const u3 = byEmail.get(USER_SPECS[3].email);
  const uReq = byEmail.get(USER_SPECS[4].email);
  if (!u0 || !u1 || !u2 || !u3 || !uReq) {
    throw new Error("Blood seed: failed to resolve user documents after upsert.");
  }

  await Donor.insertMany([
    {
      userId: u0._id,
      bloodGroup: "O+",
      lastDonationDate: COOLING_OK,
      isAvailable: true,
      locationId: "sadar",
      contactHidden: false,
    },
    {
      userId: u1._id,
      bloodGroup: "A+",
      lastDonationDate: COOLING_OK,
      isAvailable: true,
      locationId: "ausnara",
      contactHidden: false,
    },
    {
      userId: u2._id,
      bloodGroup: "AB+",
      lastDonationDate: null,
      isAvailable: true,
      locationId: "gobindashi",
      contactHidden: true,
    },
    {
      userId: u3._id,
      bloodGroup: "O-",
      lastDonationDate: COOLING_OK,
      isAvailable: true,
      locationId: "kushlia",
      contactHidden: false,
    },
  ]);

  const existingSamples = await BloodRequest.countDocuments({
    patientName: { $in: ["Sample Patient A", "Sample Patient B"] },
  });
  if (existingSamples === 0) {
    await BloodRequest.insertMany([
      {
        requesterId: uReq._id,
        patientName: "Sample Patient A",
        bloodGroup: "O+",
        hospitalName: "Madhupur Upazila Health Complex",
        unitsNeeded: "2",
        neededBy: new Date(Date.now() + 48 * 60 * 60 * 1000),
        urgency: "High",
        status: "Open",
      },
      {
        requesterId: uReq._id,
        patientName: "Sample Patient B",
        bloodGroup: "A+",
        hospitalName: "Tangail General (referral)",
        unitsNeeded: "1",
        neededBy: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        urgency: "Low",
        status: "Open",
      },
    ]);
  }

  console.log(
    `Blood bank seed OK: ${users.length} users (upserted), 4 donors, sample requests if missing.`,
  );
  await disconnectDb();
}

main().catch(async (e) => {
  console.error(e);
  await disconnectDb();
  process.exit(1);
});
