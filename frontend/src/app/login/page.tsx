import AuthForm from "@/components/auth/AuthForm";
import { googleClientId } from "@/lib/google-auth";
import { readSession, safeRedirectPath } from "@/lib/auth";
import { redirect } from "next/navigation";

const errorMessages: Record<string, string> = {
  google_not_configured: "Dang nhap Google chua duoc cau hinh tren may chu.",
  google_cancelled: "Ban da huy dang nhap Google.",
  google_state: "Phien dang nhap Google khong hop le. Vui long thu lai.",
  google_token: "Google khong tra ve thong tin dang nhap hop le.",
  google_email: "Tai khoan Google can co email da xac minh.",
  google_failed: "Khong the dang nhap Google luc nay. Vui long thu lai.",
  google_flow_updated: "Luong Google da duoc cap nhat. Vui long bam lai nut Google tren trang nay.",
};

export default async function LoginPage({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  const returnTo = safeRedirectPath(searchParams.next);
  if (await readSession()) redirect(returnTo);

  return <AuthForm mode="login" googleClientId={googleClientId()} returnTo={returnTo} initialError={errorMessages[searchParams.error || ""] || ""} />;
}
