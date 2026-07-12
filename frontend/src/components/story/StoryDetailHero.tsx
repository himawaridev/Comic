"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronRight, Eye, LockKeyhole, Share2, Star } from "lucide-react";
import { useState } from "react";
import { Chapter, Story } from "@/lib/comic-data";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import FavoriteButton from "./FavoriteButton";

export default function StoryDetailHero({
  story,
  chapters,
  continueChapterSlug,
  initialFavorite = false,
  initialRating = 0,
  authenticated = false,
}: {
  story: Story;
  chapters: Chapter[];
  continueChapterSlug?: string | null;
  initialFavorite?: boolean;
  initialRating?: number;
  authenticated?: boolean;
}) {
  const [rating, setRating] = useState(initialRating);
  const [ratingAvg, setRatingAvg] = useState(story.rating);
  const [ratingCount, setRatingCount] = useState(story.ratingCount);
  const [message, setMessage] = useState("");
  const firstChapter = chapters[0];
  const targetSlug = continueChapterSlug || firstChapter?.slug;

  async function rate(value: number) {
    if (!authenticated) {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    const response = await fetch("/api/rating", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ storyId: Number(story.id), value }),
    });
    if (response.status === 401) {
      window.location.href = "/login";
      return;
    }
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(payload.error || "Khong the danh gia");
      return;
    }
    setRating(value);
    setRatingAvg(Number(payload.data?.ratingAvg || ratingAvg));
    setRatingCount(Number(payload.data?.ratingCount || ratingCount));
    setMessage("Da luu danh gia cua ban");
  }

  async function share() {
    if (navigator.share) await navigator.share({ title: story.title, url: window.location.href }).catch(() => undefined);
    else await navigator.clipboard.writeText(window.location.href).then(() => setMessage("Da sao chep lien ket"));
  }

  return (
    <section className="detail-hero">
      <div className="detail-hero__media">
        <ImageWithFallback className="detail-hero__backdrop" src={story.coverUrl} alt="" fill priority sizes="(max-width: 768px) 100vw, 720px" />
        <span className="detail-hero__shade" />
        <div className="detail-hero__actions app-container">
          <Link className="round-action" href="/" aria-label="Quay lai"><ArrowLeft size={20} /></Link>
          <div><FavoriteButton storyId={story.id} initialFavorite={initialFavorite} className="round-action" /><button className="round-action" type="button" onClick={share} aria-label="Chia se"><Share2 size={20} /></button></div>
        </div>
        <div className="detail-hero__poster"><ImageWithFallback src={story.coverUrl} alt={story.title} fill priority sizes="(max-width: 768px) 42vw, 230px" /></div>
      </div>

      <div className="detail-floating app-container">
        <div className="detail-summary comic-card">
          <span className="detail-summary__genre">{story.genres.slice(0, 2).join(" / ") || "Truyen chu"}</span>
          <h1 className="comic-heading">{story.title}</h1>
          <div className="detail-summary__metrics">
            <span><Star size={17} fill="currentColor" /><strong>{ratingAvg.toFixed(1)}</strong><small>{ratingCount} danh gia</small></span>
            <span><Eye size={17} /><strong>{story.viewCount.toLocaleString("vi-VN")}</strong><small>luot xem</small></span>
            <span><BookOpen size={17} /><strong>{story.totalChapters}</strong><small>chapter</small></span>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-main-copy">
            <div className="detail-author"><span>Tac gia</span><strong>{story.author}</strong></div>
            <h2 className="comic-heading">Synopsis</h2>
            <p>{story.description || "Truyen chua co phan gioi thieu trong du lieu nguon."}</p>
            <div className="rating-control" aria-label="Danh gia truyen">
              <span>Danh gia cua ban</span>
              <div>{[2, 4, 6, 8, 10].map((value) => <button type="button" onClick={() => rate(value)} className={rating >= value ? "is-active" : ""} key={value} aria-label={`${value} diem`}><Star size={21} fill={rating >= value ? "currentColor" : "none"} /></button>)}</div>
              {message ? <small>{message}</small> : null}
              {!authenticated ? <Link href={`/login?next=${encodeURIComponent(`/stories/${story.slug}`)}`} className="rating-login-note"><LockKeyhole size={14} /> Dang nhap de danh gia</Link> : null}
            </div>
          </div>

          <aside className="detail-cta-panel">
            <span>{continueChapterSlug ? "Tiep tuc hanh trinh" : "Bat dau doc"}</span>
            <strong>{continueChapterSlug ? "Chuong dang doc" : firstChapter?.title || "Chua co chapter"}</strong>
            {targetSlug ? <Link className="btn btn-accent" href={`/stories/${story.slug}/chapters/${targetSlug}`}>{continueChapterSlug ? "Doc tiep" : "Doc ngay"}<ChevronRight size={19} /></Link> : null}
          </aside>
        </div>
      </div>
    </section>
  );
}
