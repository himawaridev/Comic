"use client";

import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { Story } from "@/lib/comic-data";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import EmptyState from "@/components/ui/EmptyState";

export type HistoryEntry = { story: Story; chapterSlug: string; chapterTitle: string; progressPercent: number; lastReadAt: string };

export default function HistoryCollection({ initialEntries }: { initialEntries: HistoryEntry[] }) {
  const [entries, setEntries] = useState(initialEntries);

  async function remove(storyId: string) {
    const response = await fetch(`/api/history/${storyId}`, { method: "DELETE" });
    if (response.ok) setEntries((items) => items.filter((entry) => entry.story.id !== storyId));
  }

  if (!entries.length) return <EmptyState title="Chua co lich su doc" description="Tien do se tu dong xuat hien sau khi ban mo mot chapter." />;
  return (
    <div className="history-list">
      {entries.map((entry) => (
        <article className="history-card" key={entry.story.id}>
          <Link className="history-card__cover" href={`/stories/${entry.story.slug}/chapters/${entry.chapterSlug}`}><ImageWithFallback src={entry.story.coverUrl} alt={entry.story.title} fill sizes="120px" /></Link>
          <div className="history-card__copy"><span>{entry.story.genres[0] || "Truyen chu"}</span><h2>{entry.story.title}</h2><p>{entry.chapterTitle}</p><div className="progress-track"><span style={{ width: `${Math.max(2, entry.progressPercent)}%` }} /></div><small>{Math.round(entry.progressPercent)}% · {new Date(entry.lastReadAt).toLocaleDateString("vi-VN")}</small></div>
          <div className="history-card__actions"><button className="icon-button" type="button" onClick={() => remove(entry.story.id)} aria-label="Xoa lich su"><Trash2 size={18} /></button><Link className="btn btn-accent" href={`/stories/${entry.story.slug}/chapters/${entry.chapterSlug}`}>Doc tiep <ArrowRight size={17} /></Link></div>
        </article>
      ))}
    </div>
  );
}
