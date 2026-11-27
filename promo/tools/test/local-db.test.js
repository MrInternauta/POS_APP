const test = require('node:test');
const assert = require('node:assert/strict');
const { assertLocalDatabase, assertLocalApi } = require('../lib/local-db');

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

test('refuses a local URL whose ?host= points elsewhere', () => {
  assert.throws(
    () => assertLocalDatabase('postgres://u:p@localhost:5432/db?host=ep-x.neon.tech'),
    /non-local database: ep-x.neon.tech/
  );
  assert.throws(() => assertLocalDatabase('postgres://u:p@localhost/db?hostaddr=10.0.0.5'), /non-local/);
});

test('accepts only a local API', () => {
  assert.doesNotThrow(() => assertLocalApi('http://localhost:3000/api'));
  assert.doesNotThrow(() => assertLocalApi('http://127.0.0.1:3000/api'));
  assert.throws(
    () => assertLocalApi('https://pos-nest-orcin.vercel.app/api'),
    /non-local API: pos-nest-orcin.vercel.app/
  );
});
