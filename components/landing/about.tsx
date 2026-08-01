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
  const {
    about,
    name,
    title,
    crn,
    portraitSrc,
    portraitUpdatedAt,
    gymSrc,
    gymUpdatedAt,
  } = content;

  return (
    <section
      id="sobre"
      className="atmosphere relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:gap-12">
        <motion.div
          className="max-w-3xl"
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

        {/* Abaixo do texto; altura moderada para não competir com o hero. */}
        <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4">
          <motion.div
            className="relative h-[405px] w-full overflow-hidden rounded-[1.25rem] border border-line bg-canvas shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:h-[435px] sm:w-[327px] sm:shrink-0 lg:h-[466px] lg:w-[350px]"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            {portraitSrc ? (
              <>
                <Image
                  src={portraitSrc}
                  alt={`${name}, ${crn}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 350px"
                  className="object-cover object-[center_15%]"
                  key={`${portraitSrc}-${portraitUpdatedAt}`}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-4 sm:p-3.5">
                  <p className="font-display text-xl font-semibold text-ink sm:text-lg">
                    {name}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-soft">{crn}</p>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-6 px-4 py-8">
                <CircleMark lines={circleMarkLines(name)} subtitle={title} sizePx={160} />
                <div className="text-center">
                  <p className="font-display text-xl font-semibold text-ink">{name}</p>
                  <p className="mt-1 text-sm text-muted">{crn}</p>
                </div>
              </div>
            )}
          </motion.div>

          {gymSrc ? (
            <motion.div
              className="relative h-[405px] w-full overflow-hidden rounded-[1.25rem] border border-line bg-canvas shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:h-[435px] sm:w-[327px] sm:shrink-0 lg:h-[466px] lg:w-[350px]"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: reduceMotion ? 0 : 0.08 }}
            >
              <Image
                src={gymSrc}
                alt={`${name} em treino`}
                fill
                sizes="(max-width: 640px) 100vw, 350px"
                className="object-cover object-[center_20%]"
                key={`${gymSrc}-${gymUpdatedAt}`}
              />
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
