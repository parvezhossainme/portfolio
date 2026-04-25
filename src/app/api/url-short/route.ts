import { NextRequest, NextResponse } from "next/server";
import { createShortUrl, listShortUrls } from "@/lib/url-short-store";

type CreateRequestBody = {
  url?: string;
  customCode?: string;
};

export async function GET() {
  const items = await listShortUrls();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  let body: CreateRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const entry = await createShortUrl(body.url, body.customCode);
    const shortUrl = `${request.nextUrl.origin}/url-short/${entry.code}`;

    return NextResponse.json(
      {
        item: entry,
        shortUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create short URL";
    const status = message.includes("exists") ? 409 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}
