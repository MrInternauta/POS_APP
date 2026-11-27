export const FPS = 30;

export interface Scene {
  id: 'intro' | 'sale' | 'history' | 'store' | 'outro';
  from: number;
  durationInFrames: number;
  caption?: string | string[];
}

export const SCENES: Scene[] = [
  { id: 'intro', from: 0, durationInFrames: 90, caption: 'Vende en segundos.' },
  {
    id: 'sale',
    from: 90,
    durationInFrames: 300,
    caption: ['Desliza para agregar', 'Cobra en un toque'],
  },
  {
    id: 'history',
    from: 390,
    durationInFrames: 150,
    caption: 'Todas tus ventas, al día.',
  },
  {
    id: 'store',
    from: 540,
    durationInFrames: 210,
    caption: 'Tu equipo, tus clientes y tu catálogo en línea.',
  },
  { id: 'outro', from: 750, durationInFrames: 150 },
];

export const TOTAL_FRAMES = SCENES.reduce(
  (end, s) => Math.max(end, s.from + s.durationInFrames),
  0,
);
