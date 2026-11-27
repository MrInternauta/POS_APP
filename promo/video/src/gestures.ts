// Scripted finger path for the Sale scene — the fallback used before the real
// recording existed. Same {t, kind, x, y} shape as sale-events.json (record.js,
// Task 3), which is what the scene uses when public/sale.mp4 is present.
// Coordinates are in screenshot pixels (1170×2532).
export interface GestureEvent {
  t: number; // seconds inside the scene
  kind: 'swipe' | 'lift' | 'tap' | 'done'; // swipe: a drag starts; lift: it ends; done: the sale is saved
  x: number;
  y: number;
}

export const GESTURES: GestureEvent[] = [
  // Drag the ARROZ row rightward to reveal "Agregar al carrito"
  { t: 1.2, kind: 'swipe', x: 660, y: 985 },
  { t: 1.55, kind: 'swipe', x: 880, y: 985 },
  { t: 1.9, kind: 'swipe', x: 1095, y: 985 },
  // Tap the green "Agregar al carrito" panel
  { t: 2.5, kind: 'tap', x: 347, y: 988 },
  // Slide "Desliza para guardar la venta" across
  { t: 5.9, kind: 'swipe', x: 200, y: 2196 },
  { t: 6.3, kind: 'swipe', x: 560, y: 2196 },
  { t: 6.7, kind: 'swipe', x: 960, y: 2196 },
  // The charge lands — the caption switches on this tap
  { t: 7.0, kind: 'tap', x: 960, y: 2196 },
];
