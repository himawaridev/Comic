import { fail, ok } from "@/lib/response";
import { readSession } from "@/lib/auth";
import { crawlAllDefault, crawlAllGenreCatalog, crawlCategory, crawlSourceGenre, crawlStory, discoverSourceGenres } from "@/services/crawler.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const user = await readSession();
  if (!user || user.role !== "admin") return fail("Forbidden", 403);
  try {
    return ok({ categories: await discoverSourceGenres() });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Cannot discover source genres", 502);
  }
}

export async function POST(request: Request) {
  const user = await readSession();
  if (!user || user.role !== "admin") return fail("Forbidden", 403);
  const body = await request.json().catch(() => ({}));
  const maxChapters = Number(body.maxChapters || 0);
  const crawlContent = Boolean(body.crawlContent);
  if (body.storyUrl) return ok(await crawlStory(body.storyUrl, { crawlContent, maxChapters: maxChapters > 0 ? maxChapters : undefined }));
  if (body.mode === "catalog") return ok(await crawlAllGenreCatalog({ pagesPerGenre: Number(body.pages || 0), limitPerPage: Number(body.limit || 0) }));
  if (body.categoryPath && body.categoryName) {
    return ok(await crawlSourceGenre(
      { key: String(body.categoryKey || body.categoryName), name: String(body.categoryName), path: String(body.categoryPath) },
      {
        pages: Number(body.pages ?? 1),
        limit: Number(body.limit || 0),
        crawlContent,
        maxChaptersPerStory: maxChapters > 0 ? maxChapters : undefined,
      },
    ));
  }
  if (body.category) return ok(await crawlCategory(body.category, { pages: Number(body.pages ?? 1), limit: Number(body.limit || 0), crawlContent, maxChaptersPerStory: maxChapters > 0 ? maxChapters : undefined }));
  return ok(await crawlAllDefault());
}
