import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { GestureEvent } from '../gestures';
import { COLORS } from '../theme';

const LEAD_IN = 0.35; // seconds the dot is visible before the first event
const LINGER = 0.7; // and after the last one

/**
 * A translucent fingertip dot driven by the gesture events (sale-events.json).
 * Positions come in recording pixels and are scaled to the rendered screen width.
 * A ring pulses outward on each `tap`.
 */
export const FingerDot: React.FC<{
  events: GestureEvent[];
  screenWidth: number;
  pixelWidth: number; // width of the coordinate space the events use
}> = ({ events, screenWidth, pixelWidth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scale = screenWidth / pixelWidth;

  const first = events[0];
  const last = events[events.length - 1];
  if (!first || t < first.t - LEAD_IN || t > last.t + LINGER) return null;

  // Position: hold on the previous event until the next one, then ease toward it
  let prev = first;
  let next: GestureEvent | null = null;
  for (const e of events) {
    if (e.t <= t) prev = e;
    else {
      next = e;
      break;
    }
  }
  let x = prev.x;
  let y = prev.y;
  if (next && prev.kind === 'swipe') {
    const p = Math.min(1, Math.max(0, (t - prev.t) / (next.t - prev.t || 1)));
    const ease = p * p * (3 - 2 * p);
    x = prev.x + (next.x - prev.x) * ease;
    y = prev.y + (next.y - prev.y) * ease;
  }

  const opacity = interpolate(
    t,
    [first.t - LEAD_IN, first.t, last.t, last.t + LINGER],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Ring pulse on taps (and a soft press shrink while the dot is down)
  const activeTap = events.find(e => e.kind === 'tap' && t >= e.t && t < e.t + 0.5);
  const ring = activeTap ? (t - activeTap.t) / 0.5 : null;
  const down = next ? 1 : interpolate(t, [last.t, last.t + LINGER], [1, 0.85]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x * scale,
        top: y * scale,
        width: 0,
        height: 0,
        opacity,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -34,
          top: -34,
          width: 68,
          height: 68,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.35)',
          border: `3px solid ${COLORS.coral}`,
          transform: `scale(${down})`,
          boxShadow: '0 4px 18px rgba(0,0,0,0.45)',
        }}
      />
      {ring !== null && (
        <div
          style={{
            position: 'absolute',
            left: -34 - ring * 60,
            top: -34 - ring * 60,
            width: 68 + ring * 120,
            height: 68 + ring * 120,
            borderRadius: '50%',
            border: '4px solid rgba(233,78,60,0.9)',
            opacity: 1 - ring,
          }}
        />
      )}
    </div>
  );
};
