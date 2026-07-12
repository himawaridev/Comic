"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Chapter, Story } from "@/lib/comic-data";
import ChapterRow from "./ChapterRow";
import EmptyState from "@/components/ui/EmptyState";

const PAGE_SIZE = 60;

export default function ChapterList({ story, chapters, initialTotal }: { story: Story; chapters: Chapter[]; initialTotal: number }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(chapters);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setItems(chapters);
      setTotal(initialTotal);
      setPage(1);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/stories/${story.slug}/chapters?page=1&limit=${PAGE_SIZE}&q=${encodeURIComponent(query.trim())}`, { signal: controller.signal });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Khong the tim chapter");
        setItems(payload.data.items || []);
        setTotal(Number(payload.data.total || 0));
        setPage(1);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setItems([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [chapters, initialTotal, query, story.slug]);

  async function loadMore() {
    setLoading(true);
    const nextPage = page + 1;
    try {
      const response = await fetch(`/api/stories/${story.slug}/chapters?page=${nextPage}&limit=${PAGE_SIZE}&q=${encodeURIComponent(query.trim())}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Khong the tai chapter");
      setItems((current) => [...current, ...(payload.data.items || [])]);
      setTotal(Number(payload.data.total || total));
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="chapter-section" id="chapters">
      <header className="chapter-section__header">
        <div><span>Thu vien noi dung</span><h2 className="comic-heading">Chapters</h2></div>
        <label className="chapter-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tim so hoac ten chuong" /></label>
      </header>
      <div className="chapter-grid">
        {items.map((chapter) => <ChapterRow story={story} chapter={chapter} key={chapter.id} />)}
      </div>
      {!loading && items.length === 0 ? <EmptyState title="Khong tim thay chapter" description="Thu tim bang so chuong hoac mot phan tieu de." /> : null}
      {items.length < total ? <button className="btn btn-outline chapter-more" type="button" disabled={loading} onClick={loadMore}>{loading ? "Dang tai..." : `Tai them ${Math.min(PAGE_SIZE, total - items.length)} chapter`}</button> : null}
    </section>
  );
}
