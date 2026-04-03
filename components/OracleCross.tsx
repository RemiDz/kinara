'use client';
import type { KinResult, OracleResult } from '@/lib/dreamspell-calc';
import { SEAL_COLOUR_TEXT } from '@/lib/dreamspell-data';
import GlyphIcon from './GlyphIcon';

interface Props { kinResult: KinResult; oracle: OracleResult }

function Pos({ label, seal, desc }: { label: string; seal: { name: string; colour: string; iconFile: string }; desc: string }) {
  return (
    <div className="flex flex-col items-center p-3 bg-parchment-card border border-border rounded-2xl shadow-card min-w-[110px]">
      <p className="section-label mb-2">{label}</p>
      <GlyphIcon iconFile={seal.iconFile} sealName={seal.name} size={44} />
      <p className={`${SEAL_COLOUR_TEXT[seal.colour]} text-sm font-semibold mt-2`}>{seal.colour} {seal.name}</p>
      <p className="text-ink-muted text-[10px] mt-1 text-center">{desc}</p>
    </div>
  );
}

export default function OracleCross({ kinResult, oracle }: Props) {
  const { seal } = kinResult;

  return (
    <section className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="gold-divider mb-10" />
        <p className="section-label text-center mb-6">Your Destiny Oracle</p>
        <p className="text-ink-muted text-center text-sm mb-8">The four Kins that shape your galactic journey</p>

        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
          <div />
          <Pos label="Guide" seal={oracle.guide} desc="Who leads you" />
          <div />

          <Pos label="Antipode" seal={oracle.antipode} desc="Who stretches you" />
          <div className="flex flex-col items-center p-3 bg-gold/10 border border-gold-light rounded-2xl shadow-golden">
            <p className="section-label mb-2">Destiny</p>
            <GlyphIcon iconFile={seal.iconFile} sealName={seal.name} size={44} />
            <p className={`${SEAL_COLOUR_TEXT[seal.colour]} text-sm font-semibold mt-2`}>{seal.colour} {seal.name}</p>
            <p className="text-gold text-[10px] mt-1 font-mono">Kin {kinResult.kin}</p>
          </div>
          <Pos label="Analog" seal={oracle.analog} desc="Who strengthens you" />

          <div />
          <Pos label="Occult" seal={oracle.occult} desc="Your secret strength" />
          <div />
        </div>
      </div>
    </section>
  );
}
