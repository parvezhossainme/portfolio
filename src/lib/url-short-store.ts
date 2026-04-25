import { prisma } from "@/lib/prisma";

export interface ShortUrlEntry {
  code: string;
  targetUrl: string;
  createdAt: string;
  clicks: number;
}

const CODE_PATTERN = /^[a-zA-Z0-9_-]{4,32}$/;
const CODE_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CODE_LENGTH = 7;

export function normalizeTargetUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("URL is required");
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.toString();
  } catch {
    throw new Error("Please provide a valid URL");
  }
}

export function validateCustomCode(value: string): string {
  const code = value.trim();

  if (!code) {
    throw new Error("Custom code is empty");
  }

  if (!CODE_PATTERN.test(code)) {
    throw new Error("Custom code must be 4-32 chars (letters, numbers, _ or -)");
  }

  return code;
}

function generateCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

type DbShortUrl = {
  code: string;
  targetUrl: string;
  createdAt: Date;
  clicks: number;
};

function mapDbEntry(entry: DbShortUrl): ShortUrlEntry {
  return {
    code: entry.code,
    targetUrl: entry.targetUrl,
    createdAt: entry.createdAt.toISOString(),
    clicks: entry.clicks,
  };
}

export async function createShortUrl(targetUrl: string, customCode?: string): Promise<ShortUrlEntry> {
  const normalized = normalizeTargetUrl(targetUrl);

  let code = customCode ? validateCustomCode(customCode) : "";

  if (!code) {
    for (let i = 0; i < 20; i++) {
      const candidate = generateCode();
      const exists = await prisma.shortUrl.findUnique({
        where: { code: candidate },
        select: { code: true },
      });

      if (!exists) {
        code = candidate;
        break;
      }
    }

    if (!code) {
      throw new Error("Failed to generate a unique short code");
    }
  }

  const existing = await prisma.shortUrl.findUnique({
    where: { code },
    select: { code: true },
  });

  if (existing) {
    throw new Error("Short code already exists");
  }

  const entry = await prisma.shortUrl.create({
    data: {
      code,
      targetUrl: normalized,
    },
  });

  return mapDbEntry(entry);
}

export async function listShortUrls(): Promise<ShortUrlEntry[]> {
  const items = await prisma.shortUrl.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return items.map(mapDbEntry);
}

export async function findShortUrl(code: string): Promise<ShortUrlEntry | undefined> {
  const entry = await prisma.shortUrl.findUnique({
    where: { code },
  });

  return entry ? mapDbEntry(entry) : undefined;
}

export async function incrementClicks(code: string): Promise<ShortUrlEntry | undefined> {
  const entry = await prisma.shortUrl.findUnique({
    where: { code },
  });

  if (!entry) {
    return undefined;
  }

  const updated = await prisma.shortUrl.update({
    where: { code },
    data: {
      clicks: {
        increment: 1,
      },
    },
  });

  return mapDbEntry(updated);
}
