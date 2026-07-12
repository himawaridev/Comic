import AdminNav from "@/components/admin/AdminNav";
import AdminUsersPanel from "@/components/admin/AdminUsersPanel";
import EmptyState from "@/components/ui/EmptyState";
import { readSession } from "@/lib/auth";
import { User } from "@/models";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await readSession();
  if (!session || session.role !== "admin") return <div className="screen-shell"><div className="app-container"><EmptyState title="Chi admin moi vao duoc" /></div></div>;

  const users = await User.findAll({ order: [["createdAt", "DESC"]], limit: 100 });
  const items = users.map((user) => {
    const raw = user.get({ plain: true }) as Record<string, any>;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      authProvider: user.authProvider,
      emailVerified: user.emailVerified,
      createdAt: new Date(raw.createdAt).toLocaleDateString("vi-VN", { timeZone: "Asia/Bangkok" }),
    };
  });

  return (
    <div className="screen-shell">
      <section className="app-container admin-shell">
        <AdminNav />
        <header className="admin-heading"><span>Tai khoan</span><h1>Quan ly nguoi dung</h1><p>Phan quyen doc gia va admin. Tai khoan dang su dung khong the tu ha quyen.</p></header>
        <div className="admin-panel soft-card"><AdminUsersPanel initialUsers={items} currentUserId={session.id} /></div>
      </section>
    </div>
  );
}
