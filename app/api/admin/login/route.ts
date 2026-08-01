import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  checkLoginRateLimit,
  createAdminSessionToken,
  verifyAdminPassword,
} from "@/lib/admin-auth";

function wantsHtml(request: NextRequest): boolean {
  const accept = request.headers.get("accept") ?? "";
  const contentType = request.headers.get("content-type") ?? "";
  return (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data") ||
    accept.includes("text/html")
  );
}

function configError(): string | null {
  if (!process.env.ADMIN_PASSWORD?.trim()) {
    return "Admin não configurado: defina ADMIN_PASSWORD na Vercel (Environment Variables) e faça Redeploy.";
  }
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() ?? "";
  if (!secret) {
    return "Admin não configurado: defina ADMIN_SESSION_SECRET na Vercel e faça Redeploy.";
  }
  if (secret.length < 16) {
    return "ADMIN_SESSION_SECRET precisa ter pelo menos 16 caracteres.";
  }
  return null;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const html = wantsHtml(request);
  const adminUrl = new URL("/admin", request.url);

  if (!checkLoginRateLimit(ip)) {
    if (html) {
      adminUrl.searchParams.set("error", "rate");
      return NextResponse.redirect(adminUrl);
    }
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde alguns minutos." },
      { status: 429 },
    );
  }

  const missing = configError();
  if (missing) {
    if (html) {
      adminUrl.searchParams.set("error", "config");
      return NextResponse.redirect(adminUrl);
    }
    return NextResponse.json({ error: missing }, { status: 503 });
  }

  let password = "";
  const contentType = request.headers.get("content-type") ?? "";
  try {
    if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await request.formData();
      password = String(form.get("password") ?? "");
    } else {
      const body = (await request.json()) as { password?: string };
      password = typeof body.password === "string" ? body.password : "";
    }
  } catch {
    if (html) {
      adminUrl.searchParams.set("error", "invalid");
      return NextResponse.redirect(adminUrl);
    }
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  if (!verifyAdminPassword(password)) {
    if (html) {
      adminUrl.searchParams.set("error", "password");
      return NextResponse.redirect(adminUrl);
    }
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  try {
    const token = createAdminSessionToken();
    if (html) {
      const response = NextResponse.redirect(adminUrl);
      response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
      return response;
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
    return response;
  } catch {
    if (html) {
      adminUrl.searchParams.set("error", "session");
      return NextResponse.redirect(adminUrl);
    }
    return NextResponse.json(
      { error: "Não foi possível criar a sessão." },
      { status: 500 },
    );
  }
}
