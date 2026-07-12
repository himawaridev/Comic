"use client";

import { Play, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";

type SourceCategory = { key: string; name: string; path: string };

export default function CrawlerPanel() {
  const [log, setLog] = useState("San sang chay crawler.");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<SourceCategory[]>([]);
  const [categoryKey, setCategoryKey] = useState("");
  const [storyUrl, setStoryUrl] = useState("");
  const [pages, setPages] = useState(1);
  const [storyLimit, setStoryLimit] = useState(0);
  const [crawlContent, setCrawlContent] = useState(false);
  const [maxChapters, setMaxChapters] = useState(0);
  const selectedCategory = useMemo(() => categories.find((item) => item.key === categoryKey), [categories, categoryKey]);

  useEffect(() => {
    fetch("/api/admin/crawler/run")
      .then((response) => response.json())
      .then((payload) => {
        const items = (payload?.data?.categories || []) as SourceCategory[];
        setCategories(items);
        setCategoryKey(items[0]?.key || "");
      })
      .catch(() => setLog("Khong the tai danh sach the loai tu nguon."));
  }, []);

  async function runCrawler(mode: "category" | "story" | "catalog") {
    setLoading(true);
    setLog(mode === "catalog" ? "Dang dong bo catalog cua tat ca the loai. Tac vu co the mat nhieu phut..." : "Dang crawl va upsert du lieu vao PostgreSQL...");
    const body = mode === "story"
      ? { storyUrl: storyUrl.trim(), crawlContent, maxChapters }
      : mode === "category"
        ? { categoryKey: selectedCategory?.key, categoryName: selectedCategory?.name, categoryPath: selectedCategory?.path, pages, limit: storyLimit, crawlContent, maxChapters }
        : { mode: "catalog", pages: 0, limit: 0 };
    try {
      const response = await fetch("/api/admin/crawler/run", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const payload = await response.json().catch(() => ({}));
      setLog(JSON.stringify(payload, null, 2));
    } catch (error) {
      setLog(error instanceof Error ? error.message : "Crawler khong phan hoi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen-shell">
      <section className="app-container admin-shell">
        <AdminNav />
        <header className="admin-heading"><span>Du lieu</span><h1>Crawler console</h1><p>Nap truyen va chapter moi vao PostgreSQL tu nguon da cau hinh.</p></header>
        <div className="admin-page soft-card">
          <div className="crawler-form">
            <label>Danh muc<select value={categoryKey} onChange={(event) => setCategoryKey(event.target.value)}>{categories.map((category) => <option value={category.key} key={category.key}>{category.name}</option>)}</select></label>
            <label>So trang danh muc<input type="number" min="0" max="100" value={pages} onChange={(event) => setPages(Number(event.target.value))} /><small>0 = tat ca trang</small></label>
            <label>Gioi han truyen moi trang<input type="number" min="0" max="100" value={storyLimit} onChange={(event) => setStoryLimit(Number(event.target.value))} /><small>0 = tat ca truyen</small></label>
            <label>So chapter tai noi dung<input type="number" min="0" max="20000" value={maxChapters} onChange={(event) => setMaxChapters(Number(event.target.value))} /><small>0 = tat ca chapter khi bat tai noi dung</small></label>
            <label className="crawler-toggle"><input type="checkbox" checked={crawlContent} onChange={(event) => setCrawlContent(event.target.checked)} /><span>Tai ca noi dung chapter</span></label>
            <label className="crawler-form__url">URL truyen<input value={storyUrl} onChange={(event) => setStoryUrl(event.target.value)} placeholder="https://truyenhoan.com/..." /></label>
          </div>
          <div className="admin-actions">
            <button className="btn btn-accent" type="button" disabled={loading || !selectedCategory} onClick={() => runCrawler("category")}><Play size={17} /> Dong bo the loai</button>
            <button className="btn btn-outline" type="button" disabled={loading || !storyUrl.trim()} onClick={() => runCrawler("story")}><Play size={17} /> Crawl URL</button>
            <button className="btn btn-outline" type="button" disabled={loading} onClick={() => runCrawler("catalog")}><RefreshCw size={17} /> Dong bo toan bo catalog</button>
          </div>
          <pre className="crawler-log" aria-live="polite">{log}</pre>
        </div>
      </section>
    </div>
  );
}
