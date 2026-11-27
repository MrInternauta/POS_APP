import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { COLORS } from '../theme';

// Standard layout: caption column on the left, phone on the right.
export const SceneShell: React.FC<{ children: React.ReactNode; caption?: React.ReactNode }> = ({
  children,
  caption,
}) => (
  <AbsoluteFill style={{ background: COLORS.bg }}>
    <AbsoluteFill
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 110px',
        gap: 90,
      }}
    >
      {caption}
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

// The slow zoom/pan, kept small: at 1.02 and ±0.45% it never crops more than ~1.5% off an edge
// (a 1.05 zoom with a 2% pan cut "Cerrar" to "errar") and never uncovers a gap beside the screen.
export function screenTransform(frame: number, pan: 'in' | 'left' | 'right'): { scale: number; tx: number } {
  const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
  if (pan === 'in') return { scale: interpolate(frame, [0, 300], [1, 1.02], clamp), tx: 0 };
  const [a, b] = pan === 'left' ? [0.45, -0.45] : [-0.45, 0.45];
  return { scale: 1.02, tx: interpolate(frame, [0, 300], [a, b], clamp) };
}

// A screenshot filling the phone screen, with a slow zoom/pan so the still feels alive.
export const ScreenShot: React.FC<{
  src: string;
  width: number;
  pan?: 'in' | 'left' | 'right';
}> = ({ src, width, pan = 'in' }) => {
  const frame = useCurrentFrame();
  const height = Math.round((width * 2532) / 1170);
  const { scale, tx } = screenTransform(frame, pan);
  return (
    <Img
      src={staticFile(src)}
      style={{
        width,
        height,
        transform: `scale(${scale}) translateX(${tx}%)`,
        transformOrigin: 'center top',
      }}
    />
  );
};

// Crossfade + slight slide between successive screens inside the phone.
export const Faded: React.FC<{ from: number; duration?: number; children: React.ReactNode }> = ({
  from,
  duration = 15,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateX(${(1 - p) * 6}%)` }}>
      {children}
    </AbsoluteFill>
  );
};
