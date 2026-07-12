import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { readSession } from "@/lib/auth";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeader from "@/components/story/SectionHeader";
import StoryHorizontalCard from "@/components/story/StoryHorizontalCard";
import { listStories } from "@/services/story.service";

export const dynamic = "force-dynamic";

export default async function AdminStoriesPage() {
  const user = await readSession();
  if (!user || user.role !== "admin") {
    return (
      <div className="screen-shell">
        <div className="app-container"><EmptyState title="Chi admin moi vao duoc" /></div>
      </div>
    );
  }

  const stories = await listStories({ limit: 50, sort: "updated" });
  return (
    <div className="screen-shell">
      <section className="app-container admin-shell">
        <AdminNav />
        <header className="admin-heading"><span>Noi dung</span><h1>Quan ly truyen</h1><p>50 truyen cap nhat gan nhat trong kho du lieu.</p></header>
        <div className="soft-card list-panel">
          <SectionHeader eyebrow="Database" title="Danh sach truyen" />
          <div className="story-list">
            {stories.items.map((story) => <StoryHorizontalCard story={story} key={story.id} />)}
            {stories.items.length === 0 ? <EmptyState title="Chua co truyen trong DB" /> : null}
          </div>
          <Link className="btn btn-primary" href="/admin/crawler">Nap du lieu bang crawler</Link>
        </div>
      </section>
    </div>
  );
}
