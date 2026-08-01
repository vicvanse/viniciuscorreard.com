"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SiteContent } from "@/lib/site-content";

interface SituationsProps {
  content: SiteContent;
}

export function Situations({ content }: SituationsProps) {
  const reduceMotion = useReducedMotion();
  const { situations } = content;

  return (
    <section
      className="bg-canvas px-5 py-20 sm:px-8 sm:py-28"
      aria-labelledby="situations-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          id="situations-heading"
          className="font-display max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          {situations.heading}
        </motion.h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:gap-6">
          {situations.items.map((item, index) => (
            <motion.article
              key={`${item.title}-${index}`}
              className="rounded-2xl border border-line bg-surface-raised p-6 transition-colors hover:border-white/20 sm:p-7"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : index * 0.06 }}
            >
              <h3 className="font-display text-xl font-semibold text-ink sm:text-[1.35rem]">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>

        <p className="mt-14 max-w-2xl border-t border-line pt-8 text-lg leading-relaxed text-ink-soft">
          {situations.closing}
        </p>
      </div>
    </section>
  );
}
