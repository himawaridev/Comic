"use client";

import Link from "next/link";
import { Compass, Heart, History, Home, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Home", icon: Home, match: (path: string) => path === "/" },
  { href: "/favorites", label: "Yeu thich", icon: Heart, match: (path: string) => path.startsWith("/favorites") },
  { href: "/genres", label: "Kham pha", icon: Compass, match: (path: string) => path.startsWith("/genres") || path.startsWith("/search") },
  { href: "/history", label: "Lich su", icon: History, match: (path: string) => path.startsWith("/history") },
  { href: "/profile", label: "Tai khoan", icon: UserRound, match: (path: string) => path.startsWith("/profile") },
];

export default function MobileBottomNav({ authenticated }: { authenticated: boolean }) {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav" aria-label="Dieu huong nhanh">
      {items.map((item) => {
        const Icon = item.icon;
        const href = item.href === "/profile" && !authenticated ? "/login" : item.href;
        const active = item.href === "/profile" && !authenticated ? pathname.startsWith("/login") || pathname.startsWith("/register") : item.match(pathname);
        return (
          <Link className={active ? "is-active" : ""} href={href} key={item.href} aria-label={authenticated ? item.label : item.href === "/profile" ? "Dang nhap" : item.label} prefetch={item.href === "/profile" ? false : undefined}>
            <Icon size={21} />
            <span>{item.href === "/profile" && !authenticated ? "Dang nhap" : item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
