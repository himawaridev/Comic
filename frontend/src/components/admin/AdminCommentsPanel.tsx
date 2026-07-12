"use client";

import Link from "next/link";
import { MessageSquareText, Trash2 } from "lucide-react";
import { useState } from "react";

type ManagedComment = {
  id: string;
  content: string;
  isEdited: boolean;
  createdAt: string;
  userName: string;
  userEmail: string;
  storyTitle: string;
  storySlug: string;
};

export default function AdminCommentsPanel({ initialComments }: { initialComments: ManagedComment[] }) {
  const [comments, setComments] = useState(initialComments);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function removeComment(commentId: string) {
    setPendingId(commentId);
    try {
      const response = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Khong the xoa binh luan");
      setComments((current) => current.filter((comment) => comment.id !== commentId));
    } finally {
      setPendingId(null);
    }
  }

  if (!comments.length) return <div className="admin-empty"><MessageSquareText size={24} /><strong>Chua co binh luan</strong><span>Binh luan moi cua doc gia se xuat hien tai day.</span></div>;

  return (
    <div className="admin-data-list">
      {comments.map((comment) => (
        <article className="admin-comment-row" key={comment.id}>
          <span className="admin-row-icon"><MessageSquareText size={19} /></span>
          <div className="admin-row-copy">
            <div><strong>{comment.userName}</strong><span>{comment.userEmail}</span></div>
            <p>{comment.content}</p>
            <small><Link href={`/stories/${comment.storySlug}#comments`}>{comment.storyTitle}</Link> · {comment.createdAt}{comment.isEdited ? " · Da sua" : ""}</small>
          </div>
          <button className="icon-button admin-delete" type="button" disabled={pendingId === comment.id} onClick={() => removeComment(comment.id)} aria-label={`Xoa binh luan cua ${comment.userName}`} title="Xoa binh luan"><Trash2 size={17} /></button>
        </article>
      ))}
    </div>
  );
}
