import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { expect, test } from 'vitest';

const SYNC = path.join(__dirname, '..', 'scripts', 'sync-assets.mjs');

test('fails and names the missing file against an empty source dir', () => {
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'promo-empty-'));
  let stderr = '';
  try {
    execFileSync('node', [SYNC], {
      env: { ...process.env, PROMO_SRC: empty },
      stdio: 'pipe',
    });
    expect.unreachable('sync should exit non-zero');
  } catch (e: any) {
    expect(e.status).not.toBe(0);
    stderr = String(e.stderr);
  }
  expect(stderr).toContain('missing assets');
  expect(stderr).toContain('screenshots/01-productos.png');
});
