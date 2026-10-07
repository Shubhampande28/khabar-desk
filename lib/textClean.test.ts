import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanTitle, cleanDescription, truncateAtWordBoundary } from "./textClean";

// Real examples pulled from the feeds this project ingests.
test("decodes &amp; in a title", () => {
  assert.equal(cleanTitle("Govt tweaks F&amp;O trading rules"), "Govt tweaks F&O trading rules");
});

test("decodes &#39; and &quot; and strips markup", () => {
  assert.equal(
    cleanTitle("<b>J&amp;K</b> CM says it&#39;s &quot;a new chapter&quot;"),
    "J&K CM says it’s “a new chapter”"
  );
});

test("collapses whitespace and decodes &nbsp;", () => {
  assert.equal(cleanTitle("Delhi&nbsp;&nbsp;air   quality\n\nworsens"), "Delhi air quality worsens");
});

test("decodes numeric entities", () => {
  assert.equal(cleanTitle("Rahul&#8217;s remark sparks row"), "Rahul’s remark sparks row");
});

test("cleanDescription truncates on a word boundary with an ellipsis", () => {
  const raw =
    "The Election Commission on Monday directed officials across the state to re-verify every disputed Form 7 application after multiple parties flagged irregularities in the voter roll update process ahead of the upcoming by-elections scheduled for next month";
  const cleaned = cleanDescription(raw, 100);
  assert.ok(cleaned);
  assert.ok(cleaned!.length <= 101);
  assert.ok(cleaned!.endsWith("…"));
  assert.ok(!cleaned!.includes("  "));
});

test("truncateAtWordBoundary leaves short text untouched (no ellipsis)", () => {
  assert.equal(truncateAtWordBoundary("Short headline", 300), "Short headline");
});

test("cleanDescription returns null for empty input", () => {
  assert.equal(cleanDescription(null), null);
  assert.equal(cleanDescription(""), null);
});
