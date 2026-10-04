const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://localhost:8100';
const OUT = process.argv[2] || path.join(__dirname, 'shots');
const EMAIL = 'demo.promo@pos.local';
const PASS = 'demo12345';

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    defaultViewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--no-sandbox'],
  });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('[pageerror]', String(e).slice(0, 140)));
  const shot = async name => {
    await page.screenshot({ path: path.join(OUT, `${name}.png`) });
    console.log('  shot', name);
  };

  // Español desde el arranque
  await page.goto(`${BASE}/authentication/login-1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => localStorage.setItem('app_language', JSON.stringify('es')));
  await page.goto(`${BASE}/authentication/login-1`, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(2500);
  await shot('00-login');

  const emailSel = 'input#email, input[formcontrolname="email"]';
  await page.waitForSelector(emailSel, { timeout: 20000 });
  await page.click(emailSel);
  await page.type(emailSel, EMAIL, { delay: 12 });
  const passSel = 'input[formcontrolname="password"]';
  await page.click(passSel);
  await page.type(passSel, PASS, { delay: 12 });
  await sleep(300);
  await page.click('button[type="submit"]');
  await sleep(5000);
  console.log('login ->', page.url());

  // --- Lista de productos
  await page.goto(`${BASE}/tabs/tab2`, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(4000);
  await shot('01-productos');

  // --- Gesto "deslizar para agregar al carrito" visible
  await page.evaluate(async () => {
    const s = document.querySelectorAll('ion-item-sliding')[1];
    if (s && s.open) await s.open('start');
  });
  await sleep(1200);
  await shot('02-agregar-al-carrito');

  // --- Llenar el carrito
  await page.evaluate(async () => {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const slides = [...document.querySelectorAll('ion-item-sliding')];
    for (const idx of [0, 1, 3, 5, 7]) {
      const s = slides[idx];
      if (!s) continue;
      await s.open('start');
      await wait(350);
      const opt = s.querySelector('ion-item-options[side="start"] ion-item-option');
      if (opt) opt.click();
      await wait(450);
      await s.close();
      await wait(250);
    }
  });
  await sleep(2500);

  await page.goto(`${BASE}/tabs/tab4`, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(3500);
  await shot('03-carrito');

  // --- Historial de compras
  await page.goto(`${BASE}/tabs/tab1`, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(5000);
  await shot('04-historial');

  // --- Perfil / ajustes
  await page.goto(`${BASE}/tabs/tab3`, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(4000);
  await shot('05-perfil');

  // --- Detalle de una venta
  await page.goto(`${BASE}/tabs/tab1`, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(4500);
  await page.evaluate(() => {
    const row = document.querySelector('ion-item, ion-card, .order-item, li');
    row && row.click();
  });
  await sleep(3500);
  await shot('06-detalle-venta');

  await browser.close();
  console.log('done ->', OUT);
})().catch(e => {
  console.error('FAILED', e);
  process.exit(1);
});
