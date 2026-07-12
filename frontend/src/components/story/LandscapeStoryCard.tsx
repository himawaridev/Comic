import Link from "next/link";
import { BookOpen, Star } from "lucide-react";
import { Story } from "@/lib/comic-data";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export default function LandscapeStoryCard({ story, rank }: { story: Story; rank?: number }) {
  return (
    <article className="landscape-card">
      <Link className="landscape-card__image" href={`/stories/${story.slug}`}>
        <ImageWithFallback src={story.coverUrl} alt={story.title} fill sizes="96px" />
        {rank ? <span className="landscape-card__rank">{String(rank).padStart(2, "0")}</span> : null}
      </Link>
      <div className="landscape-card__body">
        <span>{story.genres[0] || "Truyen chu"}</span>
        <Link href={`/stories/${story.slug}`}>{story.title}</Link>
        <div><small><Star size={13} fill="currentColor" /> {story.rating.toFixed(1)}</small><small><BookOpen size={13} /> {story.totalChapters}</small></div>
      </div>
    </article>
  );
}
