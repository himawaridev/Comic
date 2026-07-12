import { fail, ok } from "@/lib/response";
import { readSession } from "@/lib/auth";
import { ReadingHistory } from "@/models";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(_: Request, { params }: { params: { storyId: string } }) {
  const user = await readSession();
  if (!user) return fail("Unauthorized", 401);
  await ReadingHistory.destroy({ where: { userId: user.id, storyId: Number(params.storyId) } });
  return ok({ deleted: true });
}
