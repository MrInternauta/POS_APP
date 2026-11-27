import React from 'react';
import { OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { Caption } from '../components/Caption';
import { FingerDot } from '../components/FingerDot';
import { PhoneFrame } from '../components/PhoneFrame';
import { GestureEvent } from '../gestures';
import { SceneShell } from './shared';
import events from '../../public/sale-events.json';

const EVENTS = events as GestureEvent[];

// The recorded viewport is 390×844 at deviceScaleFactor 2 → 780×1688 video pixels.
const W = 390;
const H = 844;
const VIDEO_PIXELS = 780;

// The real sale: the cashier's recording inside the phone. The caption switches
// to "Cobra en un toque" at the gesture right after the cart opens (the charge),
// i.e. the event that follows the last tap before 'done' in sale-events.json.
export const Sale: React.FC<{ captions: string[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const doneAt = EVENTS.findIndex((e) => e.kind === 'done');
  const upto = doneAt === -1 ? EVENTS.length : doneAt;
  const cartTap = EVENTS.slice(0, upto)
    .map((e, i) => ({ e, i }))
    .filter(({ e }) => e.kind === 'tap')
    .pop();
  const charge = cartTap ? EVENTS[cartTap.i + 1] : undefined;
  const caption = charge && frame >= charge.t * 30 ? captions[1] : captions[0];

  return (
    <SceneShell caption={<Caption key={caption} text={caption} />}>
      <PhoneFrame width={W + 36}>
        <div style={{ position: 'relative', width: W, height: H }}>
          <OffthreadVideo
            src={staticFile('sale.mp4')}
            muted
            style={{ width: W, height: H, objectFit: 'cover' }}
          />
          <FingerDot events={EVENTS} screenWidth={W} pixelWidth={VIDEO_PIXELS} />
        </div>
      </PhoneFrame>
    </SceneShell>
  );
};
