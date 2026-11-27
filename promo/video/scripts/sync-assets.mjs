// Copies the assets the video needs into public/ under logical names, so the
// scenes never reference ../screenshots paths directly. Fails loudly — naming
// every missing file — rather than letting a scene render a black phone.
//
// Sources root at promo/ by default; PROMO_SRC overrides it (tests use a temp dir).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.PROMO_SRC ?? path.join(DIR, '..', '..');
const OUT = process.env.PROMO_OUT ?? path.join(DIR, '..', 'public');

// logical name -> { source, copy }. copy:false entries already live in
// video/public/ (record.js, Task 3, writes them there): only their existence is
// checked, since source and destination are the same file.
const ASSETS = {
  'productos.png': { source: 'screenshots/01-productos.png', copy: true },
  'agregar.png': { source: 'screenshots/02-agregar-al-carrito.png', copy: true },
  'carrito.png': { source: 'screenshots/03-carrito.png', copy: true },
  'historial.png': { source: 'screenshots/04-historial.png', copy: true },
  'detalle.png': { source: 'screenshots/05-detalle-venta.png', copy: true },
  'equipo.png': { source: 'screenshots/06-equipo.png', copy: true },
  'clientes.png': { source: 'screenshots/07-clientes.png', copy: true },
  'catalogo.png': { source: 'screenshots/08-catalogo-publico.png', copy: true },
  'icon.png': { source: 'playstore/icon-512x512.png', copy: true },
  'sale.mp4': { source: 'video/public/sale.mp4', copy: false },
  'sale-events.json': { source: 'video/public/sale-events.json', copy: false },
  'sfx/click.wav': { source: 'video/public/sfx/click.wav', copy: false },
  'sfx/whoosh.wav': { source: 'video/public/sfx/whoosh.wav', copy: false },
  'sfx/chime.wav': { source: 'video/public/sfx/chime.wav', copy: false },
};

fs.mkdirSync(OUT, { recursive: true });

const missing = [];
for (const [logical, { source, copy }] of Object.entries(ASSETS)) {
  const from = path.join(ROOT, source);
  if (!fs.existsSync(from)) {
    missing.push(source);
    continue;
  }
  if (copy) {
    fs.copyFileSync(from, path.join(OUT, logical));
    console.log(`${source} -> public/${logical}`);
  } else {
    console.log(`${source} ok`);
  }
}

if (missing.length) {
  console.error(`missing assets: ${missing.join(', ')}`);
  process.exit(1);
}
