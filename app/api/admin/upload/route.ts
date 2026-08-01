import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  hasBlobStore,
  readSiteContent,
  uploadPortraitBlob,
  writeSiteContent,
} from "@/lib/content-store";

export const runtime = "nodejs";

/** Limite alinhado ao body max da Vercel (~4.5 MB). */
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formulário inválido." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo ausente." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Use JPG, PNG, WebP ou GIF." },
      { status: 400 },
    );
  }

  if (file.size <= 0 || file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Arquivo deve ter até 4 MB." },
      { status: 400 },
    );
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const optimized = await sharp(input)
      .rotate()
      .resize({
        width: 1600,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 88, effort: 4 })
      .toBuffer();

    const stamp = Date.now();
    let portraitSrc: string;

    if (hasBlobStore()) {
      portraitSrc = await uploadPortraitBlob(
        optimized,
        `portrait-${stamp}.webp`,
      );
    } else {
      const relative = `/brand/uploads/portrait-${stamp}.webp`;
      const absolute = path.join(process.cwd(), "public", "brand", "uploads");
      await mkdir(absolute, { recursive: true });
      await writeFile(path.join(absolute, `portrait-${stamp}.webp`), optimized);
      portraitSrc = relative;
    }

    const current = await readSiteContent();
    const saved = await writeSiteContent({
      ...current,
      portraitSrc,
      portraitUpdatedAt: new Date(stamp).toISOString(),
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({
      content: saved,
      portraitSrc,
    });
  } catch {
    return NextResponse.json(
      {
        error: hasBlobStore()
          ? "Falha ao gravar a imagem no storage."
          : "Falha ao gravar a imagem. Configure BLOB_READ_WRITE_TOKEN na Vercel (Storage → Blob).",
      },
      { status: 500 },
    );
  }
}
