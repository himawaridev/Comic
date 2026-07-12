import SectionHeader from "@/components/story/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import { readSession } from "@/lib/auth";
import { Chapter, ReadingHistory, Story } from "@/models";
import { toStoryDto } from "@/services/story.service";
import HistoryCollection, { HistoryEntry } from "@/components/story/HistoryCollection";
import { Op } from "sequelize";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const user = await readSession();
  if (!user) {
    return (
      <div className="screen-shell">
        <section className="app-container soft-card list-panel">
          <SectionHeader eyebrow="Continue" title="Lich su doc" />
          <EmptyState title="Hay dang nhap de xem lich su doc" description="Reader se ghi tien do vao API /api/history khi user da dang nhap." />
        </section>
      </div>
    );
  }
  const history = await ReadingHistory.findAll({ where: { userId: user.id }, order: [["lastReadAt", "DESC"]] });
  const storyIds = history.map((item) => Number(item.get("storyId")));
  const stories = storyIds.length ? await Story.findAll({ where: { id: { [Op.in]: storyIds } }, include: [{ all: true }] }) : [];
  const chapterIds = history.map((item) => Number(item.get("chapterId")));
  const chapters = chapterIds.length ? await Chapter.findAll({ where: { id: { [Op.in]: chapterIds } } }) : [];
  const storyMap = new Map(stories.map((story) => [story.id, toStoryDto(story)]));
  const chapterMap = new Map(chapters.map((chapter) => [chapter.id, chapter]));
  const entries = history.flatMap((record) => {
    const story = storyMap.get(Number(record.get("storyId")));
    const chapter = chapterMap.get(Number(record.get("chapterId")));
    if (!story || !chapter) return [];
    return [{ story, chapterSlug: chapter.getDataValue("slug"), chapterTitle: chapter.getDataValue("title"), progressPercent: Number(record.get("progressPercent")), lastReadAt: new Date(record.get("lastReadAt") as Date).toISOString() } satisfies HistoryEntry];
  });

  return (
    <div className="screen-shell">
      <section className="app-container collection-page">
        <SectionHeader eyebrow="Continue" title="Lich su doc" />
        <HistoryCollection initialEntries={entries} />
      </section>
    </div>
  );
}
