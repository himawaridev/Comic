import ChapterList from "@/components/story/ChapterList";
import SectionHeader from "@/components/story/SectionHeader";
import StoryDetailHero from "@/components/story/StoryDetailHero";
import StoryGrid from "@/components/story/StoryGrid";
import { findStoryBySlug, getChapterPage, getStories } from "@/lib/comic-data";
import { notFound } from "next/navigation";
import { readSession } from "@/lib/auth";
import { Chapter, Favorite, Rating, ReadingHistory } from "@/models";
import CommentsSection from "@/components/story/CommentsSection";
import { listStoryComments } from "@/services/comment.service";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const story = await findStoryBySlug(params.slug);
  if (!story) return { title: "Story not found" };
  return {
    title: `${story.title} - Truyen Hoan`,
    description: story.description,
  };
}

export default async function StoryDetailPage({ params }: { params: { slug: string } }) {
  const story = await findStoryBySlug(params.slug);
  if (!story) notFound();
  const chapterPage = await getChapterPage(story.slug);
  const chapters = chapterPage.items;
  const related = await getStories("hot", 4);
  const user = await readSession();
  const comments = (await listStoryComments(story.slug)) || [];
  let initialFavorite = false;
  let initialRating = 0;
  let continueChapterSlug: string | null = null;
  if (user) {
    const [favorite, rating, history] = await Promise.all([
      Favorite.findOne({ where: { userId: user.id, storyId: Number(story.id) } }),
      Rating.findOne({ where: { userId: user.id, storyId: Number(story.id) } }),
      ReadingHistory.findOne({ where: { userId: user.id, storyId: Number(story.id) } }),
    ]);
    initialFavorite = Boolean(favorite);
    initialRating = Number(rating?.get("value") || 0);
    if (history) continueChapterSlug = (await Chapter.findByPk(Number(history.get("chapterId"))))?.getDataValue("slug") || null;
  }

  return (
    <div className="detail-page">
        <StoryDetailHero story={story} chapters={chapters} continueChapterSlug={continueChapterSlug} initialFavorite={initialFavorite} initialRating={initialRating} authenticated={Boolean(user)} />
      <div className="app-container detail-content">
        <ChapterList story={story} chapters={chapters} initialTotal={chapterPage.total} />
        <CommentsSection storySlug={story.slug} initialComments={comments} currentUser={user ? { id: user.id, name: user.name, role: user.role } : null} />
        <section>
          <SectionHeader eyebrow="Related" title="Truyen dang hot" />
          <StoryGrid stories={related} />
        </section>
      </div>
    </div>
  );
}
