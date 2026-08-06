#!/usr/bin/env node
import { execSync } from "node:child_process";

/**
 * Hardened `prisma migrate deploy` for Vercel builds.
 * - Skips on preview builds: branch + main are pushed together, and two
 *   concurrent `migrate deploy` runs against the same Neon database fight
 *   over Prisma's advisory lock. Production (and local) builds migrate.
 * - Prefers Neon's UNPOOLED connection string: Prisma migrate does not work
 *   reliably through pgbouncer (the pooled DATABASE_URL).
 * - Baselines automatically on P3005 (schema exists but no _prisma_migrations
 *   table — the initial schema was pushed outside of migrate).
 * - Retries once on transient/lock errors before failing the build.
 */

const env = process.env.VERCEL_ENV; // "production" | "preview" | "development" | undefined
if (env && env !== "production") {
  console.log(`[migrate] VERCEL_ENV=${env} — skipping migrations (production builds migrate).`);
  process.exit(0);
}

const url =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DIRECT_DATABASE_URL ||
  process.env.DATABASE_URL;

if (!url) {
  console.log("[migrate] No database URL in env — skipping (app will use KV/file/memory backend).");
  process.exit(0);
}
console.log(
  `[migrate] Using ${
    process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL_NON_POOLING
      ? "unpooled"
      : "default"
  } connection string.`
);

function run(cmd) {
  return execSync(cmd, {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, DATABASE_URL: url },
    encoding: "utf8",
  });
}

function deploy() {
  const out = run("npx prisma migrate deploy");
  process.stdout.write(out);
}

try {
  deploy();
  console.log("[migrate] Done.");
} catch (err) {
  const msg = `${err.stdout ?? ""}${err.stderr ?? ""}${err.message ?? ""}`;
  process.stdout.write(msg);
  if (msg.includes("P3005")) {
    // Schema exists but migrate has no history: baseline the init migration, retry.
    console.log("[migrate] P3005 — baselining initial migration, then retrying.");
    process.stdout.write(run("npx prisma migrate resolve --applied 20260806024441_init"));
    deploy();
    console.log("[migrate] Done after baseline.");
  } else {
    console.log("[migrate] First attempt failed — retrying once in 10s (transient/lock errors).");
    await new Promise((r) => setTimeout(r, 10000));
    try {
      deploy();
      console.log("[migrate] Done on retry.");
    } catch (err2) {
      process.stdout.write(`${err2.stdout ?? ""}${err2.stderr ?? ""}${err2.message ?? ""}`);
      console.error("[migrate] Migrations failed — failing the build to protect the database.");
      process.exit(1);
    }
  }
}
