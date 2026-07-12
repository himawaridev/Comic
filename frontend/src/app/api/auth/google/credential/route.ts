import { randomBytes } from "crypto";
import { z } from "zod";
import { hashPassword, publicUser, setSessionCookie } from "@/lib/auth";
import { verifyGoogleCredential } from "@/lib/google-auth";
import { fail, ok } from "@/lib/response";
import { User } from "@/models";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({ credential: z.string().min(100) });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  if (origin && origin !== requestOrigin) return fail("Invalid request origin", 403);

  try {
    const { credential } = schema.parse(await request.json());
    const payload = await verifyGoogleCredential(credential);
    if (!payload?.sub || !payload.email || !payload.email_verified) return fail("Google email chua duoc xac minh", 401);

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ where: { googleId: payload.sub } });
    if (!user) user = await User.findOne({ where: { email } });

    if (user) {
      await user.update({
        googleId: payload.sub,
        authProvider: user.authProvider === "local" ? "mixed" : "google",
        emailVerified: true,
        name: user.name || payload.name || email.split("@")[0],
        avatarUrl: user.avatarUrl || payload.picture || null,
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

    const sessionUser = publicUser(user);
    await setSessionCookie(sessionUser);
    return ok({ user: sessionUser });
  } catch {
    return fail("Khong the xac minh tai khoan Google", 401);
  }
}
