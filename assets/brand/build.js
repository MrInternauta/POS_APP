// Builds every Mini POS icon, splash and logo from one storefront drawing (the 2024 icon,
// assets/legacy/icon-storefront-432.png, redrawn as a vector on the app's purple).
//
// Usage: node assets/brand/build.js assets/brand/out
//   then copy icon-only, icon-foreground, icon-background, splash and splash-dark into assets/
//   and run `npx @capacitor/assets generate --android --ios`, then set the two android:inset values in
//   android/.../mipmap-anydpi-v26/ic_launcher*.xml back to 0% (the foreground is already drawn inside the
//   safe zone, the tool's 16.7% inset shrinks it a second time); the logo-* and icon-rounded-* files
//   go to src/assets (see the commit that added this script). Jost is under the SIL Open Font License.
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');
const sharp = require('sharp');

const out = process.argv[2] || 'out';
fs.mkdirSync(out, { recursive: true });

const PURPLE = '#8231D3'; // tailwind primary
const INDIGO = '#5840FF'; // tailwind secondary
const CORAL = '#FF6A4D';
const CORAL_DARK = '#E9543A';
const CREAM = '#FFFFFF';
const CREAM_DARK = '#E7DDF6';
const WALL = '#FFFFFF';
const GLASS = '#E4D6F8';
const GLASS_SHINE = '#F3ECFC';

const gradient = id => `
  <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${PURPLE}"/>
    <stop offset="1" stop-color="${INDIGO}"/>
  </linearGradient>`;

// Storefront on a 1024 grid, centred on (512, 512), about 520 wide and 470 tall
function storefront() {
  const left = 252,
    right = 772,
    awningTop = 282,
    awningBottom = 392,
    r = 52;
  const stripes = 5,
    w = (right - left) / stripes;
  let awning = '';
  for (let i = 0; i < stripes; i++) {
    const x = left + i * w;
    const even = i % 2 === 0;
    const first = i === 0,
      last = i === stripes - 1;
    // top band of the stripe, rounded at the two outer corners
    const tl = first ? 18 : 0,
      tr = last ? 18 : 0;
    awning += `<path d="M${x} ${awningBottom}V${awningTop + tl}${tl ? `q0 -${tl} ${tl} -${tl}` : ''}H${x + w - tr}${tr ? `q${tr} 0 ${tr} ${tr}` : ''}V${awningBottom}Z" fill="${even ? CORAL : CREAM}"/>`;
    // scallop under it
    awning += `<path d="M${x} ${awningBottom}a${w / 2} ${r} 0 0 0 ${w} 0Z" fill="${even ? CORAL_DARK : CREAM_DARK}"/>`;
  }
  const wallLeft = 290,
    wallRight = 734,
    wallTop = 380,
    wallBottom = 744;
  return `
  <g>
    <rect x="${wallLeft}" y="${wallTop}" width="${wallRight - wallLeft}" height="${wallBottom - wallTop}" rx="28" fill="${WALL}"/>
    <rect x="336" y="486" width="164" height="140" rx="16" fill="${GLASS}"/>
    <path d="M352 610L420 502H448L380 610Z" fill="${GLASS_SHINE}"/>
    <path d="M548 744V502q0-16 16-16h108q16 0 16 16V744Z" fill="${PURPLE}"/>
    <circle cx="660" cy="620" r="9" fill="${GLASS}"/>
    ${awning}
  </g>`;
}

// Full-bleed tile: gradient square with the storefront, corners rounded by `radius` (0 = square)
const tile = (
  size,
  radius
) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">
  <defs>${gradient('g')}</defs>
  <rect width="1024" height="1024" rx="${radius}" fill="url(#g)"/>
  ${storefront()}
</svg>`;

// Adaptive icon layers: Android masks them, the foreground must stay inside the central 66%
const foreground = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <g transform="translate(512 512) scale(0.78) translate(-512 -512)">${storefront()}</g>
</svg>`;
const background = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>${gradient('g')}</defs><rect width="1024" height="1024" fill="url(#g)"/>
</svg>`;

// Splash: the tile in the middle of a plain field
const splash = bg => `<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732" viewBox="0 0 2732 2732">
  <rect width="2732" height="2732" fill="${bg}"/>
  <g transform="translate(1066 1066) scale(0.586)">
    <defs>${gradient('s')}</defs>
    <rect width="1024" height="1024" rx="230" fill="url(#s)"/>
    ${storefront()}
  </g>
</svg>`;

// Wordmark: tile + "MiniPOS" in Jost SemiBold, the letters as outlines so no font has to load
const font = opentype.loadSync(path.join(__dirname, 'jost-600.woff'));
function wordmark(textColor, accent) {
  const height = 40,
    fontSize = 26,
    gap = 10;
  const mini = font.getPath('Mini', 0, 0, fontSize);
  const miniWidth = font.getAdvanceWidth('Mini', fontSize);
  const box = font.getPath('MiniPOS', 0, 0, fontSize).getBoundingBox();
  const textWidth = box.x2;
  const x = height + gap;
  // baseline placed so the cap height sits in the middle of the tile
  const capHeight = (font.tables.os2.sCapHeight / font.unitsPerEm) * fontSize;
  const baseline = height / 2 + capHeight / 2;
  const miniPath = font.getPath('Mini', x, baseline, fontSize).toPathData(2);
  const posPath = font.getPath('POS', x + miniWidth, baseline, fontSize).toPathData(2);
  const width = Math.ceil(x + textWidth + 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Mini POS">
  <defs>${gradient('w')}</defs>
  <g transform="scale(${height / 1024})">
    <rect width="1024" height="1024" rx="236" fill="url(#w)"/>
    ${storefront()}
  </g>
  <path d="${miniPath}" fill="${textColor}"/>
  <path d="${posPath}" fill="${accent}"/>
</svg>`;
}

async function png(svg, file, size) {
  await sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toFile(path.join(out, file));
}

(async () => {
  const files = {
    'icon.svg': tile(1024, 230),
    'logo-dark.svg': wordmark('#0A0A0A', PURPLE),
    'logo-white.svg': wordmark('#FFFFFF', '#C39BF5'),
  };
  for (const [name, svg] of Object.entries(files)) fs.writeFileSync(path.join(out, name), svg);

  await png(tile(1024, 0), 'icon-only.png', 1024);
  await png(foreground, 'icon-foreground.png', 1024);
  await png(background, 'icon-background.png', 1024);
  await sharp(Buffer.from(splash('#FFFFFF')))
    .png()
    .toFile(path.join(out, 'splash.png'));
  await sharp(Buffer.from(splash('#0A0A12')))
    .png()
    .toFile(path.join(out, 'splash-dark.png'));
  await png(tile(1024, 230), 'icon-rounded-432.png', 432);
  await png(tile(1024, 230), 'icon-rounded-512.png', 512);
  for (const name of ['logo-dark', 'logo-white']) {
    const svg = files[`${name}.svg`];
    const meta = await sharp(Buffer.from(svg)).metadata();
    // 3x for crisp phones, wherever the png is still referenced
    await sharp(Buffer.from(svg), { density: 72 * 3 })
      .resize(meta.width * 3, meta.height * 3)
      .png()
      .toFile(path.join(out, `${name}.png`));
  }
  console.log(fs.readdirSync(out).join('\n'));
})();
