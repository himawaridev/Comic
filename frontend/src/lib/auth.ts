import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { User } from "@/models";

const cookieName = "truyen_session";
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "change_me");

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  avatarUrl?: string | null;
  authProvider?: "local" | "google" | "mixed";
  emailVerified?: boolean;
};

export function safeRedirectPath(value?: string | null, fallback = "/profile") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

function shouldUseSecureCookies() {
  return (process.env.NEXT_PUBLIC_APP_URL || "").startsWith("https://");
}

export function transientCookieOptions(maxAge = 10 * 60) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: shouldUseSecureCookies(),
    path: "/",
    maxAge,
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createToken(user: SessionUser) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function readSession(): Promise<SessionUser | null> {
  const token = cookies().get(cookieName)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as SessionUser;
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser) {
  const token = await createToken(user);
  cookies().set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookies(),
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie() {
  cookies().delete(cookieName);
}

export function publicUser(user: InstanceType<typeof User>): SessionUser {
  const raw = user.get({ plain: true }) as SessionUser;
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role,
    avatarUrl: raw.avatarUrl,
    authProvider: raw.authProvider,
    emailVerified: raw.emailVerified,
  };
}
