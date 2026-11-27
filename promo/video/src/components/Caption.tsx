import React from 'react';
import { useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';
import { COLORS, FONT } from '../theme';

// Large white Avenir headline with a coral accent bar, fading in.
export const Caption: React.FC<{ text: string; delay?: number; width?: number }> = ({
  text,
  delay = 6,
  width = 760,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const translateY = interpolate(enter, [0, 1], [40, 0]);
  return (
    <div style={{ width, opacity, transform: `translateY(${translateY}px)` }}>
      <div
        style={{
          width: 96,
          height: 8,
          borderRadius: 4,
          background: COLORS.coral,
          marginBottom: 28,
        }}
      />
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 68,
          lineHeight: 1.15,
          color: '#fff',
          letterSpacing: '-0.01em',
        }}
      >
        {text}
      </div>
    </div>
  );
};
