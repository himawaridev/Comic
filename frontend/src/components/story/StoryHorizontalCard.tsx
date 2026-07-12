import { Story } from "@/lib/comic-data";
import LandscapeStoryCard from "./LandscapeStoryCard";

export default function StoryHorizontalCard({ story }: { story: Story }) {
  return <LandscapeStoryCard story={story} />;
}
