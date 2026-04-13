/** Build `{ all, … }` labels for category chips from `pages.<pageKey>.categories.*`. */
export function pageFilterLabels(
  t: (path: string) => string,
  pageKey: string,
  order: readonly string[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of order) {
    if (key === "all") {
      out[key] = t("pages.filterAll");
    } else {
      out[key] = t(`pages.${pageKey}.categories.${key}`);
    }
  }
  return out;
}
