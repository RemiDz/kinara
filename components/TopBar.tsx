'use client';

interface Props {
  todayLabel: string;
}

export default function TopBar({ todayLabel }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-parchment/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <h1 className="font-serif text-2xl text-ink tracking-wide">Kinara</h1>
        <p className="text-ink-muted text-xs sm:text-sm tracking-wide">{todayLabel}</p>
      </div>
    </header>
  );
}
