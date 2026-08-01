"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { SiteContent } from "@/lib/site-content";

interface CareProps {
  content: SiteContent;
}

export function Care({ content }: CareProps) {
  const reduceMotion = useReducedMotion();
  const { firstMeeting, care, whatsappUrl, contactCtaLabel } = content;

  return (
    <section
      id="atendimento"
      className="atmosphere px-5 py-20 sm:px-8 sm:py-28"
      aria-labelledby="care-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {firstMeeting.heading}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted sm:text-lg">
              {firstMeeting.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-8 inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium"
            >
              {contactCtaLabel}
            </a>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: reduceMotion ? 0 : 0.08 }}
          >
            <h2
              id="care-heading"
              className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
            >
              {care.heading}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted sm:text-lg">
              {care.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-6 border-t border-line pt-12 sm:grid-cols-3">
          {care.facts.map((fact, index) => (
            <motion.div
              key={`${fact.title}-${index}`}
              className="rounded-2xl border border-line bg-surface-raised p-6"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : index * 0.05 }}
            >
              <h3 className="font-display text-lg font-semibold text-ink">
                {fact.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                {fact.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
