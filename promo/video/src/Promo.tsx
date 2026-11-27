import React from 'react';
import { Sequence } from 'remotion';
import { SCENES } from './timeline';
import { History } from './scenes/History';
import { Intro } from './scenes/Intro';
import { Outro } from './scenes/Outro';
import { Sale } from './scenes/Sale';
import { Store } from './scenes/Store';
import { Sfx } from './components/Sfx';
import { sfxCues } from './sfx';
import type { GestureEvent } from './gestures';
import events from '../public/sale-events.json';

const CUES = sfxCues(events as GestureEvent[], SCENES);

const asText = (caption?: string | string[]) => (Array.isArray(caption) ? caption.join(' ') : caption ?? '');

export const Promo: React.FC = () => {
  return (
    <>
      {SCENES.map((scene) => (
        <Sequence key={scene.id} from={scene.from} durationInFrames={scene.durationInFrames}>
          {scene.id === 'intro' && <Intro caption={asText(scene.caption)} />}
          {scene.id === 'sale' && <Sale captions={scene.caption as string[]} />}
          {scene.id === 'history' && <History caption={asText(scene.caption)} />}
          {scene.id === 'store' && <Store caption={asText(scene.caption)} />}
          {scene.id === 'outro' && <Outro />}
        </Sequence>
      ))}
      <Sfx cues={CUES} />
    </>
  );
};
