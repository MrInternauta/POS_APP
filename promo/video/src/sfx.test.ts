import { expect, test } from 'vitest';
import { sfxCues, SFX_FILES } from './sfx';
import { SCENES } from './timeline';
import type { GestureEvent } from './gestures';

const events: GestureEvent[] = [
  { t: 1, kind: 'swipe', x: 0, y: 0 },
  { t: 2, kind: 'tap', x: 0, y: 0 },
  { t: 6.64, kind: 'tap', x: 0, y: 0 },
  { t: 7.81, kind: 'swipe', x: 0, y: 0 },
  { t: 8.86, kind: 'done', x: 0, y: 0 },
];

test('a click on every gesture of the sale, placed inside the sale scene', () => {
  const clicks = sfxCues(events, SCENES).filter(
    (c) => c.file === SFX_FILES.click,
  );
  expect(clicks.map((c) => c.frame)).toEqual([120, 150, 289, 324]);
});

test('a chime when the sale is saved', () => {
  const chimes = sfxCues(events, SCENES).filter(
    (c) => c.file === SFX_FILES.chime,
  );
  expect(chimes.map((c) => c.frame)).toEqual([356]);
});

test('a whoosh on every scene change, none at the very start', () => {
  const whooshes = sfxCues(events, SCENES).filter(
    (c) => c.file === SFX_FILES.whoosh,
  );
  expect(whooshes.map((c) => c.frame)).toEqual([90, 390, 540, 750]);
});

test('every cue is quiet (volume at most 0.5) and in time order', () => {
  const cues = sfxCues(events, SCENES);
  expect(cues.every((c) => c.volume > 0 && c.volume <= 0.5)).toBe(true);
  expect(cues.map((c) => c.frame)).toEqual(
    [...cues.map((c) => c.frame)].sort((a, b) => a - b),
  );
});

test('gestures after the sale scene ends are dropped', () => {
  const late: GestureEvent[] = [{ t: 10.5, kind: 'tap', x: 0, y: 0 }];
  expect(
    sfxCues(late, SCENES).filter((c) => c.file === SFX_FILES.click),
  ).toEqual([]);
});

test('only the licensed local files are used', () => {
  expect(Object.values(SFX_FILES).sort()).toEqual([
    'sfx/chime.wav',
    'sfx/click.wav',
    'sfx/whoosh.wav',
  ]);
});
