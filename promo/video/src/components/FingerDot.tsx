import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { GestureEvent } from '../gestures';
import { COLORS } from '../theme';

const LEAD_IN = 0.35; // seconds the dot is visible before the first event
const LINGER = 0.7; // and after the last one

// Only swipes and taps are finger positions; 'done' just marks when the sale landed.
const isPosition = (e: GestureEvent) => e.kind === 'swipe' || e.kind === 'tap';

// A trailing swipe with nothing after it is a slide control: the finger keeps
// moving right until 'done'. In 780px video pixels the charge slider's knob
// ends around x 690.
const SLIDER_END_X = 690;

/** Where the finger is at `t` seconds, in the events' own pixels */
export function fingerPosition(events: GestureEvent[], t: number): { x: number; y: number } {
  const positional = events.filter(isPosition);
  const endT = (events.find(e => e.kind === 'done') ?? positional[positional.length - 1]).t;
  // Hold on the previous event until the next one, then ease toward it
  let prev = positional[0];
  let next: GestureEvent | null = null;
  for (const e of positional) {
    if (e.t <= t) prev = e;
    else {
      next = e;
      break;
    }
  }
  const ease = (p: number) => {
    const c = Math.min(1, Math.max(0, p));
    return c * c * (3 - 2 * c);
  };
  if (next && prev.kind === 'swipe') {
    const e = ease((t - prev.t) / (next.t - prev.t || 1));
    return { x: prev.x + (next.x - prev.x) * e, y: prev.y + (next.y - prev.y) * e };
  }
  if (!next && prev.kind === 'swipe') {
    // The charge slider: ride along it until 'done', then stay at its end
    return { x: prev.x + (SLIDER_END_X - prev.x) * ease((t - prev.t) / (endT - prev.t || 1)), y: prev.y };
  }
  return { x: prev.x, y: prev.y };
}

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

  const positional = events.filter(isPosition);
  const first = positional[0];
  const endT = (events.find(e => e.kind === 'done') ?? positional[positional.length - 1]).t;
  if (!first || t < first.t - LEAD_IN || t > endT + LINGER) return null;

  const { x, y } = fingerPosition(events, t);

  const opacity = interpolate(
    t,
    [first.t - LEAD_IN, first.t, endT, endT + LINGER],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Ring pulse on taps (and a soft press shrink while the dot is down)
  const activeTap = positional.find(e => e.kind === 'tap' && t >= e.t && t < e.t + 0.5);
  const ring = activeTap ? (t - activeTap.t) / 0.5 : null;
  const moreToCome = positional.some(e => e.t > t);
  const down = moreToCome ? 1 : interpolate(t, [endT, endT + LINGER], [1, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
