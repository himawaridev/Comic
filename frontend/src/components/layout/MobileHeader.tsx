"use client";

import Link from "next/link";
import { LogIn, Menu, Search, ShieldCheck, UserRound } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export type ShellUser = { name: string; email: string; role: "user" | "admin" } | null;

export default function MobileHeader({ user, onMenu }: { user: ShellUser; onMenu: () => void }) {
  const initial = (user?.name || "Guest").slice(0, 1).toUpperCase();
  return (
    <header className="app-header">
      <div className="app-header__inner app-container">
        <button className="header-profile" type="button" onClick={onMenu} aria-label="Mo menu tai khoan">
          <span className="avatar">{initial}</span>
          <span>
            <small>{user ? (user.role === "admin" ? "Quan tri vien" : "Tai khoan doc gia") : "Chua dang nhap"}</small>
            <strong>{user?.name || "Khach"}</strong>
          </span>
        </button>

        <Link href="/" className="desktop-brand" aria-label="Truyen Hoan">
          <span>TH</span>
          <strong>Truyen Hoan</strong>
        </Link>
        <nav className="desktop-nav" aria-label="Dieu huong chinh">
          <Link href="/">Trang chu</Link>
          <Link href="/TruyenHot">Pho bien</Link>
          <Link href="/genres">The loai</Link>
          <Link href="/history">Dang doc</Link>
        </nav>

        <div className="header-actions">
          <Link className="icon-button" href="/search" aria-label="Tim kiem"><Search size={19} /></Link>
          {user?.role === "admin" ? <Link className="header-admin" href="/admin" aria-label="Mo trang quan tri"><ShieldCheck size={17} /><span>Quan tri</span></Link> : null}
          <Link className={user ? "header-account" : "header-account is-login"} href={user ? "/profile" : "/login"}>
            {user ? <UserRound size={17} /> : <LogIn size={17} />}
            <span>{user ? "Tai khoan" : "Dang nhap"}</span>
          </Link>
          <span className="header-theme"><ThemeToggle /></span>
          <button className="icon-button header-menu" type="button" onClick={onMenu} aria-label="Mo menu"><Menu size={20} /></button>
        </div>
      </div>
    </header>
  );
}
