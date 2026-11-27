import React from 'react';
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Caption } from '../components/Caption';
import { COLORS } from '../theme';

// The icon springs in over the brand background.
export const Intro: React.FC<{ caption: string }> = ({ caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, mass: 0.8 } });
  const scale = interpolate(pop, [0, 1], [0.4, 1]);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 56,
      }}
    >
      <Img
        src={staticFile('icon.png')}
        style={{ width: 220, height: 220, borderRadius: 52, transform: `scale(${scale})` }}
      />
      <Caption text={caption} width={860} />
    </AbsoluteFill>
  );
};
