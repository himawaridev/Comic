import AuthForm from "@/components/auth/AuthForm";
import { googleClientId } from "@/lib/google-auth";
import { readSession, safeRedirectPath } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage({ searchParams }: { searchParams: { next?: string } }) {
  const returnTo = safeRedirectPath(searchParams.next);
  if (await readSession()) redirect(returnTo);

  return <AuthForm mode="register" googleClientId={googleClientId()} returnTo={returnTo} />;
}
