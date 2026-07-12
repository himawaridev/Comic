"use client";

import Link from "next/link";
import { LockKeyhole, MessageCircle, Send, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { CommentDto } from "@/services/comment.service";

type CurrentUser = { id: number; name: string; role: "user" | "admin" } | null;

export default function CommentsSection({ storySlug, initialComments, currentUser }: { storySlug: string; initialComments: CommentDto[]; currentUser: CurrentUser }) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const loginHref = `/login?next=${encodeURIComponent(`${pathname}#comments`)}`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser) return router.push(loginHref);
    setLoading(true);
    setError("");
    const response = await fetch(`/api/stories/${storySlug}/comments`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ content }) });
    const payload = await response.json().catch(() => ({}));
    setLoading(false);
    if (response.status === 401) return router.push(loginHref);
    if (!response.ok || !payload.data?.comment) return setError(payload.error || "Khong the gui binh luan");
    setComments((items) => [payload.data.comment, ...items]);
    setContent("");
  }

  async function remove(commentId: string) {
    const response = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
    if (response.ok) setComments((items) => items.filter((comment) => comment.id !== commentId));
  }

  return (
    <section className="comments-section" id="comments">
      <header className="comments-header"><div><span>Thao luan cung doc gia</span><h2 className="comic-heading">Binh luan</h2></div><strong><MessageCircle size={17} /> {comments.length}</strong></header>
      {currentUser ? (
        <form className="comment-composer" onSubmit={submit}>
          <span className="comment-avatar">{currentUser.name.slice(0, 1).toUpperCase()}</span>
          <label><textarea value={content} onChange={(event) => setContent(event.target.value)} minLength={2} maxLength={2000} required placeholder="Chia se cam nhan cua ban ve truyen..." /><small>{content.length}/2000</small></label>
          <button className="btn btn-accent" type="submit" disabled={loading || content.trim().length < 2}>{loading ? "Dang gui" : "Gui"}<Send size={16} /></button>
          {error ? <p className="form-error">{error}</p> : null}
        </form>
      ) : (
        <div className="comment-login"><LockKeyhole size={22} /><div><strong>Dang nhap de tham gia binh luan</strong><span>Tai khoan giup bao ve danh tinh va quan ly noi dung cua ban.</span></div><Link className="btn btn-accent" href={loginHref}>Dang nhap</Link></div>
      )}
      <div className="comment-list">
        {comments.map((comment) => {
          const canDelete = currentUser && (currentUser.id === comment.user.id || currentUser.role === "admin");
          return <article className="comment-card" key={comment.id}><span className="comment-avatar">{comment.user.name.slice(0, 1).toUpperCase()}</span><div><header><strong>{comment.user.name}{comment.user.role === "admin" ? <em>Admin</em> : null}</strong><span>{comment.createdLabel}{comment.isEdited ? " · da sua" : ""}</span></header><p>{comment.content}</p></div>{canDelete ? <button className="comment-delete" type="button" onClick={() => remove(comment.id)} aria-label="Xoa binh luan"><Trash2 size={16} /></button> : null}</article>;
        })}
        {comments.length === 0 ? <div className="comment-empty"><MessageCircle size={24} /><span>Chua co binh luan. Hay la nguoi dau tien chia se cam nhan.</span></div> : null}
      </div>
    </section>
  );
}
