import { FPS, type Scene } from './timeline';
import type { GestureEvent } from './gestures';

// Licensed local files in public/sfx (sources and licenses in promo/README.md)
export const SFX_FILES = {
  click: 'sfx/click.wav',
  whoosh: 'sfx/whoosh.wav',
  chime: 'sfx/chime.wav',
} as const;

export interface SfxCue {
  frame: number; // absolute frame in the PlayPromo composition
  file: (typeof SFX_FILES)[keyof typeof SFX_FILES];
  volume: number;
}

// A soft click on every recorded gesture, a chime when the sale is saved, and a whoosh on every
// scene change. Kept quiet: the video has no music and should not startle.
export function sfxCues(events: GestureEvent[], scenes: Scene[]): SfxCue[] {
  const sale = scenes.find((s) => s.id === 'sale');
  const cues: SfxCue[] = [];

  if (sale) {
    for (const e of events) {
      const offset = Math.round(e.t * FPS);
      if (offset < 0 || offset >= sale.durationInFrames) continue;
      if (e.kind === 'lift') continue; // the click is when the finger goes down
      cues.push(
        e.kind === 'done'
          ? { frame: sale.from + offset, file: SFX_FILES.chime, volume: 0.45 }
          : { frame: sale.from + offset, file: SFX_FILES.click, volume: 0.35 },
      );
    }
  }

  for (const s of scenes)
    if (s.from > 0)
      cues.push({ frame: s.from, file: SFX_FILES.whoosh, volume: 0.3 });

  return cues.sort((a, b) => a.frame - b.frame);
}
