import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Chapter, Story } from "@/lib/comic-data";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export default function ChapterRow({ story, chapter }: { story: Story; chapter: Chapter }) {
  return (
    <Link className="chapter-row" href={`/stories/${story.slug}/chapters/${chapter.slug}`}>
      <span className="chapter-row__thumb"><ImageWithFallback src={story.coverUrl} alt="" fill sizes="84px" /></span>
      <span className="chapter-row__copy">
        <small><BookOpen size={13} /> Chapter {chapter.chapterNumber || "-"}</small>
        <strong>{chapter.title.replace(/^ch(?:u|ư)(?:o|ơ)ng\s*\d+\s*:?\s*/i, "") || chapter.title}</strong>
        <em>{chapter.wordCount > 0 ? `${chapter.wordCount.toLocaleString("vi-VN")} tu` : "Mo de tai noi dung"}</em>
      </span>
      <ArrowUpRight className="chapter-row__arrow" size={19} />
    </Link>
  );
}
