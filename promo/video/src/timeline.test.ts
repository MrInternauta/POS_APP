import { expect, test } from 'vitest';
import { SCENES, TOTAL_FRAMES, FPS } from './timeline';

test('scenes follow the storyboard', () => {
  expect(SCENES.map((s) => [s.id, s.from, s.durationInFrames])).toEqual([
    ['intro', 0, 90],
    ['sale', 90, 300],
    ['history', 390, 150],
    ['store', 540, 210],
    ['outro', 750, 150],
  ]);
  expect(TOTAL_FRAMES).toBe(900);
  expect(FPS).toBe(30);
});

test('captions are the spec copy', () => {
  const caption = (id: string) => SCENES.find((s) => s.id === id)!.caption;
  expect(caption('intro')).toBe('Vende en segundos.');
  expect(caption('sale')).toEqual([
    'Desliza para agregar',
    'Cobra en un toque',
  ]);
  expect(caption('history')).toBe('Todas tus ventas, al día.');
  expect(caption('store')).toBe(
    'Tu equipo, tus clientes y tu catálogo en línea.',
  );
});
