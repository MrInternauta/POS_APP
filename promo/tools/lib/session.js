// Shared by shoot.js and record.js: a phone-sized Chrome, logging in, and waiting for real content.
const puppeteer = require('puppeteer-core');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.PROMO_APP || 'http://localhost:8100';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function launch({ scale = 3 } = {}) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    defaultViewport: { width: 390, height: 844, deviceScaleFactor: scale, isMobile: true, hasTouch: true },
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--no-sandbox'],
  });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('[pageerror]', String(e).slice(0, 140)));
  return { browser, page };
}

// No spinner or loading overlay on screen, and the page has stopped fetching
async function settled(page, extra = 600) {
  await page.waitForFunction(
    () =>
      ![...document.querySelectorAll('ion-spinner, ion-loading, ion-skeleton-text, ion-toast')].some(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
      }),
    { timeout: 20000 }
  );
  await page.waitForNetworkIdle({ idleTime: 500, timeout: 20000 }).catch(() => {});
  await sleep(extra);
}

async function go(page, route, contentSelector) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 60000 });
  if (contentSelector) await page.waitForSelector(contentSelector, { visible: true, timeout: 20000 });
  await settled(page);
}

async function login(page, email, password) {
  await page.goto(`${BASE}/authentication/login-1`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('app_language', JSON.stringify('es'));
  });
  await page.goto(`${BASE}/authentication/login-1`, { waitUntil: 'networkidle2', timeout: 60000 });
  const emailSel = 'input#email, input[formcontrolname="email"]';
  await page.waitForSelector(emailSel, { timeout: 20000 });
  await page.type(emailSel, email, { delay: 12 });
  await page.type('input[formcontrolname="password"]', password, { delay: 12 });
  await page.click('button[type="submit"]');
  await page.waitForFunction(() => location.pathname.startsWith('/tabs'), { timeout: 30000 });
  await settled(page);
}

// Switches tab inside the app (a full reload would lose the cart, which lives in memory)
async function tab(page, name, contentSelector) {
  await page.click(`ion-tab-button[tab="${name}"]`);
  await page.waitForFunction(n => location.pathname.endsWith(`/${n}`), { timeout: 20000 }, name);
  if (contentSelector)
    await page.waitForFunction(
      sel => [...document.querySelectorAll(`ion-router-outlet .ion-page:not(.ion-page-hidden) ${sel}`)].length > 0,
      { timeout: 20000 },
      contentSelector
    );
  await settled(page);
}

// Clicks the ion-item whose label reads exactly `text`
async function clickItem(page, text) {
  const ok = await page.evaluate(t => {
    // The label's own text, without a nested <p> help line or Angular's comment nodes
    const own = label =>
      [...(label?.childNodes || [])]
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent)
        .join('')
        .trim();
    const item = [...document.querySelectorAll('ion-item')].find(i => own(i.querySelector('ion-label')) === t);
    item?.click();
    return !!item;
  }, text);
  if (!ok) throw new Error(`No item labelled "${text}"`);
}

module.exports = { BASE, sleep, launch, settled, go, tab, login, clickItem };
