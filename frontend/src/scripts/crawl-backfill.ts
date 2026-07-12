import { Op } from "sequelize";
import { sequelize } from "@/lib/sequelize";
import { Chapter, Story } from "@/models";
import { crawlStory } from "@/services/crawler.service";

async function main() {
  await sequelize.authenticate();
  const requestedIds = (process.env.CRAWL_STORY_IDS || "")
    .split(",")
    .map((value) => Number(value.trim()))
    .filter(Boolean);
  const limit = Math.max(1, Number(process.env.CRAWL_BACKFILL_LIMIT || 20));

  const stories = requestedIds.length
    ? await Story.findAll({ where: { id: { [Op.in]: requestedIds }, sourceUrl: { [Op.ne]: null } }, order: [["id", "ASC"]] })
    : await Story.findAll({ where: { sourceUrl: { [Op.ne]: null } }, order: [["id", "ASC"]], limit: limit * 4 });

  const queue: InstanceType<typeof Story>[] = [];
  for (const story of stories) {
    const saved = await Chapter.count({ where: { storyId: story.id } });
    if (saved < story.totalChapters || saved <= 2) queue.push(story);
    if (!requestedIds.length && queue.length >= limit) break;
  }

  console.log(`[backfill] ${queue.length} stories queued`);
  let nextIndex = 0;
  let completed = 0;
  let failed = 0;
  async function worker() {
    while (nextIndex < queue.length) {
      const story = queue[nextIndex];
      nextIndex += 1;
      try {
        const result = await crawlStory(story.sourceUrl!, { crawlContent: false });
        completed += 1;
        console.log(`[backfill] ${completed}/${queue.length} ${story.title}: ${result.chapters} chapters`);
      } catch (error) {
        failed += 1;
        console.error(`[backfill] failed ${story.title}`, error);
      }
    }
  }
  await Promise.all([worker(), worker()]);
  console.log(`[backfill] completed=${completed} failed=${failed}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => sequelize.close());
