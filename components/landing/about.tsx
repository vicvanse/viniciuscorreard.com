"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CircleMark } from "@/components/landing/circle-mark";
import { circleMarkLines, type SiteContent } from "@/lib/site-content";

interface AboutProps {
  content: SiteContent;
}

export function About({ content }: AboutProps) {
  const reduceMotion = useReducedMotion();
  const { about, name, title, crn, portraitSrc, portraitUpdatedAt } = content;

  return (
    <section
      id="sobre"
      className="atmosphere relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium tracking-[0.22em] text-muted uppercase">
            {title}
          </p>
          <h2
            id="about-heading"
            className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            {about.heading}
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-soft sm:text-lg">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="relative overflow-hidden rounded-[1.5rem] border border-line bg-canvas"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          {portraitSrc ? (
            <div className="grid gap-3 p-3 sm:p-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem]">
                <Image
                  src={portraitSrc}
                  alt={`${name} — ${crn}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-[center_15%]"
                  key={`${portraitSrc}-${portraitUpdatedAt}`}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-6 sm:p-8">
                  <p className="font-display text-2xl font-semibold text-ink">{name}</p>
                  <p className="mt-1 text-sm text-ink-soft">{crn}</p>
                </div>
              </div>
              <div className="relative aspect-[3/2] overflow-hidden rounded-[1.1rem]">
                <Image
                  src="/brand/vinicius-portrait-alt.webp"
                  alt={`${name} na formatura em Nutrição`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-[center_30%]"
                />
              </div>
            </div>
          ) : (
            <div className="flex aspect-[4/5] flex-col items-center justify-center gap-10 px-6 py-10">
              <CircleMark lines={circleMarkLines(name)} subtitle={title} sizePx={300} />
              <div className="text-center">
                <p className="font-display text-2xl font-semibold text-ink">{name}</p>
                <p className="mt-1 text-sm text-muted">{crn}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
