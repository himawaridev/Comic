"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

let favoriteCache: Promise<Set<string> | null> | null = null;

function loadFavorites() {
  if (!favoriteCache) {
    favoriteCache = fetch("/api/favorites")
      .then(async (response) => {
        if (response.status === 401) return null;
        if (!response.ok) throw new Error("Cannot load favorites");
        const payload = await response.json();
        return new Set<string>((payload.data?.items || []).map((story: { id: string }) => String(story.id)));
      })
      .catch(() => null);
  }
  return favoriteCache;
}

export default function FavoriteButton({ storyId, initialFavorite, className = "favorite-button" }: { storyId: string; initialFavorite?: boolean; className?: string }) {
  const [favorite, setFavorite] = useState(Boolean(initialFavorite));
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof initialFavorite === "boolean") return;
    loadFavorites().then((items) => items && setFavorite(items.has(storyId)));
  }, [initialFavorite, storyId]);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    const response = await fetch(favorite ? `/api/favorites/${storyId}` : "/api/favorites", {
      method: favorite ? "DELETE" : "POST",
      headers: { "content-type": "application/json" },
      body: favorite ? undefined : JSON.stringify({ storyId: Number(storyId) }),
    });
    setLoading(false);
    if (response.status === 401) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!response.ok) return;
    setFavorite((value) => !value);
    favoriteCache = null;
    router.refresh();
  }

  return (
    <button className={`${className} ${favorite ? "is-active" : ""}`} type="button" onClick={toggle} disabled={loading} aria-label={favorite ? "Bo yeu thich" : "Them vao yeu thich"}>
      <Heart size={20} fill={favorite ? "currentColor" : "none"} />
    </button>
  );
}
