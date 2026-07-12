import Link from "next/link";
import { Star } from "lucide-react";
import { Story } from "@/lib/comic-data";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import FavoriteButton from "./FavoriteButton";

export default function PosterStoryCard({ story, showFavorite = false }: { story: Story; showFavorite?: boolean }) {
  return (
    <article className="poster-card">
      <Link className="poster-card__image" href={`/stories/${story.slug}`} aria-label={story.title}>
        <ImageWithFallback src={story.coverUrl} alt={story.title} fill sizes="(max-width: 768px) 35vw, 180px" />
        <span className="poster-card__chapter">{story.latestChapter}</span>
      </Link>
      {showFavorite ? <span className="poster-card__favorite"><FavoriteButton storyId={story.id} /></span> : null}
      <Link className="poster-card__title" href={`/stories/${story.slug}`}>{story.title}</Link>
      <div className="poster-card__meta"><span><Star size={13} fill="currentColor" /> {story.rating.toFixed(1)}</span><span>{story.totalChapters} chuong</span></div>
    </article>
  );
}
