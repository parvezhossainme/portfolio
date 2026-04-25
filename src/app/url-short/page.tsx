"use client";

import { useState } from "react";
import { Link2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateResponse = {
    shortUrl: string;
};

export default function UrlShortenerPage() {
    const [url, setUrl] = useState("");
    const [customCode, setCustomCode] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setError(null);
        setMessage(null);
        setShortUrl("");

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

            const data = (await res.json()) as Partial<CreateResponse> & {
                error?: string;
            };

            if (!res.ok) {
                throw new Error(data.error || "Failed to create short URL");
            }

            setUrl("");
            setCustomCode("");
            setShortUrl(data.shortUrl || "");
            setMessage(`Created: ${data.shortUrl}`);
        } catch (err) {
            const messageText =
                err instanceof Error ?
                    err.message
                :   "Failed to create short URL";
            setError(messageText);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden py-20">
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-[-180px] top-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
                <div className="absolute right-[-140px] top-40 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
            </div>

            <div className="mx-auto max-w-6xl px-6">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-semibold sm:text-4xl">
                        URL Shortener
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Create a short link in one step.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <Card className="border-border/70 bg-card/85 shadow-xl shadow-black/5 backdrop-blur-sm dark:shadow-black/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Link2 className="h-5 w-5" />
                                Create Short Link
                            </CardTitle>
                            <CardDescription>
                                parvezhossainme.com/url-short/&lt;your_link&gt;
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreate} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="target-url">
                                        Target URL
                                    </Label>
                                    <Input
                                        id="target-url"
                                        type="text"
                                        value={url}
                                        onChange={(event) =>
                                            setUrl(event.target.value)
                                        }
                                        placeholder="https://example.com/very/long/path"
                                        required
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="custom-code">
                                        Custom Code (optional)
                                    </Label>
                                    <Input
                                        id="custom-code"
                                        type="text"
                                        value={customCode}
                                        onChange={(event) =>
                                            setCustomCode(event.target.value)
                                        }
                                        placeholder="my-link-2026"
                                        className="h-11"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        4-32 chars: letters, numbers, _ or -
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-11 w-full text-sm font-semibold"
                                >
                                    {loading ?
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    :   <>
                                            <Link2 className="h-4 w-4" />
                                            Shorten URL
                                        </>
                                    }
                                </Button>
                            </form>

                            {message && (
                                <div className="mt-4 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
                                    {error}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-border/70 bg-card/85 shadow-xl shadow-black/5 backdrop-blur-sm dark:shadow-black/20">
                        <CardHeader>
                            <CardTitle className="text-xl">QR Output</CardTitle>
                            <CardDescription>
                                Scan the generated short URL
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {shortUrl ?
                                <>
                                    <div className="mx-auto w-fit rounded-lg border border-border bg-white p-3">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(shortUrl)}`}
                                            alt="QR code for short URL"
                                            width={220}
                                            height={220}
                                            className="h-[220px] w-[220px]"
                                        />
                                    </div>
                                    <p className="break-all text-center text-xs text-muted-foreground">
                                        {shortUrl}
                                    </p>
                                </>
                            :   <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                                    Create a short link to generate QR
                                </div>
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
