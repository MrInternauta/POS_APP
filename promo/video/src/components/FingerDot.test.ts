import { expect, test } from 'vitest';
import { fingerPosition } from './FingerDot';
import type { GestureEvent } from '../gestures';

const events: GestureEvent[] = [
  { t: 1, kind: 'swipe', x: 112, y: 369 },
  { t: 1.42, kind: 'lift', x: 512, y: 369 },
  { t: 2, kind: 'tap', x: 201, y: 369 },
  { t: 7.81, kind: 'swipe', x: 154, y: 1476 },
  { t: 8.51, kind: 'lift', x: 700, y: 1476 },
  { t: 8.86, kind: 'done', x: 390, y: 844 },
];

test('follows a drag from where it starts to where the finger lifts', () => {
  expect(fingerPosition(events, 1)).toEqual({ x: 112, y: 369 });
  expect(fingerPosition(events, 1.42)).toEqual({ x: 512, y: 369 });
  const mid = fingerPosition(events, 1.21).x;
  expect(mid).toBeGreaterThan(112);
  expect(mid).toBeLessThan(512);
});

test('holds where it lifted until the next tap', () => {
  expect(fingerPosition(events, 1.8)).toEqual({ x: 512, y: 369 });
  expect(fingerPosition(events, 2.1)).toEqual({ x: 201, y: 369 });
});

test('ends at the end of the charge slide and stays there after the sale is saved', () => {
  expect(fingerPosition(events, 8.51)).toEqual({ x: 700, y: 1476 });
  expect(fingerPosition(events, 9.2)).toEqual({ x: 700, y: 1476 });
});
