"use client";

import Link from "next/link";
import { BookOpen, Database, Gauge, MessageSquareText, Users } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Tong quan", icon: Gauge },
  { href: "/admin/stories", label: "Truyen", icon: BookOpen },
  { href: "/admin/users", label: "Tai khoan", icon: Users },
  { href: "/admin/comments", label: "Binh luan", icon: MessageSquareText },
  { href: "/admin/crawler", label: "Crawler", icon: Database },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="admin-nav" aria-label="Dieu huong quan tri">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
        return <Link className={active ? "is-active" : ""} href={item.href} key={item.href}><Icon size={17} /><span>{item.label}</span></Link>;
      })}
    </nav>
  );
}
