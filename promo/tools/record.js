// Records the cashier making a sale, for the promo video (backend + app running locally).
//   node record.js   → ../video/public/sale.mp4 (780×1688, 30 fps, H.264) + sale-events.json
// Every gesture is a real touch, paced for a viewer; its time and position (in video pixels) go to
// sale-events.json (swipe = finger down, lift = finger up, tap, done = sale saved) so the video can
// draw the finger and place the sound effects.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { sleep, launch, tab, login } = require('./lib/session');
const { CASHIER } = require('./demo-data');

const SCALE = 2; // CSS px → video px
const OUT_DIR = path.join(__dirname, '../video/public');
const SWIPED = [0, 2, 4]; // which product rows go into the cart

async function center(page, selector, index = 0) {
  const box = await page.evaluate(
    (sel, i) => {
      const el = document.querySelectorAll(`ion-router-outlet .ion-page:not(.ion-page-hidden) ${sel}`)[i];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    },
    selector,
    index
  );
  if (!box) throw new Error(`Nothing at ${selector}[${index}]`);
  return box;
}

(async () => {
  execFileSync('node', [path.join(__dirname, 'seed.js')], { stdio: 'inherit' });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'sale-frames-'));

  const { browser, page } = await launch({ scale: SCALE });
  await login(page, CASHIER.email, CASHIER.password);
  await tab(page, 'tab2', 'ion-item-sliding');
  await page.waitForFunction(() => [...document.images].every(i => i.complete), { timeout: 20000 });

  // Chrome only sends a frame when the screen changes, each with its wall-clock time. Keeping those
  // times (instead of puppeteer's screencast, which drops the still stretches) keeps the video in
  // step with the gesture log.
  const frames = [];
  const cdp = await page.createCDPSession();
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    const file = path.join(work, `${String(frames.length).padStart(5, '0')}.jpg`);
    fs.writeFileSync(file, Buffer.from(data, 'base64'));
    frames.push({ file, ts: metadata.timestamp });
    await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, everyNthFrame: 1 });
  await page.waitForFunction(() => new Promise(r => requestAnimationFrame(() => r(true))));
  while (!frames.length) await sleep(20);
  const t0 = frames[0].ts * 1000;

  const events = [];
  const log = (kind, x, y) =>
    events.push({
      t: +((Date.now() - t0) / 1000).toFixed(2),
      kind,
      x: Math.round(x * SCALE),
      y: Math.round(y * SCALE),
    });
  const ts = page.touchscreen;

  const drag = async (x0, y, x1, ms) => {
    log('swipe', x0, y);
    await ts.touchStart(x0, y);
    const steps = 14;
    for (let s = 1; s <= steps; s++) {
      await ts.touchMove(x0 + ((x1 - x0) * s) / steps, y);
      await sleep(ms / steps);
    }
    await ts.touchEnd();
    log('lift', x1, y);
  };
  const tap = async (x, y) => {
    log('tap', x, y);
    await ts.tap(x, y);
  };

  await sleep(900);

  // 1. Swipe products into the cart
  for (const row of SWIPED) {
    const item = await center(page, 'ion-item-sliding', row);
    const y = item.y + item.h / 2;
    await drag(item.x + 40, y, item.x + 200, 420);
    await sleep(350);
    const opt = await center(
      page,
      `ion-item-sliding:nth-of-type(${row + 1}) ion-item-options[side="start"] ion-item-option`
    );
    await tap(opt.x + opt.w / 2, opt.y + opt.h / 2);
    await sleep(700);
  }

  // 2. Open the cart, without the last "Producto agregado" toast covering its header
  await page.evaluate(() => Promise.all([...document.querySelectorAll('ion-toast')].map(t => t.dismiss())));
  await sleep(450);
  const cartTab = await page.evaluate(() => {
    const r = document.querySelector('ion-tab-button[tab="tab4"]').getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  await tap(cartTab.x, cartTab.y);
  await page.waitForFunction(() => location.pathname.endsWith('/tab4'));
  // The cart is already in memory: wait for its rows, not for the network to go quiet
  await page.waitForSelector('ion-router-outlet .ion-page:not(.ion-page-hidden) app-slide-to-confirm .slide-knob', {
    visible: true,
  });
  await sleep(1100);

  // 3. Charge: slide the knob all the way
  const knob = await center(page, 'app-slide-to-confirm .slide-knob');
  const track = await center(page, 'app-slide-to-confirm > div');
  await drag(knob.x + knob.w / 2, knob.y + knob.h / 2, track.x + track.w - 8, 700);
  await page.waitForSelector('.ant-modal-confirm', { visible: true, timeout: 15000 }); // the app's "saved" message
  log('done', 390 / 2, 844 / 2);
  await sleep(1300);

  const end = Date.now() / 1000;
  await cdp.send('Page.stopScreencast');
  await browser.close();

  // Each frame lasts until the next one; the last until the recording stopped
  const list = frames
    .map((f, i) => `file '${f.file}'\nduration ${((frames[i + 1]?.ts ?? end) - f.ts).toFixed(4)}`)
    .join('\n');
  fs.writeFileSync(path.join(work, 'frames.txt'), `${list}\nfile '${frames.at(-1).file}'\n`);
  execFileSync('ffmpeg', [
    '-y',
    '-loglevel',
    'error',
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    path.join(work, 'frames.txt'),
    '-vf',
    'scale=780:1688:flags=lanczos,fps=30',
    '-an',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-crf',
    '16',
    '-preset',
    'slow',
    '-movflags',
    '+faststart',
    path.join(OUT_DIR, 'sale.mp4'),
  ]);
  fs.rmSync(work, { recursive: true, force: true });
  fs.writeFileSync(path.join(OUT_DIR, 'sale-events.json'), JSON.stringify(events, null, 2) + '\n');
  console.log(`recorded ${events.length} gestures in ${events.at(-1).t}s ->`, path.join(OUT_DIR, 'sale.mp4'));
})().catch(e => {
  console.error('FAILED', e);
  process.exit(1);
});
