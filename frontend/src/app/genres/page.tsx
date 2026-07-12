import Link from "next/link";
import SectionHeader from "@/components/story/SectionHeader";
import { LibraryBig } from "lucide-react";
import { listGenresWithCounts } from "@/services/genre.service";

export const dynamic = "force-dynamic";

export default async function GenresPage() {
  let genres: { name: string; slug: string; storyCount: number }[] = [];
  try {
    genres = await listGenresWithCounts();
  } catch {
    genres = [];
  }

  return (
    <div className="screen-shell">
      <div className="app-container genres-page">
        <SectionHeader eyebrow="Library" title="The loai truyen" />
        <div className="genre-grid">
          {genres.map((genre) => (
            <Link className="genre-card" href={`/genres/${genre.slug}`} key={genre.slug}>
              <LibraryBig size={22} /><span><strong>{genre.name}</strong><small>{genre.storyCount} truyen</small></span>
            </Link>
          ))}
          {genres.length === 0 ? <span className="pill">Chua co genre trong DB</span> : null}
        </div>
      </div>
    </div>
  );
}
