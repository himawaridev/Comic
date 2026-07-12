"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, List, Settings2 } from "lucide-react";
import { CSSProperties, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Chapter, Story } from "@/lib/comic-data";
import ReaderSettingsPanel, { defaultReaderSettings, ReaderSettings } from "./ReaderSettingsPanel";

type ReaderStyle = CSSProperties & { "--reader-font-size": string; "--reader-line-height": number };

export default function ReaderClient({ story, chapter, previous, next, chapterTotal, authenticated }: { story: Story; chapter: Chapter; previous: Chapter | null; next: Chapter | null; chapterTotal: number; authenticated: boolean }) {
  const [settings, setSettings] = useState<ReaderSettings>(defaultReaderSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chapterMenuOpen, setChapterMenuOpen] = useState(false);
  const [jumpChapter, setJumpChapter] = useState(String(chapter.chapterNumber || 1));
  const [jumpError, setJumpError] = useState("");
  const [ready, setReady] = useState(false);
  const lastSavedAt = useRef(0);
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("reader-settings") || "null") as Partial<ReaderSettings> | null;
      if (saved) setSettings({ ...defaultReaderSettings, ...saved });
    } catch {
      localStorage.removeItem("reader-settings");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("reader-settings", JSON.stringify(settings));
  }, [ready, settings]);

  useEffect(() => {
    if (!authenticated) return;
    function calculateProgress() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / max) * 100))) : 0;
    }
    function saveProgress(force = false) {
      const now = Date.now();
      if (!force && now - lastSavedAt.current < 1500) return;
      lastSavedAt.current = now;
      fetch("/api/history", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chapterId: Number(chapter.id), progressPercent: calculateProgress() }), keepalive: force }).catch(() => undefined);
    }
    const onScroll = () => saveProgress(false);
    const onPageHide = () => saveProgress(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", onPageHide);
    saveProgress(true);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("pagehide", onPageHide); saveProgress(true); };
  }, [authenticated, chapter.id]);

  const style = useMemo<ReaderStyle>(() => ({ "--reader-font-size": `${settings.fontSize}px`, "--reader-line-height": settings.lineHeight }), [settings.fontSize, settings.lineHeight]);

  async function selectChapter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const chapterNumber = Number(jumpChapter);
    if (!chapterNumber || chapterNumber < 1 || chapterNumber > chapterTotal) return setJumpError(`Nhap so tu 1 den ${chapterTotal}`);
    const response = await fetch(`/api/stories/${story.slug}/chapters?chapterNumber=${chapterNumber}&limit=1`);
    const payload = await response.json().catch(() => ({}));
    const target = payload.data?.items?.[0];
    if (!response.ok || !target) return setJumpError("Khong tim thay chapter nay");
    setChapterMenuOpen(false);
    router.push(`/stories/${story.slug}/chapters/${target.slug}`);
  }

  return (
    <div className={`reader-page reader-theme-${settings.theme} reader-font-${settings.font} reader-width-${settings.width}`} style={style}>
      <header className="reader-toolbar">
        <Link className="reader-icon-button" href={`/stories/${story.slug}`} aria-label="Quay lai trang truyen"><ChevronLeft size={21} /></Link>
        <div className="reader-toolbar__title"><span>{story.title}</span><strong>{chapter.title}</strong></div>
        <div className="reader-toolbar__actions"><button className="reader-icon-button" type="button" onClick={() => setChapterMenuOpen((value) => !value)} aria-label="Danh sach chapter"><List size={20} /></button><button className="reader-icon-button" type="button" onClick={() => setSettingsOpen((value) => !value)} aria-label="Cai dat doc"><Settings2 size={20} /></button></div>
      </header>

      {chapterMenuOpen ? <div className="reader-chapter-menu"><form onSubmit={selectChapter}><label>Chuyen chapter<div><input type="number" min="1" max={chapterTotal} value={jumpChapter} onChange={(event) => { setJumpChapter(event.target.value); setJumpError(""); }} /><button type="submit">Di den</button></div></label>{jumpError ? <small>{jumpError}</small> : null}</form></div> : null}
      {settingsOpen ? <ReaderSettingsPanel settings={settings} onChange={setSettings} onClose={() => setSettingsOpen(false)} /> : null}

      <main className="reader-document">
        <header><Link href={`/stories/${story.slug}`}>{story.title}</Link><h1>{chapter.title}</h1><div><span>{chapter.wordCount.toLocaleString("vi-VN")} tu</span><span>Chapter {chapter.chapterNumber || 1} / {chapterTotal}</span></div></header>
        {chapter.contentHtml ? <article className="reader-content" dangerouslySetInnerHTML={{ __html: chapter.contentHtml }} /> : <article className="reader-content">{chapter.content.map((paragraph, index) => <p key={`${index}-${paragraph.slice(0, 32)}`}>{paragraph}</p>)}</article>}
        {!chapter.contentHtml && chapter.content.length === 0 ? <div className="reader-content-status">Noi dung chapter chua the tai tu nguon. Vui long thu lai sau.</div> : null}
      </main>

      <nav className="reader-navigation">
        {previous ? <Link href={`/stories/${story.slug}/chapters/${previous.slug}`}><ChevronLeft size={19} /><span>Chuong truoc<small>{previous.title}</small></span></Link> : <span />}
        {next ? <Link href={`/stories/${story.slug}/chapters/${next.slug}`}><span>Chuong tiep<small>{next.title}</small></span><ChevronRight size={19} /></Link> : null}
      </nav>
    </div>
  );
}
