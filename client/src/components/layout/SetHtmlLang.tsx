"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isLocale } from "@/lib/i18n";

export function SetHtmlLang() {
  const pathname = usePathname();

  useEffect(() => {
    const seg = pathname.split("/").filter(Boolean)[0];
    if (isLocale(seg)) {
      document.documentElement.lang = seg;
    }
  }, [pathname]);

  return null;
}
