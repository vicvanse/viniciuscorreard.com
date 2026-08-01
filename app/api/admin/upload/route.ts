import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  hasBlobStore,
  readSiteContent,
  uploadMediaBlob,
  writeSiteContent,
} from "@/lib/content-store";
import {
  createDefaultContent,
  isMediaSlot,
  type MediaSlot,
  type SiteContent,
} from "@/lib/site-content";

export const runtime = "nodejs";

/** Limite alinhado ao body max da Vercel (~4.5 MB). */
const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const SLOT_FOLDERS: Record<MediaSlot, "portraits" | "gym" | "cards"> = {
  portrait: "portraits",
  gym: "gym",
  card: "cards",
};

const SLOT_RESIZE: Record<
  MediaSlot,
  { width: number; height: number }
> = {
  portrait: { width: 1600, height: 2000 },
  gym: { width: 1600, height: 2000 },
  card: { width: 1600, height: 1200 },
};

function applySlotSrc(
  content: SiteContent,
  slot: MediaSlot,
  src: string,
  updatedAt: string,
): SiteContent {
  if (slot === "portrait") {
    return { ...content, portraitSrc: src, portraitUpdatedAt: updatedAt };
  }
  if (slot === "gym") {
    return { ...content, gymSrc: src, gymUpdatedAt: updatedAt };
  }
  return { ...content, cardSrc: src, cardUpdatedAt: updatedAt };
}

function clearSlot(content: SiteContent, slot: MediaSlot): SiteContent {
  const defaults = createDefaultContent();
  if (slot === "portrait") {
    return { ...content, portraitSrc: "", portraitUpdatedAt: "" };
  }
  if (slot === "gym") {
    return { ...content, gymSrc: "", gymUpdatedAt: "" };
  }
  return {
    ...content,
    cardSrc: defaults.cardSrc,
    cardUpdatedAt: "",
  };
}

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

  const slotRaw = form.get("slot");
  const slot = isMediaSlot(slotRaw) ? slotRaw : "portrait";

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
    const resize = SLOT_RESIZE[slot];
    const optimized = await sharp(input)
      .rotate()
      .resize({
        width: resize.width,
        height: resize.height,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 88, effort: 4 })
      .toBuffer();

    const stamp = Date.now();
    const filename = `${slot}-${stamp}.webp`;
    let mediaSrc: string;

    if (hasBlobStore()) {
      mediaSrc = await uploadMediaBlob(optimized, filename, SLOT_FOLDERS[slot]);
    } else {
      const relative = `/brand/uploads/${filename}`;
      const absolute = path.join(process.cwd(), "public", "brand", "uploads");
      await mkdir(absolute, { recursive: true });
      await writeFile(path.join(absolute, filename), optimized);
      mediaSrc = relative;
    }

    const current = await readSiteContent();
    const saved = await writeSiteContent(
      applySlotSrc(current, slot, mediaSrc, new Date(stamp).toISOString()),
    );

    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({
      content: saved,
      slot,
      src: mediaSrc,
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

/** Remove a mídia do slot (retrato/academia ficam vazios; cartão volta ao padrão). */
export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const slotRaw = request.nextUrl.searchParams.get("slot");
  if (!isMediaSlot(slotRaw)) {
    return NextResponse.json({ error: "Slot inválido." }, { status: 400 });
  }

  try {
    const current = await readSiteContent();
    const saved = await writeSiteContent(clearSlot(current, slotRaw));

    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({ content: saved, slot: slotRaw });
  } catch {
    return NextResponse.json(
      {
        error: hasBlobStore()
          ? "Falha ao atualizar o conteúdo no storage."
          : "Falha ao atualizar. Configure BLOB_READ_WRITE_TOKEN na Vercel (Storage → Blob).",
      },
      { status: 500 },
    );
  }
}
