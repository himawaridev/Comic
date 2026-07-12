import Link from "next/link";
import { BookOpen, Database, MessageSquareText, ShieldCheck, Star, Users } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { readSession } from "@/lib/auth";
import EmptyState from "@/components/ui/EmptyState";
import { Chapter, Comment, CrawlSource, Rating, Story, User } from "@/models";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await readSession();
  if (!user || user.role !== "admin") {
    return (
      <div className="screen-shell">
        <div className="app-container">
          <EmptyState title="Chi admin moi vao duoc" description="Dang nhap bang admin@example.com sau khi chay db:seed." />
        </div>
      </div>
    );
  }

  const [stories, chapters, users, comments, ratings, sources] = await Promise.all([
    Story.count(),
    Chapter.count(),
    User.count(),
    Comment.count(),
    Rating.count(),
    CrawlSource.count({ where: { enabled: true } }),
  ]);

  const stats = [
    { label: "Truyen", value: stories, icon: BookOpen },
    { label: "Chapters", value: chapters, icon: Database },
    { label: "Tai khoan", value: users, icon: Users },
    { label: "Binh luan", value: comments, icon: MessageSquareText },
    { label: "Danh gia", value: ratings, icon: Star },
    { label: "Nguon crawl", value: sources, icon: ShieldCheck },
  ];

  const management = [
    { href: "/admin/stories", title: "Kho truyen", description: "Kiem tra truyen, chapter va du lieu hien co.", icon: BookOpen },
    { href: "/admin/users", title: "Tai khoan", description: "Theo doi dang ky va phan quyen admin.", icon: Users },
    { href: "/admin/comments", title: "Binh luan", description: "Kiem duyet noi dung tu cong dong doc gia.", icon: MessageSquareText },
    { href: "/admin/crawler", title: "Crawler", description: "Nap truyen va chapter moi tu nguon du lieu.", icon: Database },
  ];

  return (
    <div className="screen-shell">
      <section className="app-container admin-shell">
        <AdminNav />
        <header className="admin-heading">
          <span>Admin workspace</span>
          <h1>Trung tam quan tri</h1>
          <p>Tong quan noi dung, tai khoan va hoat dong cong dong trong mot man hinh.</p>
        </header>
        <div className="admin-stat-grid">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return <article key={stat.label}><span><Icon size={18} /></span><strong>{stat.value.toLocaleString("vi-VN")}</strong><small>{stat.label}</small></article>;
          })}
        </div>
        <div className="admin-management-grid">
          {management.map((item) => {
            const Icon = item.icon;
            return <Link href={item.href} key={item.href}><span><Icon size={21} /></span><strong>{item.title}</strong><small>{item.description}</small></Link>;
          })}
        </div>
      </section>
    </div>
  );
}
