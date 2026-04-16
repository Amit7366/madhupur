import type { Locale } from "@/lib/i18n";

export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export const BLOOD_GROUPS: readonly BloodGroup[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export type BilingualLine = Readonly<{ bn: string; en: string }>;

export type BloodBankUnion = Readonly<{
  id: string;
  name: BilingualLine;
}>;

/** Representative unions / areas around Madhupur Upazila for filtering. */
export const BLOOD_BANK_UNIONS: readonly BloodBankUnion[] = [
  { id: "sadar", name: { bn: "মধুপুর সদর", en: "Madhupur Sadar" } },
  { id: "ausnara", name: { bn: "আউশনারা", en: "Ausnara" } },
  { id: "fulki", name: { bn: "ফুলকি", en: "Fulki" } },
  { id: "gobindashi", name: { bn: "গোবিন্দাসী", en: "Gobindashi" } },
  { id: "kushlia", name: { bn: "কুশলিয়া", en: "Kushlia" } },
  { id: "sholakuri", name: { bn: "শোলাকুড়ি", en: "Sholakuri" } },
  { id: "dilwarpur", name: { bn: "দিলওয়ারপুর", en: "Dilwarpur" } },
  { id: "dhobari", name: { bn: "ধোবড়ি", en: "Dhobari" } },
] as const;

export type DonorRecord = Readonly<{
  id: string;
  name: BilingualLine;
  bloodGroup: BloodGroup;
  unionId: string;
  /** Village / neighbourhood line */
  location: BilingualLine;
  status: "available" | "cooling";
  /** Required when status is cooling — ISO date of last whole-blood donation */
  lastDonationIso?: string;
}>;

const MS_PER_DAY = 86_400_000;
const COOLING_DAYS = 120;

export function coolingDaysRemaining(lastDonationIso: string): number {
  const end =
    new Date(lastDonationIso).getTime() + COOLING_DAYS * MS_PER_DAY;
  return Math.max(0, Math.ceil((end - Date.now()) / MS_PER_DAY));
}

export function unionLabel(union: BloodBankUnion, locale: Locale): string {
  return locale === "bn" ? union.name.bn : union.name.en;
}

export function donorLine(
  line: BilingualLine,
  locale: Locale,
): string {
  return locale === "bn" ? line.bn : line.en;
}

/**
 * Illustrative donors for UI demos — replace with API data when available.
 */
export const BLOOD_DONORS: readonly DonorRecord[] = [
  {
    id: "d1",
    name: { bn: "রহিমা বেগম", en: "Rahima Begum" },
    bloodGroup: "O+",
    unionId: "sadar",
    location: { bn: "সদর রোড, মধুপুর", en: "Sadar Road, Madhupur" },
    status: "available",
  },
  {
    id: "d2",
    name: { bn: "করিম উদ্দিন", en: "Karim Uddin" },
    bloodGroup: "A+",
    unionId: "ausnara",
    location: { bn: "আউশনারা বাজার সংলগ্ন", en: "Near Ausnara bazar" },
    status: "available",
  },
  {
    id: "d3",
    name: { bn: "সুমন চৌধুরী", en: "Suman Chowdhury" },
    bloodGroup: "B+",
    unionId: "fulki",
    location: { bn: "ফুলকি ইউনিয়ন", en: "Fulki union area" },
    status: "cooling",
    lastDonationIso: "2025-12-10",
  },
  {
    id: "d4",
    name: { bn: "নাসরিন আক্তার", en: "Nasrin Akter" },
    bloodGroup: "AB+",
    unionId: "gobindashi",
    location: { bn: "গোবিন্দাসী", en: "Gobindashi" },
    status: "available",
  },
  {
    id: "d5",
    name: { bn: "জাহিদ হাসান", en: "Zahid Hasan" },
    bloodGroup: "O-",
    unionId: "kushlia",
    location: { bn: "কুশলিয়া", en: "Kushlia" },
    status: "available",
  },
  {
    id: "d6",
    name: { bn: "মিতা রানী দাস", en: "Mita Rani Das" },
    bloodGroup: "A-",
    unionId: "sholakuri",
    location: { bn: "শোলাকুড়ি", en: "Sholakuri" },
    status: "cooling",
    lastDonationIso: "2026-01-20",
  },
  {
    id: "d7",
    name: { bn: "আব্দুল মান্নান", en: "Abdul Mannan" },
    bloodGroup: "B-",
    unionId: "dilwarpur",
    location: { bn: "দিলওয়ারপুর", en: "Dilwarpur" },
    status: "available",
  },
  {
    id: "d8",
    name: { bn: "শিরিন সুলতানা", en: "Shirin Sultana" },
    bloodGroup: "O+",
    unionId: "dhobari",
    location: { bn: "ধোবড়ি", en: "Dhobari" },
    status: "cooling",
    lastDonationIso: "2026-02-01",
  },
  {
    id: "d9",
    name: { bn: "রাফি আহমেদ", en: "Rafi Ahmed" },
    bloodGroup: "A+",
    unionId: "sadar",
    location: { bn: "উপজেলা সদর", en: "Upazila HQ area" },
    status: "available",
  },
  {
    id: "d10",
    name: { bn: "তানিয়া খান", en: "Tania Khan" },
    bloodGroup: "AB-",
    unionId: "ausnara",
    location: { bn: "আউশনারা", en: "Ausnara" },
    status: "available",
  },
];
