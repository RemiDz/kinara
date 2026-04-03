'use client';

export default function Footer() {
  return (
    <footer className="py-12 px-6 text-center border-t border-border">
      <p className="text-ink-muted text-sm mb-2">
        Part of the{' '}
        <a href="https://harmonicwaves.app" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold/80 transition-colors">
          Harmonic Waves
        </a>{' '}
        ecosystem
      </p>
      <p className="text-ink-muted/60 text-xs">
        Built with love for the sound healing community &middot; {new Date().getFullYear()}
      </p>
    </footer>
  );
}
