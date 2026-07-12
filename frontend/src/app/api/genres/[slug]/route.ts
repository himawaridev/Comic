import { fail, ok } from "@/lib/response";
import { Genre } from "@/models";
import { listStories } from "@/services/story.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const genre = await Genre.findOne({ where: { slug: params.slug } });
    if (!genre) return fail("Genre not found", 404);
    const { searchParams } = new URL(request.url);
    const stories = await listStories({ genre: params.slug, page: Number(searchParams.get("page") || 1), limit: Number(searchParams.get("limit") || 24) });
    return ok({ genre: genre.get({ plain: true }), stories });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Cannot load genre", 500);
  }
}
