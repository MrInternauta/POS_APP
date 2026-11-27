import { expect, test } from 'vitest';
import { fingerPosition } from './FingerDot';
import type { GestureEvent } from '../gestures';

const events: GestureEvent[] = [
  { t: 1, kind: 'tap', x: 100, y: 200 },
  { t: 7.81, kind: 'swipe', x: 154, y: 1476 },
  { t: 8.86, kind: 'done', x: 390, y: 844 },
];

test('rides the charge slider to its end', () => {
  expect(fingerPosition(events, 8.86)).toEqual({ x: 690, y: 1476 });
});

test('stays at the end of the slider after the sale is saved', () => {
  expect(fingerPosition(events, 9.2)).toEqual({ x: 690, y: 1476 });
});

test('holds on a tap until the next gesture', () => {
  expect(fingerPosition(events, 3)).toEqual({ x: 100, y: 200 });
});
