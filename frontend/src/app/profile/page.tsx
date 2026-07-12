import { BadgeCheck, Heart, History, KeyRound, Mail, UserRound } from "lucide-react";
import { readSession } from "@/lib/auth";
import EmptyState from "@/components/ui/EmptyState";
import LogoutButton from "@/components/auth/LogoutButton";
import { Favorite, ReadingHistory } from "@/models";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await readSession();
  if (!user) {
    return (
      <div className="screen-shell">
        <div className="app-container">
          <EmptyState title="Ban chua dang nhap" description="Dang nhap de xem profile, yeu thich va lich su doc tu database." />
        </div>
      </div>
    );
  }

  const [favorites, history] = await Promise.all([Favorite.count({ where: { userId: user.id } }), ReadingHistory.count({ where: { userId: user.id } })]);
  return (
    <div className="screen-shell">
      <section className="profile-card app-container soft-card">
        <div className="avatar avatar--large">{user.name.slice(0, 1).toUpperCase()}</div>
        <h1>{user.name}</h1>
        <p>
          <Mail size={16} /> {user.email}
        </p>
        <div className="detail-stats">
          <span>
            <Heart size={18} />
            <strong>{favorites}</strong>
            Favorites
          </span>
          <span>
            <History size={18} />
            <strong>{history}</strong>
            History
          </span>
          <span>
            <UserRound size={18} />
            <strong>{user.role}</strong>
            Role
          </span>
          <span>
            <KeyRound size={18} />
            <strong>{user.authProvider === "mixed" ? "Email + Google" : user.authProvider === "google" ? "Google" : "Email"}</strong>
            Dang nhap
          </span>
        </div>
        {user.emailVerified ? <p className="profile-verified"><BadgeCheck size={16} /> Email da xac minh</p> : null}
        <LogoutButton />
      </section>
    </div>
  );
}
