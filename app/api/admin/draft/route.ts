import { NextRequest, NextResponse } from "next/server";
import { getDraftProvider } from "@/lib/ai/draft";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { headline, feedSummary, sourceName, category } = body || {};

  if (!headline || !sourceName || !category) {
    return NextResponse.json({ error: "Missing headline/sourceName/category" }, { status: 400 });
  }

  try {
    const provider = getDraftProvider();
    const draft = await provider.generate({
      headline,
      feedSummary: feedSummary ?? null,
      sourceName,
      category
    });
    return NextResponse.json(draft);
  } catch (err) {
    console.error("Draft generation failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Draft generation failed" },
      { status: 502 }
    );
  }
}
