import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "auth-session";
const MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must be set and at least 32 characters (e.g. run: openssl rand -base64 32)"
    );
  }
  return new TextEncoder().encode(secret);
}

export type SessionUser = { id: string; email: string };

export async function createSession(user: SessionUser): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(now + MAX_AGE)
    .setIssuedAt(now)
    .sign(getSecret());
  return token;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  console.log("[auth/session] getSession:", { hasToken: !!token, tokenLength: token?.length ?? 0 });
  return verifySessionToken(token ?? "");
}

/** Verify a session token string (e.g. from middleware). Returns user or null. */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const sub = payload.sub;
    const email = payload.email;
    if (typeof sub !== "string" || typeof email !== "string") return null;
    return { id: sub, email };
  } catch (err) {
    console.log("[auth/session] JWT verify failed:", err instanceof Error ? err.message : "unknown");
    return null;
  }
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}

export function getSessionCookieOptions(maxAge: number = MAX_AGE) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge,
    path: "/",
  };
}
