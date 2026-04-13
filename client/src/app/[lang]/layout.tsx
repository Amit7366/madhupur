import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileAppShell } from "@/components/layout/MobileAppShell";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { TabBar } from "@/components/layout/TabBar";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import type { LangRouteParams } from "@/lib/lang-routes";

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<LangRouteParams>;
}>;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = await getDictionary(raw);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    openGraph: {
      locale: raw === "bn" ? "bn_BD" : "en_US",
    },
    alternates: {
      languages: {
        bn: "/bn",
        en: "/en",
      },
    },
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) {
    notFound();
  }
  const lang: Locale = raw;
  const dict = await getDictionary(lang);

  return (
    <MobileAppShell>
      <SkipToContent />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 px-4 py-8 pb-28 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500/30 sm:px-6 sm:py-10 lg:px-10 lg:pb-12"
      >
        {children}
      </main>
      <Footer lang={lang} dict={dict} />
      <TabBar />
    </MobileAppShell>
  );
}
