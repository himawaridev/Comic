import SearchClient from "@/components/search/SearchClient";
import { getStories, searchStories } from "@/lib/comic-data";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q?.trim() || "";
  const stories = query ? await searchStories(query, 30) : await getStories("hot", 20);
  return <div className="screen-shell"><div className="app-container"><SearchClient initialStories={stories} initialQuery={query} /></div></div>;
}
