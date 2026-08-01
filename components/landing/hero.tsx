"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CircleMark } from "@/components/landing/circle-mark";
import { circleMarkLines, type HeroVariant, type SiteContent } from "@/lib/site-content";

interface HeroProps {
  content: SiteContent;
}

const HERO_CARD_SRC = "/brand/hero-card.webp";
const HERO_CARD_FRAMED_SRC = "/brand/business-card.webp";

function HeroCopy({
  content,
  centered = false,
}: {
  content: SiteContent;
  centered?: boolean;
}) {
  return (
    <>
      <p className="text-[0.7rem] font-medium tracking-[0.22em] text-muted uppercase sm:text-xs">
        {content.hero.eyebrow}
      </p>
      <h1 className="font-display mt-4 text-[clamp(2.1rem,7.5vw,3.75rem)] leading-[1.04] font-semibold tracking-tight text-ink">
        {content.hero.headline}
      </h1>
      <p
        className={`mt-5 text-[0.95rem] leading-relaxed text-ink-soft sm:text-lg ${
          centered ? "mx-auto max-w-xl" : "max-w-xl"
        }`}
      >
        {content.hero.support}
      </p>
      <p className="mt-4 text-sm text-muted">
        {content.name} · {content.title} · {content.crn}
      </p>
      <div
        className={`mt-8 flex flex-col gap-3 sm:flex-row ${centered ? "sm:justify-center" : ""}`}
      >
        <a
          href={content.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-medium"
        >
          {content.hero.cta}
        </a>
        <a
          href="#atendimento"
          className="btn-ghost inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-medium"
        >
          Como funciona
        </a>
      </div>
    </>
  );
}

function FramedCard({
  sizes,
  className,
}: {
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[1.1rem] border border-white/12 bg-canvas shadow-[0_24px_60px_rgba(0,0,0,0.55)] ${className ?? ""}`}
    >
      <Image
        src={HERO_CARD_FRAMED_SRC}
        alt="Identidade visual Vinicius Correard"
        width={1024}
        height={662}
        priority
        quality={90}
        sizes={sizes}
        className="h-auto w-full"
      />
    </div>
  );
}

function FullBleedCardBackdrop({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <>
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={HERO_CARD_SRC}
          alt=""
          fill
          priority
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.72)_0%,rgba(10,10,10,0.55)_38%,rgba(10,10,10,0.88)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0a0a0a] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent"
        aria-hidden
      />
    </>
  );
}

export function Hero({ content }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const variant: HeroVariant = content.heroVariant ?? "1";
  const lines = circleMarkLines(content.name);

  const mark = (
    <CircleMark
      lines={lines}
      subtitle={content.hero.circleSubtitle}
      sizePx={380}
    />
  );

  return (
    <section
      id="inicio"
      className="relative isolate min-h-[100svh] overflow-hidden bg-canvas"
    >
      {/* Celular: cartão + círculo + texto */}
      <div className="sm:hidden">
        <div className="atmosphere-deep absolute inset-0" aria-hidden />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <motion.div
            className="w-full"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <figure className="mb-8">
              <FramedCard sizes="320px" className="mx-auto max-w-[20rem]" />
            </figure>
            <div className="mb-8">
              <CircleMark
                lines={lines}
                subtitle={content.hero.circleSubtitle}
                sizePx={280}
              />
            </div>
            <HeroCopy content={content} />
          </motion.div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden sm:block">
        {variant === "1" ? (
          <>
            <FullBleedCardBackdrop reduceMotion={reduceMotion} />
            <div className="relative mx-auto flex min-h-[100svh] max-w-4xl flex-col items-center justify-center px-8 pt-32 pb-24 text-center">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                {mark}
              </motion.div>
              <motion.div
                className="mt-12 w-full"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.75,
                  delay: 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <HeroCopy content={content} centered />
              </motion.div>
            </div>
          </>
        ) : null}

        {variant === "2" ? (
          <>
            <div className="atmosphere-deep absolute inset-0" aria-hidden />
            <div className="relative mx-auto flex min-h-[100svh] max-w-3xl flex-col justify-center px-8 pt-32 pb-24">
              <motion.div
                className="w-full"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <figure className="mb-10">
                  <FramedCard
                    sizes="(max-width: 1024px) 70vw, 560px"
                    className="mx-auto max-w-[34rem]"
                  />
                </figure>
                <div className="mb-10">{mark}</div>
                <HeroCopy content={content} />
              </motion.div>
            </div>
          </>
        ) : null}

        {variant === "3" ? (
          <>
            <div className="atmosphere-deep absolute inset-0" aria-hidden />
            <div className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-12 px-8 pt-32 pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <HeroCopy content={content} />
              </motion.div>
              <motion.div
                className="flex flex-col items-center gap-10"
                initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.85,
                  delay: 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <FramedCard sizes="(max-width: 1024px) 80vw, 520px" />
                <div className="hidden lg:block">{mark}</div>
              </motion.div>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
