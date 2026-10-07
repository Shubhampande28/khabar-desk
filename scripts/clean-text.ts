// One-off: re-cleans title/content_snippet on every row already in the DB
// using the same entity-decoding/markup-stripping/truncation rules ingest
// now applies going forward. Run once after deploying Milestone 2's
// text-cleaning change. Safe to re-run — it's a no-op on already-clean rows.
import { cleanStoredArticleText } from "../lib/db";

const { scanned, updated } = cleanStoredArticleText();
console.log(`Scanned ${scanned} articles, cleaned ${updated}.`);
