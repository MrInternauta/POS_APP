import React from 'react';
import { COLORS } from '../theme';

// A plain, drawn phone frame — no manufacturer design. Rounded dark bezel around the screen.
export const PhoneFrame: React.FC<{
  width: number;
  children: React.ReactNode;
  bezel?: number;
  borderRadius?: number;
}> = ({ width, children, bezel = 18, borderRadius = 64 }) => {
  return (
    <div
      style={{
        width,
        padding: bezel,
        borderRadius,
        background: `linear-gradient(160deg, ${COLORS.slate}, #16202e 60%, #0a0f18)`,
        boxShadow: '0 40px 90px rgba(0,0,0,0.55), 0 0 0 2px rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: borderRadius - bezel,
          background: '#000',
          lineHeight: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};
