import Link from "next/link";
import type { SiteContent } from "@/lib/site-content";

interface SiteFooterProps {
  content: SiteContent;
}

export function SiteFooter({ content }: SiteFooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-canvas">
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div className="max-w-md">
          <p className="font-display text-lg font-semibold tracking-[0.12em] text-ink uppercase">
            {content.name}
          </p>
          <p className="mt-1 text-sm text-muted">
            {content.title} · {content.crn}
          </p>
          <p className="mt-4 text-sm text-ink-soft">{content.footer.copyright}</p>
        </div>

        <div className="flex flex-col gap-2 text-sm sm:items-end">
          {content.phone ? <p className="text-muted">{content.phone}</p> : null}
          {content.email ? (
            <a
              href={`mailto:${content.email}`}
              className="text-ink-soft transition-colors hover:text-ink"
            >
              {content.email}
            </a>
          ) : null}
          {content.instagramUrl ? (
            <a
              href={content.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-soft transition-colors hover:text-ink"
            >
              @{content.instagramUrl.replace(/\/$/, "").split("/").pop()}
            </a>
          ) : null}
          <Link
            href="/admin"
            aria-label="Área do administrador"
            title="Área do administrador"
            className="mt-3 inline-flex items-center gap-2 self-start rounded-full border border-line px-3 py-1.5 text-[11px] tracking-[0.14em] text-muted uppercase transition-colors hover:border-white/30 hover:text-ink sm:self-end"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
