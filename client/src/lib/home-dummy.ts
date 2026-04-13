import type { LucideIcon } from "lucide-react";
import { CalendarCheck, HeartPulse, Recycle } from "lucide-react";
import type { NavSegment } from "@/lib/nav";

export type FeaturedCardDummy = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: "emerald" | "violet" | "amber";
  segment: NavSegment;
};

export const featuredCardsDummy: FeaturedCardDummy[] = [
  {
    id: "feat-1",
    title: "Community health screening",
    description:
      "Free blood pressure and glucose checks. Town hall community room — Sat Apr 19, 10:00–16:00.",
    icon: HeartPulse,
    accent: "emerald",
    segment: "services",
  },
  {
    id: "feat-2",
    title: "School enrollment week",
    description:
      "Bring documents for Class 1–6 registration. Help desk at the education office, Apr 14–18.",
    icon: CalendarCheck,
    accent: "violet",
    segment: "notices",
  },
  {
    id: "feat-3",
    title: "Waste pickup — green route",
    description:
      "Recyclables collection moves to Tuesday this month for wards along River Road.",
    icon: Recycle,
    accent: "amber",
    segment: "map",
  },
];

export type NoticePreviewDummy = {
  id: string;
  title: string;
  dateLabel: string;
  category: string;
};

export const noticesPreviewDummy: NoticePreviewDummy[] = [
  {
    id: "n1",
    title: "Planned water shutdown — Ward 3, Apr 16 (09:00–14:00)",
    dateLabel: "Apr 8, 2025",
    category: "Infrastructure",
  },
  {
    id: "n2",
    title: "Farmers’ market: new Sunday slot at Central Park",
    dateLabel: "Apr 5, 2025",
    category: "Community",
  },
  {
    id: "n3",
    title: "Municipal tax deadline extended to Apr 30",
    dateLabel: "Apr 2, 2025",
    category: "Finance",
  },
];
