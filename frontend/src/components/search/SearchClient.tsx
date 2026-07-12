"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Story } from "@/lib/comic-data";
import LandscapeStoryCard from "@/components/story/LandscapeStoryCard";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";

export default function SearchClient({ initialStories, initialQuery = "" }: { initialStories: Story[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [stories, setStories] = useState(initialStories);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setStories(initialStories);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=30`, { signal: controller.signal })
        .then((response) => response.json())
        .then((payload) => setStories(payload.data?.items || []))
        .catch((error) => { if (error.name !== "AbortError") setStories([]); })
        .finally(() => setLoading(false));
    }, 350);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [initialStories, query]);

  return (
    <div className="search-experience">
      <header className="page-heading"><span>Kham pha kho truyen</span><h1 className="comic-heading">Search</h1><p>Tim theo ten truyen trong du lieu da crawl va luu tai database.</p></header>
      <label className="search-field"><Search size={22} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nhap ten truyen..." />{query ? <button type="button" onClick={() => setQuery("")} aria-label="Xoa tim kiem"><X size={18} /></button> : null}</label>
      <div className="search-result-heading"><h2 className="comic-heading">{query ? `Ket qua cho “${query}”` : "Dang pho bien"}</h2><span>{loading ? "Dang tim..." : `${stories.length} truyen`}</span></div>
      {loading ? <div className="search-skeletons">{Array.from({ length: 5 }).map((_, index) => <Skeleton className="search-skeleton" key={index} />)}</div> : null}
      {!loading ? <div className="search-results">{stories.map((story) => <LandscapeStoryCard story={story} key={story.id} />)}</div> : null}
      {!loading && stories.length === 0 ? <EmptyState title="Khong tim thay truyen" description="Thu rut gon tu khoa hoac tim mot ten khac." /> : null}
    </div>
  );
}
