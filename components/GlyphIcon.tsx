'use client';
import Image from 'next/image';

interface GlyphIconProps {
  iconFile: string;
  sealName: string;
  size?: number;
  className?: string;
}

export default function GlyphIcon({ iconFile, sealName, size = 80, className = '' }: GlyphIconProps) {
  return (
    <Image
      src={`/glyphs/${iconFile}`}
      alt={`${sealName} glyph`}
      width={size}
      height={size}
      className={`inline-block flex-shrink-0 ${className}`}
      style={{ objectFit: 'contain', width: size, height: size }}
    />
  );
}
