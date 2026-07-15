import { createHash } from "crypto";
import { cookies } from "next/headers";

/**
 * Access control: full results are restricted to Hubcycle admins
 * (HR + hiring managers). Admins authenticate with a shared access code
 * (ADMIN_ACCESS_CODE env var). Assessment-takers only ever see their own
 * digest, via their private invitation token.
 */

const COOKIE = "apex_session";

export function accessCode(): string {
  return process.env.ADMIN_ACCESS_CODE || "apex-hubcycle-2026";
}

export function sessionValue(): string {
  return createHash("sha256").update(`apex:${accessCode()}`).digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE)?.value === sessionValue();
}

export async function login(code: string): Promise<boolean> {
  if (code !== accessCode()) return false;
  const store = await cookies();
  store.set(COOKIE, sessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 14,
    path: "/",
  });
  return true;
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
