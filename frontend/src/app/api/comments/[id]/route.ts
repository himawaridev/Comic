import { z } from "zod";
import { readSession } from "@/lib/auth";
import { fail, ok } from "@/lib/response";
import { Comment } from "@/models";
import { findCommentWithUser } from "@/services/comment.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({ content: z.string().trim().min(2).max(2000) });

async function authorizedComment(id: string) {
  const user = await readSession();
  if (!user) return { error: fail("Unauthorized", 401) };
  const comment = await Comment.findByPk(Number(id));
  if (!comment) return { error: fail("Comment not found", 404) };
  if (comment.getDataValue("userId") !== user.id && user.role !== "admin") return { error: fail("Forbidden", 403) };
  return { comment };
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const result = await authorizedComment(params.id);
  if (result.error) return result.error;
  try {
    const body = schema.parse(await request.json());
    await result.comment.update({ content: body.content, isEdited: true });
    return ok({ comment: await findCommentWithUser(result.comment.id) });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Cannot update comment", 400);
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const result = await authorizedComment(params.id);
  if (result.error) return result.error;
  await result.comment.destroy();
  return ok({ deleted: true });
}
