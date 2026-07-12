import { fail, ok } from "@/lib/response";
import { Author, Story } from "@/models";
import { toStoryDto } from "@/services/story.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const author = await Author.findOne({ where: { slug: params.slug } });
    if (!author) return fail("Author not found", 404);
    const stories = await Story.findAll({ where: { authorId: Number(author.get("id")) }, include: [{ all: true }] });
    return ok({ author: author.get({ plain: true }), stories: stories.map(toStoryDto) });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Cannot load author", 500);
  }
}
