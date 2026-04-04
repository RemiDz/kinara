'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

interface Props {
  day: string;
  month: string;
  year: string;
  onChange: (day: string, month: string, year: string) => void;
}

export default function CalendarPicker({ day, month, year, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(month ? parseInt(month) - 1 : now.getMonth());
  const [viewYear, setViewYear] = useState(year ? parseInt(year) : now.getFullYear());

  // Click outside to close (check both button and popup)
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || popRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Position the popup below the button
  const updatePos = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const popW = 280;
    let left = r.left + r.width / 2 - popW / 2 + window.scrollX;
    // Clamp to viewport
    if (left < 8) left = 8;
    if (left + popW > window.innerWidth - 8) left = window.innerWidth - popW - 8;
    setPos({ top: r.bottom + window.scrollY + 4, left });
  }, []);

  useEffect(() => {
    if (open) {
      updatePos();
      if (month && year) {
        setViewMonth(parseInt(month) - 1);
        setViewYear(parseInt(year));
      } else {
        const n = new Date();
        setViewMonth(n.getMonth());
        setViewYear(n.getFullYear());
      }
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reposition on scroll/resize while open
  useEffect(() => {
    if (!open) return;
    window.addEventListener('scroll', updatePos, true);
    window.addEventListener('resize', updatePos);
    return () => {
      window.removeEventListener('scroll', updatePos, true);
      window.removeEventListener('resize', updatePos);
    };
  }, [open, updatePos]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  const pick = (d: number) => {
    onChange(String(d), String(viewMonth + 1), String(viewYear));
    setOpen(false);
  };

  const prev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const next = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const hasValue = !!(day && month && year);
  const display = hasValue
    ? `${parseInt(day)} ${MONTHS[parseInt(month) - 1].slice(0, 3)} ${year}`
    : 'Select date';

  const selDay = day ? parseInt(day) : null;
  const isCur = !!(month && year) && parseInt(month) - 1 === viewMonth && parseInt(year) === viewYear;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={`bg-parchment-card border border-border px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-gold transition-all cursor-pointer inline-flex items-center gap-2 hover:border-gold/50 whitespace-nowrap ${hasValue ? 'text-ink' : 'text-ink-muted'}`}
      >
        <svg className="w-3.5 h-3.5 text-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {display}
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={popRef}
          className="fixed bg-parchment-card border border-border rounded-2xl shadow-golden-lg p-4 w-[280px] animate-fade-in"
          style={{ zIndex: 9999, top: pos.top, left: pos.left, position: 'absolute' }}
        >
          {/* Month & Year navigation */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prev} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-parchment-dark transition-colors text-ink-muted text-sm">&#8249;</button>
            <div className="flex items-center gap-1">
              <select
                value={viewMonth}
                onChange={e => setViewMonth(parseInt(e.target.value))}
                className="appearance-none bg-transparent text-ink text-xs font-semibold focus:outline-none cursor-pointer"
                style={{ paddingRight: '20px', backgroundPosition: 'right 4px center', fontFamily: 'Georgia, serif' }}
              >
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select
                value={viewYear}
                onChange={e => setViewYear(parseInt(e.target.value))}
                className="appearance-none bg-transparent text-ink text-xs font-semibold focus:outline-none cursor-pointer"
                style={{ paddingRight: '20px', backgroundPosition: 'right 4px center' }}
              >
                {Array.from({ length: 111 }, (_, i) => { const y = 2030 - i; return <option key={y} value={y}>{y}</option>; })}
              </select>
            </div>
            <button type="button" onClick={next} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-parchment-dark transition-colors text-ink-muted text-sm">&#8250;</button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] text-ink-muted font-medium py-1">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const d = i + 1;
              const isSelected = isCur && selDay === d;
              const isToday = d === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear();
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => pick(d)}
                  className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-xs transition-all
                    ${isSelected ? 'bg-gold text-parchment-card font-bold shadow-golden' : ''}
                    ${!isSelected && isToday ? 'ring-1 ring-gold text-gold font-semibold' : ''}
                    ${!isSelected && !isToday ? 'text-ink hover:bg-parchment-dark' : ''}
                  `}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {/* Today shortcut */}
          <div className="mt-3 pt-2 border-t border-border text-center">
            <button
              type="button"
              onClick={() => {
                const n = new Date();
                onChange(String(n.getDate()), String(n.getMonth() + 1), String(n.getFullYear()));
                setOpen(false);
              }}
              className="text-gold text-[10px] font-semibold hover:text-gold/80 transition-colors tracking-widest uppercase"
            >
              Today
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
