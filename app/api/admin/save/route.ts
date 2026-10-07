import { NextRequest, NextResponse } from "next/server";
import { saveArticleEditorial } from "@/lib/db";

const EDITOR_NAME = "Khabar Adda Editorial";
const MAX_SUMMARY_WORDS = 80;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, ourSummary, whyItMatters, isFeatured, contentWarning, reviewed } = body || {};

  if (typeof id !== "number") {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const summary = String(ourSummary || "").trim();
  const matters = String(whyItMatters || "").trim();

  // Only a reviewed save is held to the publish-quality bar — a draft can
  // be saved half-finished so an editor can come back to it later.
  if (reviewed) {
    if (!summary || !matters) {
      return NextResponse.json(
        { error: "Reviewed stories need both ourSummary and whyItMatters" },
        { status: 400 }
      );
    }
    if (wordCount(summary) > MAX_SUMMARY_WORDS) {
      return NextResponse.json(
        { error: `ourSummary must be under ${MAX_SUMMARY_WORDS} words` },
        { status: 400 }
      );
    }
  }

  saveArticleEditorial({
    id,
    ourSummary: summary,
    whyItMatters: matters,
    isFeatured: Boolean(isFeatured),
    contentWarning: Boolean(contentWarning),
    reviewed: Boolean(reviewed),
    editorName: EDITOR_NAME
  });

  return NextResponse.json({ ok: true });
}
