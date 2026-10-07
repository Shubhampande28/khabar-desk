"use client";

import { useState } from "react";
import { AdminArticleRow } from "@/lib/db";

export default function AdminReviewCard({ article }: { article: AdminArticleRow }) {
  const [ourSummary, setOurSummary] = useState(article.ourSummary || "");
  const [whyItMatters, setWhyItMatters] = useState(article.whyItMatters || "");
  const [isFeatured, setIsFeatured] = useState(article.isFeatured);
  const [contentWarning, setContentWarning] = useState(article.contentWarning);
  const [reviewed, setReviewed] = useState(Boolean(article.reviewedAt));
  const [drafting, setDrafting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleDraft() {
    setDrafting(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: article.title,
          feedSummary: article.contentSnippet,
          sourceName: article.source,
          category: article.categorySlug
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Draft failed");
      setOurSummary(data.ourSummary);
      setWhyItMatters(data.whyItMatters);
      setStatus("Draft generated — review before saving.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Draft failed");
    } finally {
      setDrafting(false);
    }
  }

  async function handleSave(markReviewed: boolean) {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: article.id,
          ourSummary,
          whyItMatters,
          isFeatured,
          contentWarning,
          reviewed: markReviewed
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setReviewed(markReviewed);
      setStatus(markReviewed ? "Saved and published." : "Draft saved.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {article.categorySlug} · {article.source}
          </p>
          <h3 className="mt-1 font-serif text-lg text-ink">{article.title}</h3>
          {article.contentSnippet && (
            <p className="mt-1 text-sm text-inkSoft">{article.contentSnippet}</p>
          )}
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-xs text-accent hover:underline"
          >
            Open original ↗
          </a>
        </div>
        {reviewed && (
          <span className="shrink-0 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            Reviewed
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={handleDraft}
          disabled={drafting}
          className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {drafting ? "Drafting…" : "Draft with AI"}
        </button>
      </div>

      <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-muted">
        Our summary (2–4 sentences, under 80 words)
      </label>
      <textarea
        value={ourSummary}
        onChange={(e) => setOurSummary(e.target.value)}
        rows={3}
        className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent"
      />

      <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-muted">
        Why it matters (1–2 sentences)
      </label>
      <textarea
        value={whyItMatters}
        onChange={(e) => setWhyItMatters(e.target.value)}
        rows={2}
        className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent"
      />

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-ink">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={contentWarning}
            onChange={(e) => setContentWarning(e.target.checked)}
          />
          Content warning
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleSave(false)}
          disabled={saving}
          className="rounded-full border border-line px-4 py-1.5 text-sm font-medium text-ink hover:border-accent disabled:opacity-50"
        >
          Save draft
        </button>
        <button
          type="button"
          onClick={() => handleSave(true)}
          disabled={saving || !ourSummary.trim() || !whyItMatters.trim()}
          className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          I reviewed this — publish
        </button>
        {status && <span className="text-xs text-muted">{status}</span>}
      </div>
    </div>
  );
}
