"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CircleMark } from "@/components/landing/circle-mark";
import {
  circleMarkLines,
  type HeroAlign,
  type HeroVariant,
  type SiteContent,
} from "@/lib/site-content";

interface HeroProps {
  content: SiteContent;
}

const DEFAULT_CARD_SRC = "/brand/business-card.webp";

function HeroCopy({
  content,
  centered = false,
  supportBackdrop = false,
}: {
  content: SiteContent;
  centered?: boolean;
  /** Fundo preto atrás do texto de apoio (full-bleed). */
  supportBackdrop?: boolean;
}) {
  return (
    <div className={centered ? "text-center" : "text-left"}>
      <p className="mb-3 text-[0.7rem] font-medium tracking-[0.22em] text-muted uppercase sm:mb-4 sm:text-xs">
        {content.hero.eyebrow}
      </p>
      <h1 className="font-display text-[clamp(2.1rem,7.5vw,3.75rem)] leading-[1.04] font-semibold tracking-tight text-ink">
        {content.hero.headline}
      </h1>
      {supportBackdrop ? (
        <p
          className={`mt-5 rounded-2xl bg-black/85 px-5 py-4 text-[0.95rem] leading-relaxed text-ink-soft ring-1 ring-white/10 backdrop-blur-sm sm:text-lg ${
            centered ? "mx-auto max-w-xl" : "max-w-md"
          }`}
        >
          {content.hero.support}
        </p>
      ) : (
        <p
          className={`mt-5 text-[0.95rem] leading-relaxed text-ink-soft sm:text-lg ${
            centered ? "mx-auto max-w-xl" : "max-w-md"
          }`}
        >
          {content.hero.support}
        </p>
      )}
      <p className="mt-4 text-sm text-muted">
        {content.name} · {content.title} · {content.crn}
      </p>
      <div
        className={`mt-8 flex flex-col gap-3 sm:flex-row ${
          centered ? "sm:justify-center" : ""
        }`}
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
    </div>
  );
}

function FramedCard({
  src,
  sizes,
  className,
}: {
  src: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[1.1rem] border border-white/12 bg-canvas p-2 shadow-[0_24px_60px_rgba(0,0,0,0.55)] ${className ?? ""}`}
    >
      <div className="overflow-hidden rounded-[0.8rem]">
        <Image
          src={src}
          alt="Identidade visual Vinicius Correard"
          width={1024}
          height={662}
          priority
          quality={90}
          sizes={sizes}
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}

function FullBleedCardBackdrop({
  src,
  reduceMotion,
}: {
  src: string;
  reduceMotion: boolean | null;
}) {
  return (
    <>
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={src}
          alt=""
          fill
          priority
          quality={88}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(10,10,10,0.88)_0%,rgba(10,10,10,0.72)_28%,rgba(10,10,10,0.4)_52%,rgba(10,10,10,0.55)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0a0a0a]/80 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent"
        aria-hidden
      />
    </>
  );
}

function SoftAtmosphere() {
  return <div className="atmosphere-deep absolute inset-0" aria-hidden />;
}

export function Hero({ content }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const variant: HeroVariant = content.heroVariant ?? "1";
  const align: HeroAlign = content.heroAlign ?? "left";
  const isCentered = align === "center";
  const showCircle = content.showCircleMark !== false;
  const lines = circleMarkLines(content.name);
  const cardSrc = content.cardSrc?.trim() || DEFAULT_CARD_SRC;

  return (
    <section
      id="inicio"
      className="relative isolate min-h-[100svh] overflow-hidden bg-canvas"
    >
      {/* Mobile: v4 = só círculo+cartão; demais = quadro (+ círculo opcional) */}
      <div className="sm:hidden">
        <SoftAtmosphere />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <motion.div
            className="w-full max-w-xl"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            {variant === "4" ? (
              showCircle ? (
                <div className="mb-8 flex justify-center">
                  <CircleMark
                    lines={lines}
                    subtitle={content.hero.circleSubtitle}
                    sizePx={280}
                    backdropSrc={cardSrc}
                  />
                </div>
              ) : (
                <figure className="mb-6">
                  <FramedCard
                    src={cardSrc}
                    sizes="320px"
                    className="mx-auto max-w-[19.5rem]"
                  />
                </figure>
              )
            ) : (
              <>
                <figure className="mb-6">
                  <FramedCard
                    src={cardSrc}
                    sizes="320px"
                    className="mx-auto max-w-[19.5rem]"
                  />
                </figure>
                {showCircle ? (
                  <div className="mb-8 flex justify-center">
                    <CircleMark
                      lines={lines}
                      subtitle={content.hero.circleSubtitle}
                      sizePx={240}
                    />
                  </div>
                ) : null}
              </>
            )}
            <HeroCopy content={content} />
          </motion.div>
        </div>
      </div>

      {/* Desktop: 4 variantes do cartão + alinhamento esquerda/centro */}
      <div className="hidden sm:block">
        {variant === "1" ? (
          <>
            <FullBleedCardBackdrop src={cardSrc} reduceMotion={reduceMotion} />
            <div
              className={`relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-8 pt-28 pb-20 lg:justify-center lg:pt-24 lg:pb-24 ${
                isCentered ? "items-center" : "items-start"
              }`}
            >
              <motion.div
                className={`w-full max-w-xl ${isCentered ? "text-center" : ""}`}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                {showCircle ? (
                  <div className={`mb-8 ${isCentered ? "flex justify-center" : ""}`}>
                    <CircleMark
                      lines={lines}
                      subtitle={content.hero.circleSubtitle}
                      sizePx={280}
                    />
                  </div>
                ) : null}
                <HeroCopy
                  content={content}
                  centered={isCentered}
                  supportBackdrop
                />
              </motion.div>
            </div>
          </>
        ) : null}

        {variant === "4" ? (
          <>
            <SoftAtmosphere />
            <div
              className={`relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-8 pt-28 pb-20 lg:justify-center lg:pt-24 lg:pb-24 ${
                isCentered ? "items-center" : "items-start"
              }`}
            >
              <motion.div
                className={`w-full max-w-xl ${isCentered ? "text-center" : ""}`}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                {showCircle ? (
                  <div className={`mb-10 ${isCentered ? "flex justify-center" : ""}`}>
                    <CircleMark
                      lines={lines}
                      subtitle={content.hero.circleSubtitle}
                      sizePx={360}
                      backdropSrc={cardSrc}
                    />
                  </div>
                ) : (
                  <figure className="mb-8">
                    <FramedCard
                      src={cardSrc}
                      sizes="(max-width: 1024px) 70vw, 560px"
                      className={`max-w-[34rem] ${isCentered ? "mx-auto" : ""}`}
                    />
                  </figure>
                )}
                <HeroCopy content={content} centered={isCentered} />
              </motion.div>
            </div>
          </>
        ) : null}

        {variant === "2" ? (
          <>
            <SoftAtmosphere />
            <div className="relative mx-auto flex min-h-[100svh] max-w-3xl flex-col justify-center px-8 pt-28 pb-20">
              <motion.div
                className={`mx-auto w-full max-w-xl ${
                  isCentered ? "text-center" : "text-left"
                }`}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <figure className="mb-8">
                  <FramedCard
                    src={cardSrc}
                    sizes="(max-width: 1024px) 56vw, 448px"
                    className="mx-auto max-w-[27.2rem]"
                  />
                </figure>
                <HeroCopy content={content} centered={isCentered} />
              </motion.div>
            </div>
          </>
        ) : null}

        {variant === "3" ? (
          <>
            <SoftAtmosphere />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] bg-[radial-gradient(ellipse_at_70%_40%,rgba(255,255,255,0.06),transparent_65%)] lg:block"
              aria-hidden
            />
            <div className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-8 pt-28 pb-20 md:grid-cols-2 md:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:pt-24 lg:pb-24">
              <motion.div
                className="w-full max-w-xl"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              >
                <HeroCopy content={content} centered={isCentered} />
              </motion.div>
              <motion.figure
                className="w-full"
                initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.85,
                  delay: 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <FramedCard
                  src={cardSrc}
                  sizes="(max-width: 1024px) 80vw, 560px"
                />
              </motion.figure>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
