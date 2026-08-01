import Image from "next/image";
import { DottedWordmark } from "@/components/landing/dotted-wordmark";

interface CircleMarkProps {
  lines: string[];
  subtitle?: string;
  sizePx?: number;
  className?: string;
  /** Imagem circular por trás dos anéis (ex.: cartão na versão 4). */
  backdropSrc?: string;
}

/** Anel externo estático + anel tracejado em rotação contínua. */
function LivingRing() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      aria-hidden
    >
      <defs>
        <linearGradient id="circle-mark-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="0.55" stopColor="rgba(255,255,255,0.72)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.12)" />
        </linearGradient>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="34"
        className="circle-mark-track"
        strokeWidth="8"
        fill="none"
      />
      <g className="circle-mark-spin">
        <circle
          cx="50"
          cy="50"
          r="34"
          stroke="url(#circle-mark-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="24 10"
          fill="none"
          className="circle-mark-pulse"
        />
        <circle
          cx="50"
          cy="50"
          r="26"
          className="circle-mark-thin circle-mark-wobble"
          strokeWidth="2"
          strokeDasharray="10 6"
          fill="none"
        />
      </g>
    </svg>
  );
}

export function CircleMark({
  lines,
  subtitle,
  sizePx = 380,
  className = "",
  backdropSrc,
}: CircleMarkProps) {
  const maxCap = backdropSrc ? 480 : 420;

  return (
    <div
      className={`circle-mark relative mx-auto flex items-center justify-center ${className}`.trim()}
      style={{
        width: sizePx,
        height: sizePx,
        maxWidth: `min(86vw, ${maxCap}px)`,
        maxHeight: `min(86vw, ${maxCap}px)`,
      }}
    >
      <div className="absolute inset-0" aria-hidden>
        {backdropSrc ? (
          <div className="absolute inset-[6px] overflow-hidden rounded-full">
            <Image
              src={backdropSrc}
              alt=""
              fill
              sizes="420px"
              quality={90}
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/68" />
          </div>
        ) : null}
        <div className="circle-mark-ring-outer absolute inset-0 rounded-full" />
        <div className="circle-mark-ring-inner absolute inset-[18px] rounded-full" />
        <div className="absolute inset-[74px]">
          <LivingRing />
        </div>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        {lines.map((line) => (
          <DottedWordmark
            key={line}
            text={line}
            variant={backdropSrc ? "letter" : "default"}
            className="font-display text-[clamp(1rem,4.6vw,1.45rem)] leading-[1.5] font-semibold tracking-[0.2em]"
          />
        ))}
        {subtitle ? (
          <span
            className={
              backdropSrc
                ? "mt-3 text-[9px] font-medium tracking-[0.3em] text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.45)] sm:text-[10px]"
                : "mt-3 text-[9px] tracking-[0.3em] text-ink-soft uppercase sm:text-[10px]"
            }
          >
            {subtitle}
          </span>
        ) : null}
      </div>
    </div>
  );
}
