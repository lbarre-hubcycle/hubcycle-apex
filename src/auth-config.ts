import { createHash } from "crypto";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

/**
 * SSO: Google Workspace accounts on the Hubcycle domain only.
 * - Production: Google OAuth (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET on Vercel).
 * - Local development: set AUTH_DEV_MODE=true to enable a passwordless
 *   email-only provider (never enabled in production builds on Vercel).
 * The legacy ADMIN_ACCESS_CODE login remains available as a break-glass
 * path handled outside NextAuth (see lib/auth.ts).
 */

export const ALLOWED_DOMAIN = process.env.SSO_ALLOWED_DOMAIN || "hubcycled.com";

// Google only accepts the redirect URI registered for the stable domain.
// Vercel serves the app on per-deployment URLs too (hubcycle-apex-xxx…);
// pin AUTH_URL so the OAuth callback always goes through the canonical host,
// wherever the user started from. An explicit AUTH_URL env var still wins.
if (process.env.VERCEL && !process.env.AUTH_URL) {
  process.env.AUTH_URL = "https://hubcycle-apex.vercel.app";
}

export function ssoConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

const devMode = process.env.AUTH_DEV_MODE === "true" && !process.env.VERCEL;

const providers = [];

if (ssoConfigured()) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: { hd: ALLOWED_DOMAIN, prompt: "select_account" },
      },
    })
  );
}

if (devMode) {
  providers.push(
    Credentials({
      id: "dev",
      name: "Dev login",
      credentials: { email: { label: "Email" } },
      authorize(credentials) {
        const email = String(credentials?.email ?? "").toLowerCase();
        if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) return null;
        return { id: email, email, name: email.split("@")[0] };
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  secret:
    process.env.AUTH_SECRET ||
    createHash("sha256").update(`apex-auth:${process.env.ADMIN_ACCESS_CODE ?? "dev"}`).digest("hex"),
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin" },
  callbacks: {
    signIn({ user, profile }) {
      const email = (user.email ?? profile?.email ?? "").toLowerCase();
      // The `hd` param filters the Google account picker, but the domain must
      // be enforced server-side too.
      return email.endsWith(`@${ALLOWED_DOMAIN}`);
    },
  },
});
