import { OAuth2Client } from "google-auth-library";

export function isGoogleAuthConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID);
}

export function googleClientId() {
  return process.env.GOOGLE_CLIENT_ID || "";
}

export function googleRedirectUri(origin?: string) {
  return process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || origin || "http://localhost:3000"}/api/auth/google/callback`;
}

export function createGoogleClient(origin?: string) {
  return new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: googleRedirectUri(origin),
  });
}

export async function verifyGoogleCredential(credential: string) {
  if (!credential || !process.env.GOOGLE_CLIENT_ID) throw new Error("Google credential is not configured");
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
  return ticket.getPayload();
}
