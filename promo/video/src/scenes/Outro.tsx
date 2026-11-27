import React from 'react';
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS, FONT } from '../theme';

// Icon, "Mini POS", "Disponible en Google Play" — plain text, no official badge.
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14 } });
  const scale = interpolate(pop, [0, 1], [0.6, 1]);
  const textIn = spring({ frame: frame - 12, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 36,
        fontFamily: FONT,
      }}
    >
      <Img
        src={staticFile('icon.png')}
        style={{ width: 170, height: 170, borderRadius: 40, transform: `scale(${scale})` }}
      />
      <div
        style={{
          opacity: textIn,
          transform: `translateY(${interpolate(textIn, [0, 1], [30, 0])}px)`,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 92, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          Mini POS
        </div>
        <div style={{ fontSize: 38, fontWeight: 600, color: COLORS.coral, marginTop: 18 }}>
          Disponible en Google Play
        </div>
      </div>
    </AbsoluteFill>
  );
};
