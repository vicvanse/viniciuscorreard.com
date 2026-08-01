interface DottedWordmarkProps {
  text: string;
  className?: string;
}

/**
 * Texto preenchido por uma malha de pontos, com brilho que desliza lentamente.
 * O texto fantasma abaixo mantém o espaço no fluxo e serve de fallback acessível.
 */
export function DottedWordmark({ text, className = "" }: DottedWordmarkProps) {
  return (
    <span className={`relative inline-block select-none ${className}`.trim()}>
      <span className="invisible" aria-hidden>
        {text}
      </span>
      <span className="dotted-wordmark absolute inset-0 flex items-center justify-center whitespace-nowrap">
        {text}
      </span>
    </span>
  );
}
