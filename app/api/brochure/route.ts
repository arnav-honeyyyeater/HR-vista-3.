import { NextResponse } from "next/server";
import { countBrochurePages } from "@/lib/data/store";

export const runtime = "nodejs";

/** Brochure metadata — page count from the rendered public/brochure/*.png set. */
export async function GET() {
  const pages = await countBrochurePages();
  return NextResponse.json({
    title: "HR VISTA 3.0",
    pages,
    updatedAt: new Date().toISOString(),
  });
}
