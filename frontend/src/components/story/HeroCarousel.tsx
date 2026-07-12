import { Story } from "@/lib/comic-data";
import HeroStoryCarousel from "./HeroStoryCarousel";

export default function HeroCarousel({ stories }: { stories: Story[]; genres?: string[] }) {
  return <HeroStoryCarousel stories={stories} />;
}
