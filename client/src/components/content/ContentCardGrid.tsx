import { InfoCard, type InfoCardAccent } from "@/components/ui/InfoCard";
import { CONTENT_ICONS } from "@/lib/content-icons";
import type { MainPageCard } from "@/lib/dummy/main-pages";

type ContentCardGridProps = {
  items: MainPageCard[];
};

export function ContentCardGrid({ items }: ContentCardGridProps) {
  const accents: InfoCardAccent[] = ["violet", "emerald", "sky", "amber"];

  if (items.length === 0) return null;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <li key={item.id}>
          <InfoCard
            icon={CONTENT_ICONS[item.icon]}
            title={item.title}
            description={item.description}
            meta={item.meta}
            href={item.href}
            accent={accents[index % accents.length] ?? "violet"}
          />
        </li>
      ))}
    </ul>
  );
}
