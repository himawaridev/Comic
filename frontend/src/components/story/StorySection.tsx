import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Story } from "@/lib/comic-data";
import PosterStoryCard from "./PosterStoryCard";

export default function StorySection({ title, stories, href, eyebrow, grid = false }: { title: string; stories: Story[]; href: string; eyebrow?: string; grid?: boolean }) {
  return (
    <section className="story-section">
      <header className="story-section__header">
        <div>{eyebrow ? <span>{eyebrow}</span> : null}<h2 className="comic-heading">{title}</h2></div>
        <Link href={href}>Xem them <ArrowRight size={15} /></Link>
      </header>
      <div className={grid ? "poster-grid" : "poster-rail"}>
        {stories.map((story) => <PosterStoryCard story={story} key={story.id} />)}
      </div>
    </section>
  );
}
