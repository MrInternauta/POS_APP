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

// A screenshot filling the phone screen, with a slow zoom/pan so the still feels alive.
export const ScreenShot: React.FC<{
  src: string;
  width: number;
  pan?: 'in' | 'left' | 'right';
}> = ({ src, width, pan = 'in' }) => {
  const frame = useCurrentFrame();
  const height = Math.round((width * 2532) / 1170);
  const scale = pan === 'in' ? interpolate(frame, [0, 300], [1, 1.07]) : 1.05;
  const tx = pan === 'left' ? interpolate(frame, [0, 300], [2, -2]) : pan === 'right' ? interpolate(frame, [0, 300], [-2, 2]) : 0;
  return (
    <Img
      src={staticFile(src)}
      style={{
        width,
        height,
        transform: `scale(${scale}) translateX(${tx}%)`,
        transformOrigin: 'center 30%',
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
