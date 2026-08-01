import { promises as fs } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";
import {
  createDefaultContent,
  sanitizeContent,
  type SiteContent,
} from "@/lib/site-content";

const LOCAL_CONTENT_PATH = path.join(
  process.cwd(),
  "data",
  "editable-content.json",
);
const BLOB_CONTENT_PATH = "content/editable-content.json";

function blobToken(): string | undefined {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  return token || undefined;
}

function isBlobStoreEnabled(): boolean {
  // Token explícito, ou store ligado via OIDC na Vercel (BLOB_STORE_ID).
  return Boolean(blobToken() || process.env.BLOB_STORE_ID?.trim());
}

function blobAuthOptions(): { token?: string } {
  const token = blobToken();
  return token ? { token } : {};
}

async function readFromBlob(): Promise<SiteContent | null> {
  const auth = blobAuthOptions();

  // Conteúdo é lido só no servidor → preferir private; fallback public.
  for (const access of ["private", "public"] as const) {
    try {
      const result = await get(BLOB_CONTENT_PATH, {
        access,
        useCache: false,
        ...auth,
      });
      if (!result?.stream) continue;
      const raw = await new Response(result.stream).text();
      if (!raw.trim()) continue;
      return sanitizeContent(JSON.parse(raw));
    } catch {
      // tenta o próximo modo de acesso
    }
  }
  return null;
}

async function writeToBlob(content: SiteContent): Promise<SiteContent> {
  const sanitized = sanitizeContent(content);
  const body = `${JSON.stringify(sanitized, null, 2)}\n`;
  const auth = blobAuthOptions();
  const errors: string[] = [];

  // Tenta private e public — stores novos na Vercel costumam ser private-first.
  for (const access of ["private", "public"] as const) {
    try {
      await put(BLOB_CONTENT_PATH, body, {
        access,
        contentType: "application/json; charset=utf-8",
        allowOverwrite: true,
        addRandomSuffix: false,
        cacheControlMaxAge: 60,
        ...auth,
      });
      return sanitized;
    } catch (error) {
      errors.push(
        `${access}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  throw new Error(
    `Falha ao gravar no Blob (${errors.join(" | ")}). Confirme BLOB_READ_WRITE_TOKEN e Redeploy.`,
  );
}

async function readFromDisk(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(LOCAL_CONTENT_PATH, "utf8");
    return sanitizeContent(JSON.parse(raw));
  } catch {
    return createDefaultContent();
  }
}

async function writeToDisk(content: SiteContent): Promise<SiteContent> {
  const sanitized = sanitizeContent(content);
  await fs.mkdir(path.dirname(LOCAL_CONTENT_PATH), { recursive: true });
  await fs.writeFile(
    LOCAL_CONTENT_PATH,
    `${JSON.stringify(sanitized, null, 2)}\n`,
    "utf8",
  );
  return sanitized;
}

export async function readSiteContent(): Promise<SiteContent> {
  if (isBlobStoreEnabled()) {
    try {
      const fromBlob = await readFromBlob();
      if (fromBlob) return fromBlob;
    } catch {
      // Store ainda vazio ou token inválido — cai no JSON local / defaults.
    }
  }
  return readFromDisk();
}

export async function writeSiteContent(
  content: SiteContent,
): Promise<SiteContent> {
  if (isBlobStoreEnabled()) {
    return writeToBlob(content);
  }
  return writeToDisk(content);
}

export async function uploadMediaBlob(
  bytes: Buffer,
  filename: string,
  folder: "portraits" | "gym" | "cards" = "portraits",
): Promise<string> {
  if (!isBlobStoreEnabled()) {
    throw new Error("Blob Store não configurado");
  }
  const auth = blobAuthOptions();
  const errors: string[] = [];

  for (const access of ["public", "private"] as const) {
    try {
      const blob = await put(`${folder}/${filename}`, bytes, {
        access,
        contentType: "image/webp",
        addRandomSuffix: true,
        cacheControlMaxAge: 60 * 60 * 24 * 30,
        ...auth,
      });
      return blob.url;
    } catch (error) {
      errors.push(
        `${access}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  throw new Error(`Falha no upload da imagem (${errors.join(" | ")})`);
}

/** @deprecated Use uploadMediaBlob */
export async function uploadPortraitBlob(
  bytes: Buffer,
  filename: string,
): Promise<string> {
  return uploadMediaBlob(bytes, filename, "portraits");
}

export function hasBlobStore(): boolean {
  return isBlobStoreEnabled();
}
