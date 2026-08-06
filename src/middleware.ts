import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Canonical-host redirect. Vercel serves the app on per-deployment URLs
 * (hubcycle-apex-xxx…vercel.app) as well as the stable domain, but vercel.app
 * subdomains cannot share cookies (public-suffix rule), so a sign-in started
 * on one host can never complete on another. Every request on a non-canonical
 * host is redirected to the stable domain before anything else happens.
 */
const CANONICAL_HOST = "hubcycle-apex.vercel.app";

export function middleware(req: NextRequest) {
  const host = req.headers.get("host");
  if (process.env.VERCEL && host && host !== CANONICAL_HOST) {
    const url = req.nextUrl.clone();
    url.host = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  // Everything except static assets — auth routes included on purpose.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts/).*)"],
};
