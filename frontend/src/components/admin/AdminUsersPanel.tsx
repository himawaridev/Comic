"use client";

import { CheckCircle2, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";

type ManagedUser = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  authProvider: "local" | "google" | "mixed";
  emailVerified: boolean;
  createdAt: string;
};

export default function AdminUsersPanel({ initialUsers, currentUserId }: { initialUsers: ManagedUser[]; currentUserId: number }) {
  const [users, setUsers] = useState(initialUsers);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function changeRole(userId: number, role: "user" | "admin") {
    setPendingId(userId);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Khong the cap nhat role");
      setUsers((current) => current.map((user) => user.id === userId ? { ...user, role } : user));
      setMessage("Da cap nhat quyen tai khoan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Khong the cap nhat role");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="admin-data-list">
      {users.map((user) => (
        <article className="admin-user-row" key={user.id}>
          <span className={user.role === "admin" ? "admin-row-icon is-admin" : "admin-row-icon"}>{user.role === "admin" ? <ShieldCheck size={19} /> : <UserRound size={19} />}</span>
          <div className="admin-row-copy">
            <strong>{user.name}{user.id === currentUserId ? " (ban)" : ""}</strong>
            <span>{user.email}</span>
            <small>{user.authProvider === "mixed" ? "Email + Google" : user.authProvider === "google" ? "Google" : "Email"} · {user.emailVerified ? "Da xac minh" : "Chua xac minh"} · {user.createdAt}</small>
          </div>
          <label className="admin-role-control">
            <span>Role</span>
            <select value={user.role} disabled={user.id === currentUserId || pendingId === user.id} onChange={(event) => changeRole(user.id, event.target.value as "user" | "admin")}>
              <option value="user">Doc gia</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </article>
      ))}
      <p className="admin-feedback" aria-live="polite">{message ? <><CheckCircle2 size={15} /> {message}</> : null}</p>
    </div>
  );
}
