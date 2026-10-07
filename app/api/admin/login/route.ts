import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  checkAdminPassword,
  isAdminConfigured,
  sessionCookieValue
} from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not set on the server" },
      { status: 500 }
    );
  }

  const form = await req.formData();
  const password = String(form.get("password") || "");
  const next = String(form.get("next") || "/admin");

  const ok = await checkAdminPassword(password);
  if (!ok) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("error", "1");
    url.searchParams.set("next", next);
    return NextResponse.redirect(url, { status: 303 });
  }

  const value = await sessionCookieValue();
  const res = NextResponse.redirect(new URL(next, req.url), { status: 303 });
  res.cookies.set(ADMIN_SESSION_COOKIE, value!, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return res;
}
