const FALLBACK_WHATSAPP_URL = "https://wa.me/5500000000000";

const ALLOWED_HOSTS = new Set([
  "wa.me",
  "api.whatsapp.com",
  "www.whatsapp.com",
  "chat.whatsapp.com",
]);

/**
 * Aceita apenas URLs HTTPS oficiais do WhatsApp.
 * Evita javascript:, data: ou hosts arbitrários via env comprometido.
 */
export function getSafeWhatsAppUrl(raw?: string | null): string {
  const value = raw?.trim();
  if (!value) return FALLBACK_WHATSAPP_URL;

  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return FALLBACK_WHATSAPP_URL;

    const host = url.hostname.toLowerCase();
    if (!ALLOWED_HOSTS.has(host)) return FALLBACK_WHATSAPP_URL;

    if (host === "wa.me") {
      const phone = url.pathname.replace(/^\//, "").split("/")[0] ?? "";
      if (phone && !/^\d{8,15}$/.test(phone)) return FALLBACK_WHATSAPP_URL;
    }

    return url.toString();
  } catch {
    return FALLBACK_WHATSAPP_URL;
  }
}
