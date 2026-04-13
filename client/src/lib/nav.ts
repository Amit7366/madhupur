import type { LucideIcon } from "lucide-react";
import { Bell, Briefcase, Home, Mail, Map } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export type NavKey = "home" | "services" | "map" | "notices" | "contacts";

export type NavSegment = "" | "services" | "map" | "notices" | "contacts";

export type NavDef = {
  segment: NavSegment;
  navKey: NavKey;
  icon: LucideIcon;
  /** Draw attention in nav (e.g. primary product feature). */
  featured?: boolean;
};

export const NAV_DEF: readonly NavDef[] = [
  { segment: "", navKey: "home", icon: Home },
  { segment: "services", navKey: "services", icon: Briefcase },
  { segment: "map", navKey: "map", icon: Map, featured: true },
  { segment: "notices", navKey: "notices", icon: Bell },
  { segment: "contacts", navKey: "contacts", icon: Mail },
] as const;

export function navHref(lang: Locale, segment: NavSegment): string {
  const base = `/${lang}`;
  return segment === "" ? base : `${base}/${segment}`;
}
