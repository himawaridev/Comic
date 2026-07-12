import AdminCommentsPanel from "@/components/admin/AdminCommentsPanel";
import AdminNav from "@/components/admin/AdminNav";
import EmptyState from "@/components/ui/EmptyState";
import { readSession } from "@/lib/auth";
import { Comment, Story, User } from "@/models";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  const session = await readSession();
  if (!session || session.role !== "admin") return <div className="screen-shell"><div className="app-container"><EmptyState title="Chi admin moi vao duoc" /></div></div>;

  const comments = await Comment.findAll({
    include: [
      { model: User, as: "user", attributes: ["name", "email"] },
      { model: Story, as: "story", attributes: ["title", "slug"] },
    ],
    order: [["createdAt", "DESC"]],
    limit: 100,
  });
  const items = comments.map((comment) => {
    const raw = comment.get({ plain: true }) as Record<string, any>;
    return {
      id: String(raw.id),
      content: String(raw.content),
      isEdited: Boolean(raw.isEdited),
      createdAt: new Date(raw.createdAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Bangkok" }),
      userName: String(raw.user.name),
      userEmail: String(raw.user.email),
      storyTitle: String(raw.story.title),
      storySlug: String(raw.story.slug),
    };
  });

  return (
    <div className="screen-shell">
      <section className="app-container admin-shell">
        <AdminNav />
        <header className="admin-heading"><span>Cong dong</span><h1>Quan ly binh luan</h1><p>Rà soat noi dung moi va xoa cac binh luan khong phu hop.</p></header>
        <div className="admin-panel soft-card"><AdminCommentsPanel initialComments={items} /></div>
      </section>
    </div>
  );
}
