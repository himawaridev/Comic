"use client";

import Link from "next/link";
import { BookOpen, Compass, Gift, Heart, History, LogIn, LogOut, Settings, Shield, UserRound, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import MobileHeader, { ShellUser } from "./MobileHeader";
import MobileBottomNav from "./MobileBottomNav";

const baseItems = [
  { label: "Kham pha truyen", href: "/", icon: Compass },
  { label: "Truyen yeu thich", href: "/favorites", icon: Heart },
  { label: "Lich su doc", href: "/history", icon: History },
  { label: "The loai", href: "/genres", icon: BookOpen },
  { label: "Tai khoan", href: "/profile", icon: UserRound },
  { label: "Cai dat", href: "/profile", icon: Settings },
  { label: "Ung ho", href: "/HoTroNhanh", icon: Gift },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<ShellUser>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isReader = pathname.includes("/chapters/");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => setUser(payload?.data?.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className={isReader ? "app-shell is-reader" : "app-shell"}>
      {!isReader ? <MobileHeader user={user} onMenu={() => setOpen(true)} /> : null}

      <aside className={`mobile-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <button className="drawer-backdrop" type="button" onClick={() => setOpen(false)} aria-label="Dong menu" />
        <div className="drawer-panel">
          <div className="drawer-profile">
            <span className="avatar avatar--drawer">{(user?.name || "G").slice(0, 1).toUpperCase()}</span>
            <div><strong>{user?.name || "Doc gia"}</strong><span>{user?.email || "Chua dang nhap"}</span></div>
            <button className="icon-button drawer-close" type="button" onClick={() => setOpen(false)} aria-label="Dong"><X size={18} /></button>
          </div>
          <nav className="drawer-menu">
            {baseItems.map((item) => {
              const Icon = item.icon;
              const href = item.href === "/profile" && !user ? "/login" : item.href;
              const label = item.href === "/profile" && !user ? "Dang nhap" : item.label;
              return <Link href={href} className={pathname === href ? "drawer-link is-active" : "drawer-link"} key={item.label} prefetch={item.href === "/profile" ? false : undefined}><Icon size={19} /><span>{label}</span></Link>;
            })}
            {user?.role === "admin" ? <Link href="/admin" className="drawer-link"><Shield size={19} /><span>Quan tri</span></Link> : null}
            {user ? (
              <button className="drawer-link" type="button" onClick={logout}><LogOut size={19} /><span>Dang xuat</span></button>
            ) : (
              <Link href="/login" className="drawer-link"><LogIn size={19} /><span>Dang nhap</span></Link>
            )}
          </nav>
        </div>
      </aside>

      <main className="main-content">{children}</main>
      {!isReader ? <MobileBottomNav authenticated={Boolean(user)} /> : null}
    </div>
  );
}
