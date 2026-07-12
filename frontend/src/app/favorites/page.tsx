import SectionHeader from "@/components/story/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import { readSession } from "@/lib/auth";
import { Favorite, Story } from "@/models";
import { toStoryDto } from "@/services/story.service";
import FavoriteCollection from "@/components/story/FavoriteCollection";
import { Op } from "sequelize";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const user = await readSession();
  if (!user) {
    return (
      <div className="screen-shell">
        <div className="app-container">
          <SectionHeader eyebrow="Saved" title="Truyen yeu thich" />
          <EmptyState title="Hay dang nhap de xem truyen yeu thich" description="Danh sach yeu thich duoc doc tu API /api/favorites sau khi co session user." />
        </div>
      </div>
    );
  }
  const favorites = await Favorite.findAll({ where: { userId: user.id } });
  const storyIds = favorites.map((favorite) => Number(favorite.get("storyId")));
  const stories = storyIds.length ? await Story.findAll({ where: { id: { [Op.in]: storyIds } }, include: [{ all: true }] }) : [];
  return (
    <div className="screen-shell">
      <div className="app-container collection-page">
        <SectionHeader eyebrow="Saved" title="Truyen yeu thich" />
        <FavoriteCollection initialStories={stories.map(toStoryDto)} />
      </div>
    </div>
  );
}
