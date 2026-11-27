// Rebuilds the demo store the promo material is captured from, the same way every run.
//
//   node seed.js            (backend running at localhost:3000, its .env pointing at a local database)
//
// Reset (SQL, one transaction): stores whose members are all demo accounts (@pos.local) are deleted
// with everything in them; demo accounts are kept but leave any other store and stop being super
// admins, so the app shows them a single store. Then the store is recreated through the API.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { Client } = require('pg');
const { assertLocalDatabase, assertLocalApi } = require('./lib/local-db');
const { OWNER, CASHIER, TEAM, STORE, CUSTOMERS, PRODUCTS, ORDERS } = require('./demo-data');

const API = process.env.PROMO_API || 'http://localhost:3000/api';
const BACKEND_ENV = path.join(__dirname, '../../../POS-Nest/.env');
// Pillow is installed for the system Python here, not Homebrew's
const PYTHON = process.env.PROMO_PYTHON || '/usr/bin/python3';
const DEMO_EMAILS = "email LIKE 'demo.%@pos.local'";

function databaseUrl() {
  // Always the backend's own .env: the SQL reset must hit the same database the API writes to
  const line = fs
    .readFileSync(BACKEND_ENV, 'utf8')
    .split('\n')
    .find(l => l.startsWith('DATABASE_URL='));
  if (!line) throw new Error(`No DATABASE_URL in ${BACKEND_ENV}`);
  return line.slice('DATABASE_URL='.length).trim();
}

async function api(method, route, { token, body, form } = {}) {
  const headers = token ? { authorization: `Bearer ${token}` } : {};
  if (body) headers['content-type'] = 'application/json';
  const res = await fetch(`${API}/${route}`, { method, headers, body: form || (body && JSON.stringify(body)) });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const err = new Error(`${method} /${route} → ${res.status} ${JSON.stringify(data.message ?? data)}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const login = (p, storeId) =>
  api('POST', 'auth', { body: { email: p.email, password: p.password } }).then(r =>
    storeId === undefined ? r : api('POST', 'auth/switch', { token: r.access_token, body: { storeId } })
  );

async function reset(db) {
  await db.query('BEGIN');
  try {
    const { rows } = await db.query(`
      SELECT s.id FROM store s
      WHERE EXISTS (SELECT 1 FROM store_member m WHERE m.id_store = s.id)
        AND NOT EXISTS (SELECT 1 FROM store_member m JOIN "user" u ON u.id = m.id_user
                        WHERE m.id_store = s.id AND NOT u.${DEMO_EMAILS})`);
    const stores = rows.map(r => r.id);
    if (stores.length) {
      const q = sql => db.query(sql, [stores]);
      await q(`DELETE FROM order_item WHERE "orderId" IN (SELECT id FROM "order" WHERE id_store = ANY($1))`);
      await q(`DELETE FROM "order" WHERE id_store = ANY($1)`);
      await q(`DELETE FROM customer WHERE id_store = ANY($1)`);
      await q(`DELETE FROM products WHERE id_store = ANY($1)`);
      await q(`DELETE FROM category WHERE id_store = ANY($1)`);
      await q(`DELETE FROM provider WHERE id_store = ANY($1)`);
      await q(`DELETE FROM store WHERE id = ANY($1)`); // store_member cascades
    }
    await db.query(`DELETE FROM store_member WHERE id_user IN (SELECT id FROM "user" WHERE ${DEMO_EMAILS})`);
    await db.query(`UPDATE "user" SET "isSuperAdmin" = false WHERE ${DEMO_EMAILS}`);
    // Accounts left from an earlier seed keep their old names otherwise (the team screen shows them)
    for (const p of [OWNER, CASHIER, ...TEAM])
      await db.query(`UPDATE "user" SET name = $2, "lastName" = $3 WHERE email = $1`, [p.email, p.name, p.lastName]);
    await db.query('COMMIT');
  } catch (e) {
    await db.query('ROLLBACK');
    throw e;
  }
}

async function ownerToken() {
  try {
    return (await login(OWNER)).access_token;
  } catch (e) {
    if (e.status !== 401) throw e;
    await api('POST', 'users', { body: { ...OWNER, phone: STORE.phone } });
    return (await login(OWNER)).access_token;
  }
}

async function uploadThumbs(token, products) {
  const input = path.join(__dirname, 'thumbs-input.json');
  fs.writeFileSync(input, JSON.stringify(products.map(p => ({ id: p.id, name: p.name }))));
  execFileSync(PYTHON, [path.join(__dirname, 'thumbs.py'), input], { stdio: 'ignore' });
  for (const p of products) {
    const form = new FormData();
    const png = fs.readFileSync(path.join(__dirname, 'thumbs', `${p.id}.png`));
    form.append('file', new Blob([png], { type: 'image/png' }), `${p.id}.png`);
    await api('POST', `image/product/${p.id}`, { token, form });
  }
}

async function main() {
  const url = databaseUrl();
  assertLocalApi(API);
  assertLocalDatabase(url);
  const db = new Client({ connectionString: url });
  await db.connect();
  try {
    await reset(db);

    const created = await api('POST', 'stores', { token: await ownerToken(), body: STORE });
    const owner = created.access_token;
    const store = created.store;

    for (const m of [CASHIER, ...TEAM]) {
      await api('POST', 'stores/current/members', { token: owner, body: m });
      await login(m, store.id); // an existing demo account with another password fails here, loudly
    }

    const customers = [];
    for (const c of CUSTOMERS) customers.push((await api('POST', 'customers', { token: owner, body: c })).customer);

    const products = [];
    for (const p of PRODUCTS) products.push((await api('POST', 'products', { token: owner, body: p })).product);
    await uploadThumbs(owner, products);

    // The cashier makes the past sales: a cashier's history only lists their own
    const cashier = (await login(CASHIER, store.id)).access_token;
    for (const o of ORDERS) {
      const { order } = await api('POST', 'orders', {
        token: cashier,
        body: {
          ...(o.customer === null ? {} : { customerId: customers[o.customer].id }),
          items: o.items.map(i => ({ productId: products[i.product].id, quantity: i.quantity })),
        },
      });
      // Earlier days: somewhere in the store's opening hours (9:00–18:00 Mexico City). Today: a little before now
      const sql =
        o.daysAgo === 0
          ? `UPDATE "order" SET created_at = now() - make_interval(mins => $2) WHERE id = $1`
          : `UPDATE "order" SET created_at = (date_trunc('day', now() AT TIME ZONE 'America/Mexico_City') - make_interval(days => $3) + make_interval(mins => $2)) AT TIME ZONE 'America/Mexico_City'
             WHERE id = $1`;
      const minutes = o.daysAgo === 0 ? 15 + ((order.id * 37) % 90) : 9 * 60 + ((order.id * 37) % (9 * 60));
      await db.query(sql, o.daysAgo === 0 ? [order.id, minutes] : [order.id, minutes, o.daysAgo]);
    }

    const members = (await api('GET', 'stores/current/members', { token: owner })).members;
    console.log(
      `seeded store ${store.slug}: ${products.length} products, ${customers.length} customers, ` +
        `${ORDERS.length} orders, ${members.length} members`
    );
  } finally {
    await db.end();
  }
}

main().catch(e => {
  console.error('FAILED', e.message);
  process.exit(1);
});
