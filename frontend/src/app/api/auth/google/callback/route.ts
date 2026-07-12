import { randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hashPassword, publicUser, safeRedirectPath, setSessionCookie } from "@/lib/auth";
import { createGoogleClient, googleRedirectUri, isGoogleAuthConfigured } from "@/lib/google-auth";
import { User } from "@/models";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function stateMatches(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

function loginError(origin: string, code: string, returnTo: string) {
  return NextResponse.redirect(new URL(`/login?error=${code}&next=${encodeURIComponent(returnTo)}`, origin));
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const cookieStore = cookies();
  const expectedState = cookieStore.get("truyen_google_state")?.value || "";
  const returnTo = safeRedirectPath(cookieStore.get("truyen_google_return")?.value, "/profile");
  cookieStore.delete("truyen_google_state");
  cookieStore.delete("truyen_google_return");

  if (!isGoogleAuthConfigured()) return loginError(requestUrl.origin, "google_not_configured", returnTo);
  if (requestUrl.searchParams.get("error")) return loginError(requestUrl.origin, "google_cancelled", returnTo);

  const code = requestUrl.searchParams.get("code") || "";
  const state = requestUrl.searchParams.get("state") || "";
  if (!code || !expectedState || !stateMatches(state, expectedState)) return loginError(requestUrl.origin, "google_state", returnTo);

  try {
    const client = createGoogleClient(requestUrl.origin);
    const { tokens } = await client.getToken({ code, redirect_uri: googleRedirectUri(requestUrl.origin) });
    if (!tokens.id_token) return loginError(requestUrl.origin, "google_token", returnTo);
    const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email || !payload.email_verified) return loginError(requestUrl.origin, "google_email", returnTo);

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ where: { googleId: payload.sub } });
    if (!user) user = await User.findOne({ where: { email } });

    if (user) {
      await user.update({
        googleId: payload.sub,
        authProvider: user.getDataValue("authProvider") === "local" ? "mixed" : "google",
        emailVerified: true,
        name: user.getDataValue("name") || payload.name || email.split("@")[0],
        avatarUrl: user.getDataValue("avatarUrl") || payload.picture || null,
      });
    } else {
      user = await User.create({
        name: payload.name || email.split("@")[0],
        email,
        passwordHash: await hashPassword(randomBytes(48).toString("base64url")),
        avatarUrl: payload.picture || null,
        role: "user",
        authProvider: "google",
        googleId: payload.sub,
        emailVerified: true,
      });
    }

    await setSessionCookie(publicUser(user));
    return NextResponse.redirect(new URL(returnTo, requestUrl.origin));
  } catch (error) {
    console.error("Google OAuth callback failed", error);
    return loginError(requestUrl.origin, "google_failed", returnTo);
  }
}
