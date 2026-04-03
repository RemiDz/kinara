'use client';
import { useState, useEffect, useCallback } from 'react';
import { calculateKin, getKinResult, getOracle, type KinResult, type OracleResult } from '@/lib/dreamspell-calc';
import TopBar from '@/components/TopBar';
import TodayKin from '@/components/TodayKin';
import SignatureCard from '@/components/SignatureCard';
import SoulEssence from '@/components/SoulEssence';
import Declaration from '@/components/Declaration';
import ToneSection from '@/components/ToneSection';
import OracleCross from '@/components/OracleCross';
import ColourFamily from '@/components/ColourFamily';
import EarthFamily from '@/components/EarthFamily';
import PhasesOfMastery from '@/components/PhasesOfMastery';
import WavespellPosition from '@/components/WavespellPosition';
import CastleSection from '@/components/CastleSection';
import SoundHealing from '@/components/SoundHealing';
import TzolkinMatrix from '@/components/TzolkinMatrix';
import KinComparison from '@/components/KinComparison';
import FrequencyProfile from '@/components/FrequencyProfile';
import CalendarPicker from '@/components/CalendarPicker';
import Footer from '@/components/Footer';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Home() {
  // Today's Kin (auto-loaded)
  const [todayKin, setTodayKin] = useState<KinResult | null>(null);
  const [todayDate, setTodayDate] = useState('');

  // Client Lookup
  const [clientKin, setClientKin] = useState<KinResult | null>(null);
  const [clientOracle, setClientOracle] = useState<OracleResult | null>(null);
  const [clientName, setClientName] = useState('');
  const [isHunabKu, setIsHunabKu] = useState(false);
  const [lookupOpen, setLookupOpen] = useState(false);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Comparison highlights for the matrix
  const [comparisonKins, setComparisonKins] = useState<{ kin: number; color: string }[]>([]);

  // Auto-load today's Kin
  useEffect(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const kin = calculateKin(y, m, d);
    if (kin) {
      setTodayKin(getKinResult(kin));
    }
    setTodayDate(`${d} ${MONTHS[m - 1]} ${y}`);
  }, []);

  const handleClientCalculate = useCallback(() => {
    if (!day || !month || !year) return;
    const kin = calculateKin(parseInt(year), parseInt(month), parseInt(day));
    if (kin === null) {
      setIsHunabKu(true);
      setClientKin(null);
      setClientOracle(null);
      return;
    }
    setIsHunabKu(false);
    setClientKin(getKinResult(kin));
    setClientOracle(getOracle(kin));
    setTimeout(() => {
      document.getElementById('client-result')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [day, month, year]);

  // Collect all Kins to highlight on the matrix
  const allHighlighted = [
    ...(todayKin ? [{ kin: todayKin.kin, color: '#95a5a6' }] : []),
    ...(clientKin ? [{ kin: clientKin.kin, color: '#C4962C' }] : []),
    ...comparisonKins,
  ];

  return (
    <main className="min-h-screen">
      <TopBar todayLabel={todayDate} />

      {/* Zone B — Today's Kin (auto-loaded hero) */}
      <TodayKin kinResult={todayKin} />

      {/* Zone C — Client Lookup (collapsible) */}
      <section className="px-6 py-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => setLookupOpen(!lookupOpen)}
            className="w-full flex items-center justify-between py-3 group"
          >
            <p className="section-label group-hover:text-gold transition-colors">Client Lookup</p>
            <svg className={`w-5 h-5 text-ink-muted transition-transform ${lookupOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`transition-all duration-300 ${lookupOpen ? 'max-h-[200px] opacity-100 overflow-visible' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="pb-4">
              <input
                type="text"
                placeholder="Name (optional)"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="w-full bg-parchment-card border border-border text-ink px-4 py-3 rounded-full text-sm focus:outline-none focus:border-gold transition-all mb-3"
              />
              <div className="flex justify-center mb-4">
                <CalendarPicker
                  day={day}
                  month={month}
                  year={year}
                  onChange={(d, m, y) => { setDay(d); setMonth(m); setYear(y); }}
                />
              </div>
              <div className="text-center">
                <button
                  onClick={handleClientCalculate}
                  disabled={!day || !month || !year}
                  className="bg-gold text-parchment-card font-semibold px-8 py-3 rounded-full text-sm hover:bg-gold/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-golden tracking-wide"
                >
                  Reveal Kin
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Result */}
      <div id="client-result">
        {isHunabKu && <SignatureCard kinResult={null as unknown as KinResult} isHunabKu />}

        {clientKin && clientOracle && (
          <>
            <SignatureCard kinResult={clientKin} />
            <SoulEssence kinResult={clientKin} />
            <Declaration kinResult={clientKin} />
            <ToneSection kinResult={clientKin} />
            <OracleCross kinResult={clientKin} oracle={clientOracle} />
            <ColourFamily kinResult={clientKin} />
            <EarthFamily kinResult={clientKin} />
            <PhasesOfMastery kinResult={clientKin} />
            <WavespellPosition kinResult={clientKin} />
            <CastleSection kinResult={clientKin} />
            <FrequencyProfile kinResult={clientKin} />
            <SoundHealing kinResult={clientKin} />
          </>
        )}
      </div>

      {/* Zone D — Kin Comparison */}
      <KinComparison onKinsChanged={setComparisonKins} />

      {/* Zone E — Tzolkin Matrix */}
      <TzolkinMatrix
        userKin={clientKin?.kin ?? todayKin?.kin ?? null}
        highlightedKins={allHighlighted}
      />

      <Footer />
    </main>
  );
}
