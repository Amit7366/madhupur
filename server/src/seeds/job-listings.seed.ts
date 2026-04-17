/**
 * Initial job postings for `npm run seed:jobs` — aligned with client-facing copy.
 */
export type JobSeedRow = Readonly<{
  seedKey: string;
  lat: number;
  lng: number;
  title: { bn: string; en: string };
  company: { bn: string; en: string };
  salaryRange: { bn: string; en: string };
  liveApplicants: number;
  totalApplicants: number;
  hrPhone: string;
  description: { bn: string; en: string };
  requirements: { bn: string; en: string };
}>;

export const JOB_SEED_ROWS: JobSeedRow[] = [
  {
    seedKey: "job-pine-canning-line",
    lat: 24.628,
    lng: 90.041,
    title: {
      en: "Production Line Supervisor — Canning",
      bn: "উৎপাদন লাইন সুপারভাইজার — ক্যানিং",
    },
    company: { en: "Madhupur Agro Processing Ltd.", bn: "মধুপুর এগ্রো প্রসেসিং লি." },
    salaryRange: { en: "৳28,000 – ৳38,000 / month", bn: "মাসে ২৮,০০০ – ৩৮,০০০ ৳" },
    liveApplicants: 12,
    totalApplicants: 186,
    hrPhone: "+8801712000001",
    description: {
      en: "Lead a 12-person shift on the pineapple canning line. Ensure GMP, throughput targets, and safety compliance. Report to Plant Manager.",
      bn: "আনারস ক্যানিং লাইনে ১২ জন শিফট টিম পরিচালনা। জিএমপি, লক্ষ্য উৎপাদন ও নিরাপত্তা নিশ্চিত করুন। প্ল্যান্ট ম্যানেজারের অধীন।",
    },
    requirements: {
      en: "Diploma in Mechanical/Food Tech or equivalent · 3+ yrs factory floor experience · Basic English for SOP reading.",
      bn: "মেকানিক্যাল/ফুড টেক ডিপ্লোমা বা সমমান · ৩+ বছর ফ্যাক্টরি অভিজ্ঞতা · এসওপি পড়ার জন্য প্রাথমিক ইংরেজি।",
    },
  },
  {
    seedKey: "job-cold-storage-tech",
    lat: 24.615,
    lng: 90.028,
    title: {
      en: "Cold Storage Technician",
      bn: "কোল্ড স্টোরেজ টেকনিশিয়ান",
    },
    company: { en: "Northern Chill Logistics", bn: "নর্দার্ন চিল লজিস্টিকস" },
    salaryRange: { en: "৳22,000 – ৳30,000 / month", bn: "মাসে ২২,০০০ – ৩০,০০০ ৳" },
    liveApplicants: 8,
    totalApplicants: 94,
    hrPhone: "+8801712000002",
    description: {
      en: "Operate and maintain ammonia-based refrigeration units. Log temperatures, respond to alarms, and support loading schedules.",
      bn: "অ্যামোনিয়া ভিত্তিক রেফ্রিজারেশন ইউনিট পরিচালনা ও রক্ষণাবেক্ষণ। তাপমাত্রা লগ, অ্যালার্ম ও লোডিং সময়সূচী সহায়তা।",
    },
    requirements: {
      en: "Vocational refrigeration certificate preferred · Ability to work rotating shifts · Physical fitness for cold environments.",
      bn: "রেফ্রিজারেশন ভোকেশনাল সার্টিফিকেট বাঞ্ছনীয় · ঘূর্ণায়মান শিফট · ঠান্ডা পরিবেশে কাজের শারীরিক সামর্থ্য।",
    },
  },
  {
    seedKey: "job-qc-lab-analyst",
    lat: 24.642,
    lng: 90.052,
    title: {
      en: "QC Lab Analyst (Brix & pH)",
      bn: "কিউসি ল্যাব বিশ্লেষক (ব্রিক্স ও পিএইচ)",
    },
    company: { en: "Golden Harvest Foods", bn: "গোল্ডেন হারভেস্ট ফুডস" },
    salaryRange: { en: "৳32,000 – ৳42,000 / month", bn: "মাসে ৩২,০০০ – ৪২,০০০ ৳" },
    liveApplicants: 5,
    totalApplicants: 67,
    hrPhone: "+8801712000003",
    description: {
      en: "Run daily quality checks on incoming fruit batches, calibrate instruments, and file compliance reports for export lots.",
      bn: "আগত ফলের ব্যাচে দৈনিক মান পরীক্ষা, যন্ত্র ক্যালিব্রেশন ও রপ্তানি লটের প্রতিবেদন।",
    },
    requirements: {
      en: "BSc Chemistry / Food Science · Familiarity with HACCP documentation · Attention to detail.",
      bn: "বিএসসি কেমিস্ট্রি/ফুড সায়েন্স · এইচএসিসিপি ডকুমেন্টেশন · বিস্তারিত গুরুত্ব।",
    },
  },
  {
    seedKey: "job-maintenance-electrician",
    lat: 24.598,
    lng: 90.018,
    title: {
      en: "Industrial Electrician",
      bn: "শিল্প বিদ্যুতিবিদ",
    },
    company: { en: "Salbelt Millwright Cooperative", bn: "শালবেল্ট মিলরাইট সমবায়" },
    salaryRange: { en: "৳26,000 – ৳36,000 / month", bn: "মাসে ২৬,০০০ – ৩৬,০০০ ৳" },
    liveApplicants: 15,
    totalApplicants: 241,
    hrPhone: "+8801712000004",
    description: {
      en: "Maintain MCC panels, motor controls, and emergency stops across packaging and conveyor systems.",
      bn: "প্যাকেজিং ও কনভেয়র সিস্টেমে এমসিসি প্যানেল, মোটর নিয়ন্ত্রণ ও ইমার্জেন্সি স্টপ রক্ষণাবেক্ষণ।",
    },
    requirements: {
      en: "Valid electrical trade license · Lock-out/tag-out trained · 2+ yrs industrial setting.",
      bn: "বৈধ ইলেকট্রিক্যাল লাইসেন্স · লক-আউট/ট্যাগ-আউট প্রশিক্ষণ · ২+ বছর শিল্প ক্ষেত্রে।",
    },
  },
  {
    seedKey: "job-hse-officer",
    lat: 24.655,
    lng: 90.065,
    title: {
      en: "HSE Officer — Wood & Resin Dust",
      bn: "এইচএসই অফিসার — কাঠ ও রেজিন ধুলো",
    },
    company: { en: "TimberCraft Panel Industries", bn: "টিম্বারক্রাফ্ট প্যানেল ইন্ডাস্ট্রিজ" },
    salaryRange: { en: "৳35,000 – ৳48,000 / month", bn: "মাসে ৩৫,০০০ – ৪৮,০০০ ৳" },
    liveApplicants: 4,
    totalApplicants: 52,
    hrPhone: "+8801712000005",
    description: {
      en: "Implement dust monitoring, PPE audits, and incident investigations. Liaise with DoL inspectors when scheduled.",
      bn: "ধুলো পর্যবেক্ষণ, পিপিই অডিট ও দুর্ঘটনা তদন্ত। ডিওএল পরিদর্শনের সমন্বয়।",
    },
    requirements: {
      en: "NEBOSH IGC or local equivalent · Experience in wood processing preferred · Report writing in Bangla & English.",
      bn: "নেবোশ আইজিসি বা সমমান · কাঠ প্রক্রিয়াকরণ অভিজ্ঞতা বাঞ্ছনীয় · বাংলা ও ইংরেজিতে প্রতিবেদন।",
    },
  },
  {
    seedKey: "job-logistics-dispatcher",
    lat: 24.61,
    lng: 90.008,
    title: {
      en: "Fleet Dispatcher (Reefer trucks)",
      bn: "ফ্লিট ডিসপ্যাচার (রিফার ট্রাক)",
    },
    company: { en: "Jalchatra Cold Chain", bn: "জলছত্র কোল্ড চেইন" },
    salaryRange: { en: "৳24,000 – ৳32,000 / month", bn: "মাসে ২৪,০০০ – ৩২,০০০ ৳" },
    liveApplicants: 9,
    totalApplicants: 118,
    hrPhone: "+8801712000006",
    description: {
      en: "Coordinate driver routes, POD collection, and temperature log sheets for perishable exports to Dhaka.",
      bn: "ড্রাইভার রুট, পিওডি সংগ্রহ ও ঢাকার নাসিজ্য রপ্তানির তাপমাত্রা লগ সমন্বয়।",
    },
    requirements: {
      en: "Proficiency in Excel / simple TMS · Clear Bangla phone communication · Night shift rotation.",
      bn: "এক্সেল/সাধারণ টিএমএস দক্ষতা · বাংলায় ফোন যোগাযোগ · রাতের শিফট।",
    },
  },
  {
    seedKey: "job-tool-die-machinist",
    lat: 24.632,
    lng: 90.036,
    title: {
      en: "Tool & Die Machinist",
      bn: "টুল ও ডাই মেশিনিস্ট",
    },
    company: { en: "Precision Metalworks Tangail", bn: "প্রিসিশন মেটালওয়ার্কস টাংগাইল" },
    salaryRange: { en: "৳30,000 – ৳45,000 / month", bn: "মাসে ৩০,০০০ – ৪৫,০০০ ৳" },
    liveApplicants: 6,
    totalApplicants: 73,
    hrPhone: "+8801712000007",
    description: {
      en: "Fabricate and repair dies for stamping and forming lines. Read mechanical drawings; operate lathe and milling equipment.",
      bn: "স্ট্যাম্পিং ও ফর্মিং লাইনের ডাই তৈরি ও মেরামত। মেকানিকাল ড্রয়িং পড়া; লেদ ও মিলিং।",
    },
    requirements: {
      en: "Trade test certification · 4+ yrs toolroom experience · Safety glasses mandatory on floor.",
      bn: "ট্রেড টেস্ট সার্টিফিকেট · ৪+ বছর টুলরুম · ফ্লোরে সেফটি গ্লাস বাধ্যতামূলক।",
    },
  },
  {
    seedKey: "job-hr-talent-partner",
    lat: 24.619,
    lng: 90.045,
    title: {
      en: "HR Talent Partner — Factory",
      bn: "এইচআর ট্যালেন্ট পার্টনার — ফ্যাক্টরি",
    },
    company: { en: "Eastern Pine Holdings", bn: "ইস্টার্ন পাইন হোল্ডিংস" },
    salaryRange: { en: "৳40,000 – ৳55,000 / month", bn: "মাসে ৪০,০০০ – ৫৫,০০০ ৳" },
    liveApplicants: 3,
    totalApplicants: 41,
    hrPhone: "+8801712000008",
    description: {
      en: "Full-cycle hiring for hourly and salaried roles: screening, line interviews, and onboarding with compliance checks.",
      bn: "ঘণ্টাভিত্তিক ও মাসিক পদের পূর্ণ নিয়োগ: স্ক্রিনিং, লাইন ইন্টারভিউ ও কমপ্লায়েন্সসহ অনবোর্ডিং।",
    },
    requirements: {
      en: "BBA/MBA HR or equivalent · Factory HR exposure · Discrete handling of worker grievances.",
      bn: "বিবিএ/এমবিএ এইচআর বা সমমান · ফ্যাক্টরি এইচআর অভিজ্ঞতা · শ্রমিক অভিযোগ গোপনীয় ব্যবস্থাপনা।",
    },
  },
];
