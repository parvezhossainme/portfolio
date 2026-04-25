import { NextResponse } from "next/server";
import { incrementClicks } from "@/lib/url-short-store";

type RouteContext = {
  params: Promise<{ code: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { code } = await context.params;
  const entry = await incrementClicks(code);

  if (!entry) {
    return NextResponse.json(
      {
        error: "Short URL not found",
        message: `No link found for code: ${code}`,
      },
      { status: 404 }
    );
  }

  return NextResponse.redirect(entry.targetUrl);
}
