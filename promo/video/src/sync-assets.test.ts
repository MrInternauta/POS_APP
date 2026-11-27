import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { expect, test } from 'vitest';

const SYNC = path.join(__dirname, '..', 'scripts', 'sync-assets.mjs');

const run = (env: NodeJS.ProcessEnv) => {
  env.PROMO_OUT =
    env.PROMO_OUT ?? fs.mkdtempSync(path.join(os.tmpdir(), 'promo-out-'));
  try {
    execFileSync('node', [SYNC], { env, stdio: 'pipe' });
    return { status: 0, stderr: '' };
  } catch (e: any) {
    return { status: e.status ?? 1, stderr: String(e.stderr) };
  }
};

test('fails and names the missing file against an empty source dir', () => {
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'promo-empty-'));
  const { status, stderr } = run({ ...process.env, PROMO_SRC: empty });
  expect(status).not.toBe(0);
  expect(stderr).toContain('missing assets');
  expect(stderr).toContain('screenshots/01-productos.png');
});

test('names sale.mp4 when only the recording is missing', () => {
  // Every screenshot and the icon, no video/public/ — a missing recording fails the same way
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'promo-nosale-'));
  for (const dir of ['screenshots', 'playstore'])
    fs.mkdirSync(path.join(root, dir), { recursive: true });
  for (const f of [
    'screenshots/01-productos.png',
    'screenshots/02-agregar-al-carrito.png',
    'screenshots/03-carrito.png',
    'screenshots/04-historial.png',
    'screenshots/05-detalle-venta.png',
    'screenshots/06-equipo.png',
    'screenshots/07-clientes.png',
    'screenshots/08-catalogo-publico.png',
    'playstore/icon-512x512.png',
  ])
    fs.writeFileSync(path.join(root, f), 'x');
  const { status, stderr } = run({ ...process.env, PROMO_SRC: root });
  expect(status).not.toBe(0);
  expect(stderr).toContain('video/public/sale.mp4');
});
