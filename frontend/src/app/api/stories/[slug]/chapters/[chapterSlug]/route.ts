import { fail, ok } from "@/lib/response";
import { getChapter } from "@/services/story.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { slug: string; chapterSlug: string } }) {
  try {
    const data = await getChapter(params.slug, params.chapterSlug);
    if (!data) return fail("Chapter not found", 404);
    return ok(data);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Cannot load chapter", 500);
  }
}
