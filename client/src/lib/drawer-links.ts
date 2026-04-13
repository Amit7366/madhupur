import type { LucideIcon } from "lucide-react";
import {
  Building2,
  GraduationCap,
  HeartPulse,
  Images,
  Info,
  Landmark,
  Newspaper,
  Siren,
} from "lucide-react";

export type DrawerMoreLink = {
  segment: string;
  icon: LucideIcon;
  /** i18n path e.g. pages.offices.title */
  labelKey: string;
};

export const DRAWER_MORE_LINKS: DrawerMoreLink[] = [
  { segment: "offices", icon: Building2, labelKey: "pages.offices.title" },
  { segment: "health", icon: HeartPulse, labelKey: "pages.health.title" },
  { segment: "education", icon: GraduationCap, labelKey: "pages.education.title" },
  { segment: "emergency", icon: Siren, labelKey: "pages.emergency.title" },
  { segment: "tourism", icon: Landmark, labelKey: "pages.tourism.title" },
  { segment: "news", icon: Newspaper, labelKey: "pages.news.title" },
  { segment: "gallery", icon: Images, labelKey: "pages.gallery.title" },
  { segment: "about", icon: Info, labelKey: "pages.about.title" },
];
