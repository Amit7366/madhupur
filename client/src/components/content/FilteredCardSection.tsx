"use client";

import { useMemo, useState } from "react";
import { ChipTabList } from "@/components/ui/ChipTabList";
import { InfoCard, type InfoCardAccent } from "@/components/ui/InfoCard";
import { EmptyState } from "@/components/content/EmptyState";
import { CONTENT_ICONS } from "@/lib/content-icons";
import type { MainPageCard } from "@/lib/dummy/main-pages";
import { useI18n } from "@/lib/use-i18n";

type FilteredCardSectionProps = Readonly<{
  items: MainPageCard[];
  categoryOrder: readonly string[];
  filterLabels: Record<string, string>;
  emptyFilterTitle: string;
  emptyFilterDescription: string;
  emptyListTitle?: string;
  emptyListDescription?: string;
}>;

export function FilteredCardSection({
  items,
  categoryOrder,
  filterLabels,
  emptyFilterTitle,
  emptyFilterDescription,
  emptyListTitle,
  emptyListDescription,
}: FilteredCardSectionProps) {
  const { t } = useI18n();
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    if (active === "all") return items;
    return items.filter((item) => item.category === active);
  }, [items, active]);

  const accents: InfoCardAccent[] = ["violet", "emerald", "sky", "amber"];

  const listEmptyTitle = emptyListTitle ?? emptyFilterTitle;
  const listEmptyDescription =
    emptyListDescription ?? emptyFilterDescription;

  const chipOptions = useMemo(
    () =>
      categoryOrder.map((key) => ({
        value: key,
        label: filterLabels[key] ?? key,
      })),
    [categoryOrder, filterLabels],
  );

  if (items.length === 0) {
    return (
      <EmptyState
        title={listEmptyTitle}
        description={listEmptyDescription}
      />
    );
  }

  return (
    <div className="space-y-5">
      <ChipTabList
        value={active}
        onChange={setActive}
        options={chipOptions}
        ariaLabel={t("a11y.filterCategories")}
        layout="wrap"
      />

      {filtered.length === 0 ? (
        <EmptyState
          title={emptyFilterTitle}
          description={emptyFilterDescription}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => {
            const Icon = CONTENT_ICONS[item.icon];
            const accent = accents[index % accents.length] ?? "violet";
            return (
              <li key={item.id}>
                <InfoCard
                  icon={Icon}
                  title={item.title}
                  description={item.description}
                  meta={item.meta}
                  href={item.href}
                  accent={accent}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
