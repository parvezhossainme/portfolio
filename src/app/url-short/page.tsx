"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Copy, ExternalLink, Link2, Loader2, ScissorsLineDashed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site.config";

type ShortItem = {
  code: string;
  targetUrl: string;
  createdAt: string;
  clicks: number;
};

type ListResponse = {
  items: ShortItem[];
};

type CreateResponse = {
  item: ShortItem;
  shortUrl: string;
};

export default function UrlShortenerPage() {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [items, setItems] = useState<ShortItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [baseUrl, setBaseUrl] = useState("");

  const fetchItems = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/url-short", { cache: "no-store" });
      const data = (await res.json()) as ListResponse;
      setItems(data.items || []);
    } catch {
      setError("Failed to load URL list.");
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    void fetchItems();
  }, [fetchItems]);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/url-short", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          customCode: customCode.trim() || undefined,
        }),
      });

      const data = (await res.json()) as Partial<CreateResponse> & { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Failed to create short URL");
      }

      setUrl("");
      setCustomCode("");
      setMessage(`Created: ${data.shortUrl}`);
      await fetchItems();
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Failed to create short URL";
      setError(messageText);
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Copied to clipboard");
      setError(null);
    } catch {
      setError("Could not copy to clipboard");
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-8 space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Utility</p>
          <h1 className="text-3xl sm:text-4xl font-semibold">URL Shortener</h1>
          <p className="text-muted-foreground max-w-3xl">
            Create and manage short links directly inside {siteConfig.siteName}. Your short links will be available under
            {" "}
            <span className="font-medium">/url-short/&lt;code&gt;</span>.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Card className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <ScissorsLineDashed className="h-6 w-6" />
                Create Short Link
              </CardTitle>
              <CardDescription>
                Paste a long URL and optionally set a custom code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="target-url">Target URL</Label>
                  <Input
                    id="target-url"
                    type="text"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="https://example.com/very/long/path"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-code">Custom Code (optional)</Label>
                  <Input
                    id="custom-code"
                    type="text"
                    value={customCode}
                    onChange={(event) => setCustomCode(event.target.value)}
                    placeholder="my-link-2026"
                  />
                  <p className="text-xs text-muted-foreground">
                    Allowed: letters, numbers, underscore and hyphen. Length 4-32.
                  </p>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Link2 className="h-4 w-4" />
                      Shorten URL
                    </>
                  )}
                </Button>
              </form>

              {message && <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">{message}</p>}
              {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle className="text-2xl">Recent Links</CardTitle>
              <CardDescription>Live list from your local short-link store.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingList && <p className="text-sm text-muted-foreground">Loading links...</p>}

              {!loadingList && items.length === 0 && (
                <p className="text-sm text-muted-foreground">No links yet. Create your first short URL.</p>
              )}

              {!loadingList &&
                items.map((item) => {
                  const shortPath = `/url-short/${item.code}`;
                  const shortUrl = baseUrl ? `${baseUrl}${shortPath}` : shortPath;

                  return (
                    <div key={item.code} className="rounded-lg border border-border/60 p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm break-all">{shortUrl}</p>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(shortUrl)}
                            aria-label="Copy short url"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={shortUrl} target="_blank" rel="noopener noreferrer" aria-label="Open short url">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground break-all">{item.targetUrl}</p>
                      <p className="text-xs text-muted-foreground">
                        Clicks: {item.clicks} | Created: {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
