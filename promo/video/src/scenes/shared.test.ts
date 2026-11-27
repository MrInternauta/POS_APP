import { expect, test } from 'vitest';
import { screenTransform } from './shared';

// Percent of the screenshot's width lost at the left and right edges for a given transform
// (scale around the horizontal centre, then translateX in % of the element width)
const lost = ({ scale, tx }: { scale: number; tx: number }) => ({
  left: ((scale - 1) / 2) * 100 + tx * scale,
  right: ((scale - 1) / 2) * 100 - tx * scale,
});

test('the slow zoom/pan never crops more than 1.5% off either edge (keeps "Cerrar" readable)', () => {
  for (const pan of ['in', 'left', 'right'] as const)
    for (let frame = 0; frame <= 300; frame += 10) {
      const l = lost(screenTransform(frame, pan));
      expect(l.left).toBeLessThanOrEqual(1.5);
      expect(l.right).toBeLessThanOrEqual(1.5);
    }
});

test('the pan never uncovers a gap beside the screenshot', () => {
  for (const pan of ['in', 'left', 'right'] as const)
    for (let frame = 0; frame <= 300; frame += 10) {
      const l = lost(screenTransform(frame, pan));
      expect(l.left).toBeGreaterThanOrEqual(-1e-9);
      expect(l.right).toBeGreaterThanOrEqual(-1e-9);
    }
});

test('it still moves', () => {
  expect(screenTransform(300, 'in').scale).toBeGreaterThan(
    screenTransform(0, 'in').scale,
  );
  expect(screenTransform(300, 'left').tx).not.toBe(
    screenTransform(0, 'left').tx,
  );
});
