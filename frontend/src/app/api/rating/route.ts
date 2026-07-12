import { fail, ok } from "@/lib/response";
import { readSession } from "@/lib/auth";
import { Rating, Story } from "@/models";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await readSession();
  if (!user) return fail("Unauthorized", 401);
  const body = await request.json();
  const storyId = Number(body.storyId);
  const value = Number(body.value);
  if (!storyId || value < 1 || value > 10) return fail("Invalid rating", 400);
  const [rating] = await Rating.findOrCreate({ where: { userId: user.id, storyId }, defaults: { userId: user.id, storyId, value } });
  await rating.update({ value });
  const ratings = await Rating.findAll({ where: { storyId } });
  const avg = ratings.reduce((sum, item) => sum + Number(item.get("value")), 0) / Math.max(ratings.length, 1);
  await Story.update({ ratingAvg: avg, ratingCount: ratings.length }, { where: { id: storyId } });
  return ok({ ratingAvg: avg, ratingCount: ratings.length });
}
