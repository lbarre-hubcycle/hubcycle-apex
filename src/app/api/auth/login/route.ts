import { NextResponse } from "next/server";
import { login } from "@/lib/auth";

export async function POST(req: Request) {
  const { code } = (await req.json()) as { code?: string };
  const ok = await login(code ?? "");
  if (!ok) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true });
}
