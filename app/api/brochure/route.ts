import { NextResponse } from "next/server";
import { brochurePages } from "@/lib/data/brochure";

export const runtime = "nodejs";

/** JSON metadata for the rendered brochure pages, not a PDF download. */
export async function GET() {
  return NextResponse.json({
    title: "HR VISTA 3.0",
    pages: brochurePages.length,
    contents: brochurePages,
    updatedAt: new Date().toISOString(),
  });
}
