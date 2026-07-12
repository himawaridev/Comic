import { fail, ok } from "@/lib/response";
import { readSession } from "@/lib/auth";
import { Favorite, Story } from "@/models";
import { getStoryBySlug, toStoryDto } from "@/services/story.service";
import { Op } from "sequelize";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const user = await readSession();
  if (!user) return fail("Unauthorized", 401);
  const favorites = await Favorite.findAll({ where: { userId: user.id } });
  const storyIds = favorites.map((favorite) => Number(favorite.get("storyId")));
  const stories = storyIds.length ? await Story.findAll({ where: { id: { [Op.in]: storyIds } }, include: [{ all: true }] }) : [];
  return ok({ items: stories.map(toStoryDto) });
}

export async function POST(request: Request) {
  const user = await readSession();
  if (!user) return fail("Unauthorized", 401);
  const body = await request.json();
  const story = body.slug ? await getStoryBySlug(body.slug) : null;
  const storyId = Number(body.storyId || story?.id);
  if (!storyId) return fail("Missing storyId", 400);
  await Favorite.findOrCreate({ where: { userId: user.id, storyId }, defaults: { userId: user.id, storyId } });
  return ok({ storyId });
}
