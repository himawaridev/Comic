import { z } from "zod";
import { readSession } from "@/lib/auth";
import { fail, ok } from "@/lib/response";
import { Comment, Story } from "@/models";
import { findCommentWithUser, listStoryComments } from "@/services/comment.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const commentSchema = z.object({ content: z.string().trim().min(2).max(2000) });

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const comments = await listStoryComments(params.slug);
    if (!comments) return fail("Story not found", 404);
    return ok({ items: comments, total: comments.length });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Cannot load comments", 500);
  }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  const user = await readSession();
  if (!user) return fail("Unauthorized", 401);
  try {
    const body = commentSchema.parse(await request.json());
    const story = await Story.findOne({ where: { slug: params.slug }, attributes: ["id"] });
    if (!story) return fail("Story not found", 404);
    const comment = await Comment.create({ userId: user.id, storyId: story.id, content: body.content, isEdited: false });
    return ok({ comment: await findCommentWithUser(comment.id) }, { status: 201 });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Cannot create comment", 400);
  }
}
