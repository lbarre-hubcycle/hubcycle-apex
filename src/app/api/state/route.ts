import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { loadDb, storageMode } from "@/lib/storage";

/** Full state — admin only. Only admins can see profiles other than their own. */
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const db = await loadDb();
  return NextResponse.json({ db, storageMode: storageMode() });
}
