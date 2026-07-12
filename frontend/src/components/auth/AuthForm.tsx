"use client";

import Link from "next/link";
import { ArrowRight, Chrome, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { FormEvent, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default function AuthForm({
  mode,
  googleClientId,
  returnTo = "/profile",
  initialError = "",
}: {
  mode: "login" | "register";
  googleClientId: string;
  returnTo?: string;
  initialError?: string;
}) {
  const isLogin = mode === "login";
  const router = useRouter();
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const setGoogleError = useCallback((message: string) => setError(message), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };
    if (!/^\S+@\S+\.\S+$/.test(payload.email)) {
      setLoading(false);
      setError("Email khong hop le");
      return;
    }
    if (payload.password.length < 8) {
      setLoading(false);
      setError("Mat khau can it nhat 8 ky tu");
      return;
    }
    if (!isLogin && payload.name.trim().length < 2) {
      setLoading(false);
      setError("Ten hien thi can it nhat 2 ky tu");
      return;
    }
    const response = await fetch(`/api/auth/${isLogin ? "login" : "register"}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Khong the dang nhap");
      return;
    }
    router.push(returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/profile");
    router.refresh();
  }

  return (
    <section className="auth-page app-container">
      <div className="auth-card soft-card">
        <div className="auth-heading">
          <span className="auth-heading__icon"><ShieldCheck size={22} /></span>
          <span className="pill is-active">{isLogin ? "Chao mung tro lai" : "Tai khoan moi"}</span>
          <h1>{isLogin ? "Dang nhap" : "Dang ky"}</h1>
          <p>{isLogin ? "Dang nhap de yeu thich, danh gia, binh luan va dong bo tien do doc." : "Tao tai khoan de tham gia cong dong va luu thu vien truyen cua ban."}</p>
        </div>

        {googleClientId ? (
          <GoogleSignInButton clientId={googleClientId} returnTo={returnTo} onError={setGoogleError} />
        ) : (
          <button className="google-auth-button" type="button" disabled title="Can cau hinh GOOGLE_CLIENT_ID"><Chrome size={20} /><span>Google chua duoc cau hinh</span></button>
        )}
        <div className="auth-divider"><span>hoac dung email</span></div>

        <form className="auth-form" onSubmit={submit}>
          {!isLogin ? (
            <label>
              <UserRound size={18} />
              <input name="name" placeholder="Ten hien thi" required minLength={2} autoComplete="name" />
            </label>
          ) : null}
          <label>
            <Mail size={18} />
            <input name="email" placeholder="Email" type="email" required autoComplete="email" />
          </label>
          <label>
            <Lock size={18} />
            <input name="password" placeholder="Mat khau" type="password" required minLength={8} autoComplete={isLogin ? "current-password" : "new-password"} />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="btn btn-accent" type="submit" disabled={loading}>
            {loading ? "Dang xu ly..." : isLogin ? "Dang nhap" : "Tao tai khoan"}<ArrowRight size={17} />
          </button>
        </form>
        <p className="auth-switch">
          {isLogin ? "Chua co tai khoan?" : "Da co tai khoan?"}{" "}
          <Link href={`${isLogin ? "/register" : "/login"}?next=${encodeURIComponent(returnTo)}`}>{isLogin ? "Dang ky ngay" : "Dang nhap"}</Link>
        </p>
      </div>
    </section>
  );
}
