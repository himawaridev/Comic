"use client";

import { useState } from "react";
import { Story } from "@/lib/comic-data";
import PosterStoryCard from "./PosterStoryCard";
import EmptyState from "@/components/ui/EmptyState";

export default function FavoriteCollection({ initialStories }: { initialStories: Story[] }) {
  const [stories, setStories] = useState(initialStories);
  const [message, setMessage] = useState("");

  async function remove(storyId: string) {
    const response = await fetch(`/api/favorites/${storyId}`, { method: "DELETE" });
    if (!response.ok) return setMessage("Khong the bo yeu thich luc nay");
    setStories((items) => items.filter((story) => story.id !== storyId));
    setMessage("Da xoa khoi danh sach yeu thich");
  }

  if (!stories.length) return <EmptyState title="Chua co truyen yeu thich" description="Bam nut tim tren card hoac trang chi tiet de luu truyen vao day." />;
  return (
    <>
      {message ? <div className="toast-message">{message}</div> : null}
      <div className="favorite-grid">{stories.map((story) => <div className="favorite-item" key={story.id}><PosterStoryCard story={story} /><button type="button" onClick={() => remove(story.id)}>Bo yeu thich</button></div>)}</div>
    </>
  );
}
