import { Story } from "@/lib/comic-data";
import StoryCard from "./StoryCard";

export default function StoryGrid({ stories }: { stories: Story[] }) {
  return (
    <div className="poster-grid">
      {stories.map((story) => (
        <StoryCard story={story} key={story.id} />
      ))}
    </div>
  );
}
