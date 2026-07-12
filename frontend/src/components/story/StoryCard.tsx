import { Story } from "@/lib/comic-data";
import PosterStoryCard from "./PosterStoryCard";

export default function StoryCard({ story }: { story: Story }) {
  return <PosterStoryCard story={story} showFavorite />;
}
