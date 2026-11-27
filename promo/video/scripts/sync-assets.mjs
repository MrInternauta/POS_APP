// Copies the assets the video needs into public/ under logical names, so the
// scenes never reference ../screenshots paths directly. Fails loudly — naming
// every missing file — rather than letting a scene render a black phone.
//
// Sources root at promo/ by default; PROMO_SRC overrides it (tests use a temp dir).
//
// Once Task 3 lands, 'sale.mp4' and 'sale-events.json' join this map and the
// Sale scene swaps the productos→agregar→carrito stills for the real recording.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.PROMO_SRC ?? path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

const ASSETS = {
  'productos.png': 'screenshots/01-productos.png',
  'agregar.png': 'screenshots/02-agregar-al-carrito.png',
  'carrito.png': 'screenshots/03-carrito.png',
  'historial.png': 'screenshots/04-historial.png',
  'detalle.png': 'screenshots/05-detalle-venta.png',
  'equipo.png': 'screenshots/06-equipo.png',
  'clientes.png': 'screenshots/07-clientes.png',
  'catalogo.png': 'screenshots/08-catalogo-publico.png',
  'icon.png': 'playstore/icon-512x512.png',
  // Pending from Task 3: 'sale.mp4': 'video/public/sale.mp4' (copied in place by record.js),
  // 'sale-events.json': 'video/public/sale-events.json',
};

fs.mkdirSync(OUT, { recursive: true });

const missing = [];
for (const [logical, source] of Object.entries(ASSETS)) {
  const from = path.join(ROOT, source);
  if (!fs.existsSync(from)) {
    missing.push(source);
    continue;
  }
  fs.copyFileSync(from, path.join(OUT, logical));
  console.log(`${source} -> public/${logical}`);
}

if (missing.length) {
  console.error(`missing assets: ${missing.join(', ')}`);
  process.exit(1);
}
