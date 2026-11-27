const test = require('node:test');
const assert = require('node:assert/strict');
const { assertLocalDatabase } = require('../lib/local-db');

test('accepts localhost URLs', () => {
  for (const u of ['postgres://u:p@localhost:5432/pos', 'postgres://u:p@127.0.0.1/pos', 'postgres://u:p@[::1]/pos'])
    assert.doesNotThrow(() => assertLocalDatabase(u));
});

test('refuses remote hosts', () => {
  assert.throws(() => assertLocalDatabase('postgres://u:p@ep-x.neon.tech/pos'), /non-local database: ep-x.neon.tech/);
});

test('refuses empty or malformed URLs', () => {
  assert.throws(() => assertLocalDatabase(''));
  assert.throws(() => assertLocalDatabase('not a url'));
});
