import React from 'react';
import { Caption } from '../components/Caption';
import { PhoneFrame } from '../components/PhoneFrame';
import { Faded, SceneShell, ScreenShot } from './shared';

const W = 390;
const H = Math.round((W * 2532) / 1170);

// Mi tienda: quick cuts between Equipo, Clientes and the public catalogue.
export const Store: React.FC<{ caption: string }> = ({ caption }) => {
  return (
    <SceneShell caption={<Caption text={caption} />}>
      <PhoneFrame width={W + 36}>
        <div style={{ position: 'relative', width: W, height: H }}>
          <Faded from={0} duration={1}>
            <ScreenShot src="equipo.png" width={W} pan="left" />
          </Faded>
          <Faded from={62}>
            <ScreenShot src="clientes.png" width={W} pan="right" />
          </Faded>
          <Faded from={132}>
            <ScreenShot src="catalogo.png" width={W} pan="in" />
          </Faded>
        </div>
      </PhoneFrame>
    </SceneShell>
  );
};
