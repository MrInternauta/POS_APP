// Phone screenshots of the demo store (run `node seed.js` first).
//   node shoot.js [outDir]     → 00-login … 08-catalogo-publico, 1170×2532
// The selling screens are taken as the cashier (4 tabs), the "Mi tienda" ones as the owner.
const path = require('path');
const fs = require('fs');
const { sleep, launch, settled, go, tab, login, clickItem } = require('./lib/session');
const { OWNER, CASHIER } = require('./demo-data');

const OUT = process.argv[2] || path.join(__dirname, 'shots');
const CART_ROW = 'ion-card ion-item';
const HISTORY_ROW = 'ion-item[detail="true"]';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const { browser, page } = await launch();
  const shot = async name => {
    await page.screenshot({ path: path.join(OUT, `${name}.png`) });
    console.log('  shot', name);
  };

  await page.goto('http://localhost:8100/authentication/login-1', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('app_language', JSON.stringify('es'));
  });
  await go(page, '/authentication/login-1', 'input[formcontrolname="password"]');
  await shot('00-login');

  // --- Cashier
  await login(page, CASHIER.email, CASHIER.password);
  await go(page, '/tabs/tab2', 'ion-item-sliding');
  await shot('01-productos');

  await page.evaluate(async () => {
    const s = document.querySelectorAll('ion-item-sliding')[1];
    if (s && s.open) await s.open('start');
  });
  await sleep(1200);
  await shot('02-agregar-al-carrito');

  await page.evaluate(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const slides = [...document.querySelectorAll('ion-item-sliding')];
    for (const idx of [0, 1, 3, 5, 7]) {
      const s = slides[idx];
      if (!s) continue;
      await s.open('start');
      await wait(350);
      s.querySelector('ion-item-options[side="start"] ion-item-option')?.click();
      await wait(450);
      await s.close();
      await wait(250);
    }
  });
  await settled(page, 1500);

  await tab(page, 'tab4', CART_ROW);
  await shot('03-carrito');

  await tab(page, 'tab1', HISTORY_ROW);
  await shot('04-historial');

  await page.evaluate(
    sel => document.querySelector(`ion-router-outlet .ion-page:not(.ion-page-hidden) ${sel}`)?.click(),
    HISTORY_ROW
  );
  await settled(page, 1500);
  await shot('05-detalle-venta');

  // --- Owner
  await login(page, OWNER.email, OWNER.password);
  await tab(page, 'tab3', 'ion-item');

  await clickItem(page, 'Equipo');
  await page.waitForSelector('ion-modal ion-item', { visible: true, timeout: 20000 });
  await settled(page, 900);
  await shot('06-equipo');
  await page.evaluate(() => document.querySelector('ion-modal')?.dismiss());
  await sleep(800);

  await clickItem(page, 'Clientes');
  await page.waitForSelector('ion-modal ion-item', { visible: true, timeout: 20000 });
  await settled(page, 900);
  await shot('07-clientes');
  await page.evaluate(() => document.querySelector('ion-modal')?.dismiss());
  await sleep(800);

  const slug = await page.evaluate(async () => {
    const res = await fetch('http://localhost:3000/api/stores/current', {
      headers: { authorization: `Bearer ${JSON.parse(localStorage.getItem('access_token') || '""')}` },
    });
    return res.ok ? (await res.json()).store?.slug : null;
  });
  await go(page, `/catalogo/${slug || 'abarrotes-la-esquina'}`, '.grid > *');
  await page.waitForFunction(() => [...document.images].every(i => i.complete), { timeout: 20000 });
  await shot('08-catalogo-publico');

  await browser.close();
  console.log('done ->', OUT);
})().catch(e => {
  console.error('FAILED', e);
  process.exit(1);
});
