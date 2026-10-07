export type Article = {
  title: string;
  link: string;
  source: string;
  isoDate: string | null;
  contentSnippet: string | null;
  image: string | null;
  // Generated once, the first time this article is ingested, and never
  // regenerated after — see lib/db.ts. Null only for rows ingested before
  // this field existed that haven't been re-seen by a feed since.
  slug?: string | null;
  // Editor-curated (Milestone 3) — only set when fetched with featuredFirst.
  isFeatured?: boolean;
};
