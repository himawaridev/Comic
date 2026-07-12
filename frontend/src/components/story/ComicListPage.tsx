import SearchBox from "@/components/story/SearchBox";
import SectionHeader from "@/components/story/SectionHeader";
import StoryHorizontalCard from "@/components/story/StoryHorizontalCard";
import StoryGrid from "@/components/story/StoryGrid";
import { getStories, StoryCollection } from "@/lib/comic-data";
import EmptyState from "@/components/ui/EmptyState";
import { listStories } from "@/services/story.service";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default async function ComicListPage({
  title,
  collection,
  genre,
  page = 1,
}: {
  title: string;
  collection: StoryCollection;
  genre?: string;
  page?: number;
}) {
  const pageSize = 24;
  const result = genre ? await listStories({ genre, page, limit: pageSize, sort: "updated" }) : null;
  const stories = result ? result.items : await getStories(collection, pageSize);
  const totalPages = result ? Math.max(1, Math.ceil(result.total / pageSize)) : 1;

  return (
    <div className="screen-shell">
      <div className="app-container list-page">
        <div className="list-hero soft-card">
          <div>
            <span className="pill is-active">Comic Library</span>
            <h1>{title}</h1>
            <p>Loc nhanh theo the loai, trang thai va chuong moi trong mot layout doc de quet tren ca mobile lan desktop.</p>
          </div>
          <SearchBox />
        </div>

        <div className="filter-row">
          <Link className="pill" href="/genres">Tat ca the loai</Link>
          {genre ? <span className="pill is-active">{title.replace(/^The loai\s+/i, "")}</span> : null}
        </div>

        <div className="list-content">
          <section className="soft-card list-panel">
            <SectionHeader eyebrow="List" title="Danh sach truyen" />
            <div className="story-list">
              {stories.map((story) => (
                <StoryHorizontalCard story={story} key={story.id} />
              ))}
              {stories.length === 0 ? <EmptyState title="Chua co truyen trong danh sach nay" /> : null}
            </div>
            {genre && totalPages > 1 ? (
              <nav className="pagination-bar" aria-label="Phan trang truyen">
                {page > 1 ? <Link href={`/genres/${genre}?page=${page - 1}`}><ChevronLeft size={16} /> Trang truoc</Link> : <span />}
                <strong>{page} / {totalPages}</strong>
                {page < totalPages ? <Link href={`/genres/${genre}?page=${page + 1}`}>Trang sau <ChevronRight size={16} /></Link> : <span />}
              </nav>
            ) : null}
          </section>

          <aside>
            <SectionHeader eyebrow="Recommend" title="Doc tiep" />
            {stories.length > 0 ? <StoryGrid stories={stories.slice(0, 4)} /> : <EmptyState title="Chua co goi y" />}
          </aside>
        </div>
      </div>
    </div>
  );
}
