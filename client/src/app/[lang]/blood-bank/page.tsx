import type { Metadata } from "next";
import { BloodBankView } from "@/components/blood-bank/BloodBankView";
import { PageShell } from "@/components/content/PageShell";
import type { LangPageProps } from "@/lib/lang-routes";
import { pageMetadata } from "@/lib/metadata-lang";

export async function generateMetadata({
  params,
}: LangPageProps): Promise<Metadata> {
  return pageMetadata(params, (dict) => ({
    title: dict.pages.bloodBank.title,
    description: dict.pages.bloodBank.description,
  }));
}

export default function BloodBankPage() {
  return (
    <PageShell className="max-w-5xl">
      <BloodBankView />
    </PageShell>
  );
}
