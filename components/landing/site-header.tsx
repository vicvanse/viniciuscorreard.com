"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";

interface SiteHeaderProps {
  content: SiteContent;
}

export function SiteHeader({ content }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isSolid = isScrolled || isOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        isSolid
          ? "bg-canvas/80 shadow-[0_1px_0_var(--line)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[4.25rem] sm:px-8">
        <a
          href="#inicio"
          className="font-display text-base font-semibold tracking-[0.12em] text-ink uppercase sm:text-lg"
          onClick={() => setIsOpen(false)}
        >
          {content.name}
        </a>

        <nav
          className="hidden items-center gap-1 rounded-full border border-line bg-white/[0.03] px-2 py-1.5 backdrop-blur-md md:flex"
          aria-label="Principal"
        >
          {content.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-1.5 text-sm text-ink-soft transition-colors hover:bg-white/10 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={content.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary hidden rounded-full px-5 py-2 text-sm font-medium md:inline-flex"
        >
          {content.whatsappLabel}
        </a>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen ? (
        <nav
          id="mobile-nav"
          className="border-t border-line bg-canvas/95 px-5 py-6 backdrop-blur-xl md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-4">
            {content.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block py-1 text-base text-ink"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={content.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            {content.whatsappLabel}
          </a>
        </nav>
      ) : null}
    </header>
  );
}
