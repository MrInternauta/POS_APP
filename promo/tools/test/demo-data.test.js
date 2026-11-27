const test = require('node:test');
const assert = require('node:assert/strict');
const { OWNER, CASHIER, TEAM, CUSTOMERS, PRODUCTS, ORDERS } = require('../demo-data');

test('eight public products, at least twelve in total', () => {
  assert.ok(PRODUCTS.length >= 12);
  assert.equal(PRODUCTS.filter(p => p.isPublic).length, 8);
});

test('orders only point at real products and customers (null: the built-in walk-in customer)', () => {
  for (const o of ORDERS) {
    assert.ok(o.customer === null || CUSTOMERS[o.customer]);
    for (const i of o.items) assert.ok(PRODUCTS[i.product] && i.quantity > 0);
  }
});

test('demo emails are all @pos.local and distinct', () => {
  const emails = [OWNER, CASHIER, ...TEAM].map(p => p.email);
  assert.ok(emails.every(e => e.endsWith('@pos.local')));
  assert.equal(new Set(emails).size, emails.length);
});

test("no demo customer duplicates the app's built-in walk-in customer", () => {
  assert.ok(!CUSTOMERS.some(c => /^p[úu]blico/i.test(c.name)));
});

test('some sales go to the walk-in customer', () => {
  assert.ok(ORDERS.some(o => o.customer === null));
});
