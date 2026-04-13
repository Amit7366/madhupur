import { PageLoadingSkeleton } from "@/components/ui/LoadingSkeleton";

export default function LangLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 lg:max-w-5xl lg:px-8">
      <PageLoadingSkeleton />
    </div>
  );
}
