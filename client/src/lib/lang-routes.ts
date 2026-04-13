/**
 * Shared route param types for the `[lang]` App Router segment.
 */

export type LangRouteParams = Readonly<{
  lang: string;
}>;

/** Standard props shape for localized `page.tsx` route modules under `app/[lang]/`. */
export type LangPageProps = Readonly<{
  params: Promise<LangRouteParams>;
}>;
