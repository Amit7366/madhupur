"use client";

import { ChipTabList } from "@/components/ui/ChipTabList";
import type { MapPlaceCategory } from "@/lib/dummy/map-places";
import {
  categoriesInActiveGroup,
  MAP_FILTER_GROUP_ORDER,
  type MapFilterGroupId,
} from "@/lib/map-category-groups";
import { cn } from "@/lib/utils";

export type MapFilterValue = "all" | MapPlaceCategory;

/** Within a non-`all` group: whole group vs one subtype. */
export type MapFilterSubtype = "all" | MapPlaceCategory;

type MapFiltersProps = Readonly<{
  group: MapFilterGroupId;
  subtype: MapFilterSubtype;
  onGroupChange: (group: MapFilterGroupId) => void;
  onSubtypeChange: (subtype: MapFilterSubtype) => void;
  groupLabels: Record<MapFilterGroupId, string>;
  categoryLabels: Record<MapFilterValue, string>;
  allTypesInSectionLabel: string;
  groupAriaLabel: string;
  subtypeAriaLabel: string;
  className?: string;
}>;

export function MapFilters({
  group,
  subtype,
  onGroupChange,
  onSubtypeChange,
  groupLabels,
  categoryLabels,
  allTypesInSectionLabel,
  groupAriaLabel,
  subtypeAriaLabel,
  className,
}: MapFiltersProps) {
  const groupOptions = MAP_FILTER_GROUP_ORDER.map((id) => ({
    value: id,
    label: groupLabels[id],
  }));

  const cats = categoriesInActiveGroup(group);
  const subtypeOptions =
    group === "all" || !cats
      ? []
      : [
          { value: "all" as const, label: allTypesInSectionLabel },
          ...cats.map((c) => ({
            value: c,
            label: categoryLabels[c],
          })),
        ];

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <ChipTabList
        value={group}
        onChange={onGroupChange}
        options={groupOptions}
        ariaLabel={groupAriaLabel}
        layout="scroll"
      />
      {subtypeOptions.length > 0 ? (
        <ChipTabList
          value={subtype}
          onChange={onSubtypeChange}
          options={subtypeOptions}
          ariaLabel={subtypeAriaLabel}
          layout="scroll"
        />
      ) : null}
    </div>
  );
}
