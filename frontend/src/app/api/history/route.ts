import { fail, ok } from "@/lib/response";
import { readSession } from "@/lib/auth";
import { Chapter, ReadingHistory, Story } from "@/models";
import { toStoryDto } from "@/services/story.service";
import { Op } from "sequelize";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const user = await readSession();
  if (!user) return fail("Unauthorized", 401);
  const history = await ReadingHistory.findAll({ where: { userId: user.id }, order: [["lastReadAt", "DESC"]] });
  const storyIds = history.map((item) => Number(item.get("storyId")));
  const stories = storyIds.length ? await Story.findAll({ where: { id: { [Op.in]: storyIds } }, include: [{ all: true }] }) : [];
  return ok({ items: stories.map(toStoryDto), history: history.map((item) => item.get({ plain: true })) });
}

export async function POST(request: Request) {
  const user = await readSession();
  if (!user) return fail("Unauthorized", 401);
  const body = await request.json();
  const chapter = await Chapter.findByPk(Number(body.chapterId));
  if (!chapter) return fail("Chapter not found", 404);
  const storyId = chapter.get("storyId") as number;
  const [record] = await ReadingHistory.findOrCreate({
    where: { userId: user.id, storyId },
    defaults: { userId: user.id, storyId, chapterId: chapter.id, progressPercent: Number(body.progressPercent || 0), lastReadAt: new Date() },
  });
  await record.update({ chapterId: chapter.id, progressPercent: Number(body.progressPercent || 0), lastReadAt: new Date() });
  return ok({ history: record.get({ plain: true }) });
}
