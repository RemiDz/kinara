'use client';
import { useState } from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

interface HeroProps {
  onCalculate: (year: number, month: number, day: number) => void;
  hasResult: boolean;
}

export default function Hero({ onCalculate, hasResult }: HeroProps) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const handleReveal = () => {
    if (!day || !month || !year) return;
    onCalculate(parseInt(year), parseInt(month), parseInt(day));
    setTimeout(() => {
      document.getElementById('signature-card')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const sel = 'appearance-none bg-parchment-card border border-border text-ink px-4 py-3 rounded-full text-center text-sm focus:outline-none focus:border-gold focus:shadow-golden transition-all cursor-pointer min-w-0';

  return (
    <section className={`relative flex items-center justify-center overflow-hidden transition-all duration-700 ${hasResult ? 'min-h-[50vh]' : 'min-h-screen'}`}>
      {/* Faint sacred geometry watermark */}
      <div className="absolute inset-0 opacity-[0.04] flex items-center justify-center pointer-events-none">
        <svg width="500" height="500" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="160" stroke="#C4962C" strokeWidth="0.5" fill="none" />
          <circle cx="250" cy="90" r="160" stroke="#C4962C" strokeWidth="0.5" fill="none" />
          <circle cx="250" cy="410" r="160" stroke="#C4962C" strokeWidth="0.5" fill="none" />
          <circle cx="111" cy="170" r="160" stroke="#C4962C" strokeWidth="0.5" fill="none" />
          <circle cx="389" cy="170" r="160" stroke="#C4962C" strokeWidth="0.5" fill="none" />
          <circle cx="111" cy="330" r="160" stroke="#C4962C" strokeWidth="0.5" fill="none" />
          <circle cx="389" cy="330" r="160" stroke="#C4962C" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
        <h1 className="font-serif text-6xl md:text-7xl text-ink mb-3 tracking-wide">Kinara</h1>
        <p className="text-ink-muted text-lg md:text-xl mb-12 font-light tracking-widest uppercase">Discover Your Galactic Signature</p>

        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          <select value={day} onChange={e => setDay(e.target.value)} className={sel} aria-label="Day">
            <option value="" disabled>Day</option>
            {Array.from({ length: 31 }, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
          </select>
          <select value={month} onChange={e => setMonth(e.target.value)} className={sel} aria-label="Month">
            <option value="" disabled>Month</option>
            {MONTHS.map((n, i) => <option key={i+1} value={i+1}>{n}</option>)}
          </select>
          <select value={year} onChange={e => setYear(e.target.value)} className={sel} aria-label="Year">
            <option value="" disabled>Year</option>
            {Array.from({ length: 111 }, (_, i) => { const y = 2030 - i; return <option key={y} value={y}>{y}</option>; })}
          </select>
        </div>

        <button
          onClick={handleReveal}
          disabled={!day || !month || !year}
          className="bg-gold text-parchment-card font-semibold px-8 py-4 rounded-full text-lg hover:bg-gold/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-golden hover:shadow-golden-lg tracking-wide"
        >
          Reveal My Kin
        </button>
      </div>
    </section>
  );
}
