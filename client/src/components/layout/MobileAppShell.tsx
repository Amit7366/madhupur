"use client";

import type { ReactNode } from "react";
import { ContributeDataFab } from "@/components/contribute/ContributeDataFab";
import { AppInstallPrompt } from "@/components/pwa/AppInstallPrompt";
import { FloatingActionButton } from "@/components/pwa/FloatingActionButton";
import { MobileDrawer } from "@/components/navigation/MobileDrawer";
import { MobileNavProvider } from "@/components/navigation/MobileNavContext";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

export function MobileAppShell({ children }: { children: ReactNode }) {
  return (
    <MobileNavProvider>
      <ServiceWorkerRegister />
      <OfflineBanner />
      {children}
      <MobileDrawer />
      <FloatingActionButton />
      <ContributeDataFab />
      <AppInstallPrompt />
    </MobileNavProvider>
  );
}
