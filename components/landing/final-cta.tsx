"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SiteContent } from "@/lib/site-content";

interface FinalCtaProps {
  content: SiteContent;
}

export function FinalCta({ content }: FinalCtaProps) {
  const reduceMotion = useReducedMotion();
  const { finalCta, whatsappUrl, finalCtaLabel, phone, instagramUrl } = content;

  return (
    <section
      id="contato"
      className="atmosphere relative overflow-hidden border-y border-line px-5 py-20 sm:px-8 sm:py-28"
      aria-labelledby="cta-heading"
    >
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <h2
          id="cta-heading"
          className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          {finalCta.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          {finalCta.support}
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-9 inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-medium"
        >
          {finalCtaLabel}
        </a>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
          {phone ? <span>{phone}</span> : null}
          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink"
            >
              @{instagramUrl.replace(/\/$/, "").split("/").pop()}
            </a>
          ) : null}
        </div>
      </motion.div>
    </section>
  );
}
