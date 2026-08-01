import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { hasBlobStore, readSiteContent, writeSiteContent } from "@/lib/content-store";
import { sanitizeContent } from "@/lib/site-content";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const content = await readSiteContent();
  return NextResponse.json({ content });
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const incoming =
    body && typeof body === "object" && "content" in body
      ? (body as { content: unknown }).content
      : body;

  try {
    const saved = await writeSiteContent(sanitizeContent(incoming));
    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json({ content: saved });
  } catch (error) {
    const detail =
      error instanceof Error && error.message
        ? error.message
        : "Não foi possível gravar o conteúdo.";
    return NextResponse.json(
      {
        error: hasBlobStore()
          ? detail
          : "Não foi possível gravar. Na Vercel, conecte um Blob Store (Storage → Blob) para gerar BLOB_READ_WRITE_TOKEN e faça Redeploy.",
      },
      { status: 500 },
    );
  }
}
