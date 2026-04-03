'use client';

interface ToneSymbolProps {
  tone: number;
  size?: number;
  colour?: string;
}

export default function ToneSymbol({ tone, size = 40, colour = '#3D2E1E' }: ToneSymbolProps) {
  const bars = Math.floor(tone / 5);
  const dots = tone % 5;

  // Proportions tuned for visual clarity at small sizes
  const barW = size * 0.75;
  const barH = size * 0.14;
  const barGap = size * 0.08;
  const dotR = size * 0.08;
  const dotGap = size * 0.2;

  const barsH = bars > 0 ? bars * barH + (bars - 1) * barGap : 0;
  const dotsH = dots > 0 ? dotR * 2 : 0;
  const gap = bars > 0 && dots > 0 ? size * 0.1 : 0;
  const totalH = barsH + gap + dotsH;
  const startY = (size - totalH) / 2;
  const cx = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Tone ${tone}`}>
      {/* Dots above bars */}
      {dots > 0 && Array.from({ length: dots }, (_, i) => (
        <circle
          key={`d${i}`}
          cx={cx - ((dots - 1) * dotGap) / 2 + i * dotGap}
          cy={startY + dotR}
          r={dotR}
          fill={colour}
        />
      ))}
      {/* Bars below dots */}
      {bars > 0 && Array.from({ length: bars }, (_, i) => (
        <rect
          key={`b${i}`}
          x={cx - barW / 2}
          y={startY + dotsH + gap + i * (barH + barGap)}
          width={barW}
          height={barH}
          rx={barH / 3}
          fill={colour}
        />
      ))}
    </svg>
  );
}
