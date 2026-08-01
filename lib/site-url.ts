/**
 * Base URL for `metadataBase` and absolute URLs in metadata.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. `https://example.com`).
 */
export function siteMetadataBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "http://localhost:3000";
}
