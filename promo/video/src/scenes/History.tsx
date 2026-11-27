import React from 'react';
import { Caption } from '../components/Caption';
import { PhoneFrame } from '../components/PhoneFrame';
import { Faded, SceneShell, ScreenShot } from './shared';

const W = 390;
const H = Math.round((W * 2532) / 1170);

// History list, then the detail of one sale.
export const History: React.FC<{ caption: string }> = ({ caption }) => {
  return (
    <SceneShell caption={<Caption text={caption} />}>
      <PhoneFrame width={W + 36}>
        <div style={{ position: 'relative', width: W, height: H }}>
          <Faded from={0} duration={1}>
            <ScreenShot src="historial.png" width={W} pan="left" />
          </Faded>
          <Faded from={70}>
            <ScreenShot src="detalle.png" width={W} pan="right" />
          </Faded>
        </div>
      </PhoneFrame>
    </SceneShell>
  );
};
