import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import type { SfxCue } from '../sfx';

// Plays each cue from its frame to the end of its own sound
export const Sfx: React.FC<{ cues: SfxCue[] }> = ({ cues }) => (
  <>
    {cues.map((c, i) => (
      <Sequence key={i} from={c.frame} name={`sfx ${c.file.replace('sfx/', '')}`} layout="none">
        <Audio src={staticFile(c.file)} volume={c.volume} />
      </Sequence>
    ))}
  </>
);
