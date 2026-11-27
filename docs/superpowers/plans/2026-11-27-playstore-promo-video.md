# Play Store Promo Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A ~30 s 1920×1080 Spanish promo video for the Mini POS Play listing, plus refreshed Play screenshots that include the multi-store screens, all regenerable from scripts.

**Architecture:** A seed script resets a local demo store (owner + cashier) through SQL and the API. `shoot.js` takes stills and a new `record.js` records the live sale as the cashier. A Remotion project in `promo/video/` composes the storyboard from those assets and renders the MP4. `promo.py` rebuilds the Play screenshots.

**Tech Stack:** Node 22, puppeteer-core, `pg`, `node:test`; Python 3 + Pillow (existing `promo.py`/`thumbs.py`); Remotion 4.0.528 (React/TypeScript), ffmpeg/ffprobe (Homebrew).

**Spec:** `docs/superpowers/specs/2026-11-27-playstore-promo-video-design.md`

## Global Constraints

- Output: MP4 H.264, 1920×1080, 30 fps, 900 frames (30 s), at `promo/video/out/minipos-promo.mp4`.
- All on-screen text in Spanish (México). Copy, verbatim: "Vende en segundos.", "Desliza para agregar", "Cobra en un toque", "Todas tus ventas, al día.", "Tu equipo, tus clientes y tu catálogo en línea.", "Mini POS", "Disponible en Google Play".
- Brand: font Avenir Next; coral `#E94E3C`, slate `#3F5C74`, background `#0D121E`; icon `promo/playstore/icon-512x512.png`.
- No official Google Play badge, no manufacturer phone design (draw a plain frame).
- Sound: no music; only light, royalty-free sound effects stored locally in the repo.
- Play screenshots: exactly 8, 1080×1920, order: Productos, Agregar al carrito, Carrito, Historial, Detalle de venta, Equipo, Clientes, Catálogo público. `screenshot-06-perfil.png` is removed.
- Feature graphic and `promo/github/*` stay untouched.
- Local only: backend `POS-Nest` on `feat/stores-team` at `http://localhost:3000`, app at `http://localhost:8100`. No script may touch a non-local database.
- Demo accounts: owner `demo.promo@pos.local` / `demo12345`; cashier `demo.cajero@pos.local` / `demo12345`.
- Everything new lives under `promo/` (outside the app build); `promo/video/` has its own `package.json`.

## Review Focus

1. **Seed pointed at a real database** → it must refuse before connecting unless the DB host is `localhost`/`127.0.0.1`/`::1` (test in Task 1).
2. **Running the seed twice** → the second run must end with the same counts as the first, not duplicates or a unique-slug error (check in Task 1).
3. **Loading state captured** → stills and the recording must wait for real content (product rows, history rows) rather than fixed sleeps alone; a spinner in a frame is a failure (check in Tasks 2 and 3).
4. **Missing or renamed asset** → the video must fail to render, not render a black phone, when a screenshot or `sale.mp4` is missing (test in Task 4).
5. **Spanish caption overflow** → the longest caption ("Tu equipo, tus clientes y tu catálogo en línea.") must fit its column without clipping at 1920×1080 (still check in Task 4).

---

### Task 1: Demo data seed with reset

**Files:**
- Create: `promo/tools/package.json` (deps: `puppeteer-core`, `pg`; script `"test": "node --test"`)
- Create: `promo/tools/lib/local-db.js`
- Create: `promo/tools/demo-data.js`
- Create: `promo/tools/seed.js`
- Modify: `promo/tools/thumbs.py` (read products from a JSON path instead of the hard-coded `PRODUCTS` list)
- Test: `promo/tools/test/local-db.test.js`, `promo/tools/test/demo-data.test.js`

**Interfaces:**
- Produces: `assertLocalDatabase(url: string): void` (throws `Error('Refusing to touch a non-local database: <host>')`).
- Produces: `demo-data.js` exports `{ OWNER, CASHIER, TEAM, STORE, CUSTOMERS, PRODUCTS, ORDERS }`. `OWNER`/`CASHIER`: `{ email, password, name, lastName }`. `TEAM`: extra members `{ email, name, role }` (2 people). `PRODUCTS`: `{ name, price, stock, isPublic }[]`. `ORDERS`: `{ daysAgo, customer: <index>, items: [{ product: <index>, quantity }] }[]`.
- Produces: `node seed.js` (reads `DATABASE_URL` from `../../../POS-Nest/.env` unless set in the env) → exits 0 and prints `seeded store <slug>: <n> products, <n> customers, <n> orders, <n> members`.
- Produces: `python3 thumbs.py <products.json>` where the JSON is `[{ "id": number, "name": string }]` → writes `thumbs/<id>.png`.

- [ ] **Step 1: Write the failing tests**

```js
// test/local-db.test.js
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

// test/demo-data.test.js
test('eight public products, at least twelve in total', () => {
  assert.ok(PRODUCTS.length >= 12);
  assert.equal(PRODUCTS.filter(p => p.isPublic).length, 8);
});
test('orders only point at real products and customers', () => {
  for (const o of ORDERS) {
    assert.ok(CUSTOMERS[o.customer]);
    for (const i of o.items) assert.ok(PRODUCTS[i.product] && i.quantity > 0);
  }
});
test('demo emails are all @pos.local and distinct', () => {
  const emails = [OWNER, CASHIER, ...TEAM].map(p => p.email);
  assert.ok(emails.every(e => e.endsWith('@pos.local')));
  assert.equal(new Set(emails).size, emails.length);
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `cd promo/tools && npm i && npm test`
Expected: FAIL, modules not found.

- [ ] **Step 3: Implement `assertLocalDatabase` in `lib/local-db.js`** using `new URL(url).hostname` (brackets stripped for IPv6).

- [ ] **Step 4: Write `demo-data.js`**: a small Mexican corner shop (store name "Abarrotes La Esquina", phone and address filled in, timezone `America/Mexico_City`); everyday grocery products with realistic MXN prices and stock > 5 (so the recorded sale never hits zero stock); 5 customers including "Público general"; ~12 orders spread over the last 6 days; team: the cashier plus 2 more people.

- [ ] **Step 5: Run the tests to see them pass**

Run: `npm test`
Expected: all PASS.

- [ ] **Step 6: Implement `seed.js`**
  1. `assertLocalDatabase(DATABASE_URL)` before connecting.
  2. **Reset (SQL, one transaction):** find the demo users (`email LIKE 'demo.%@pos.local'`) and the stores where *every* member is a demo user. For those stores delete, in FK order: `order_item` rows of their orders, `order`, `customer`, `products`, store-scoped categories/providers if those tables have `id_store`, `store_member`, `store`. Then delete the demo users. Read the entities in `POS-Nest/src/**/entities` for exact table and column names; if a store also has non-demo members, abort with an error rather than deleting it.
  3. **Recreate through the API at `localhost:3000`:** sign up the owner (`POST /users`), log in (`POST /auth`), `POST /stores` (use the token it returns from then on), `POST /stores/current/members` for the cashier and the team with `password: 'demo12345'` for new accounts, `POST /customers`, `POST /products` (with `isPublic`), then write `thumbs-input.json`, run `python3 thumbs.py thumbs-input.json` and upload each `thumbs/<id>.png` with `POST /image/product/<id>` (multipart field `file`), then `POST /orders` for each order.
  4. **Back-date orders:** after creating them, `UPDATE` each order's creation timestamp to `now() - daysAgo` (same column the history screen sorts by) so the history shows several days.
  5. Print the summary line.

- [ ] **Step 7: Verify idempotence against the local backend**

Run (backend running on `feat/stores-team`): `node seed.js && node seed.js`
Expected: both runs print the same summary line, for example `seeded store abarrotes-la-esquina: 14 products, 5 customers, 12 orders, 4 members`, and no error. The slug may differ only if the backend appends a suffix; if it does, the second run must still reuse a fresh, single store.

- [ ] **Step 8: Verify the cashier can log in without a forced password change**

Run: `curl -s -XPOST localhost:3000/auth -H 'content-type: application/json' -d '{"email":"demo.cajero@pos.local","password":"demo12345"}' | head -c 200`
Expected: a token. If the app forces a password change for temporary passwords, have `seed.js` call `POST /auth/password` as the cashier to set `demo12345` as their permanent password.

- [ ] **Step 9: Commit**

```bash
git add promo/tools/package.json promo/tools/package-lock.json promo/tools/lib promo/tools/demo-data.js promo/tools/seed.js promo/tools/thumbs.py promo/tools/test
git commit -m "Seed a resettable demo store for the promo captures"
```

---

### Task 2: Retake the screenshots and rebuild the Play set

**Files:**
- Modify: `promo/tools/shoot.js`
- Modify: `promo/tools/promo.py` (`SCREENS` list, lines ~180-190)
- Replace: `promo/screenshots/*.png`, `promo/playstore/screenshot-0*.png`; delete `promo/playstore/screenshot-06-perfil.png` and `promo/screenshots/05-perfil.png`

**Interfaces:**
- Consumes: the seeded data and accounts from Task 1.
- Produces: `promo/screenshots/` with exactly these names (1170×2532): `00-login`, `01-productos`, `02-agregar-al-carrito`, `03-carrito`, `04-historial`, `05-detalle-venta`, `06-equipo`, `07-clientes`, `08-catalogo-publico`. Task 4 imports them by these names.
- Produces: `promo/playstore/screenshot-01-productos` … `screenshot-08-catalogo-publico` (1080×1920).

- [ ] **Step 1: Refactor `shoot.js`** into `login(page, email)` and `logout(page)` helpers. Take 00–05 logged in as the **cashier**, then log in as the **owner** and take 06–08 from the profile's "Mi tienda" (Equipo, Clientes) and the public catalogue page `/catalogo/<slug>` (no login needed; read the slug from `GET /stores/current`). Replace fixed sleeps before each shot with `page.waitForSelector` on real content (an `ion-item` in the list, the member rows, the catalogue product cards) and wait for no `ion-spinner`/`ion-loading` to be visible.

- [ ] **Step 2: Update `SCREENS` in `promo.py`** to the 8 keys above, in order, each with a Spanish headline and subline. New ones: Equipo → "Tu equipo, a tu manera" / "Agrega cajeros y decide qué ve cada quien"; Clientes → "Conoce a tus clientes" / "Guarda a quién le vendes"; Catálogo público → "Tu catálogo en línea" / "Comparte un enlace con tus productos y precios". Keep the existing headlines for the other five.

- [ ] **Step 3: Run the pipeline**

Run: `cd promo/tools && node seed.js && node shoot.js ../screenshots && PROMO_OUT=.. python3 promo.py`

- [ ] **Step 4: Verify sizes and count**

Run: `python3 -c "from PIL import Image;import glob;fs=sorted(glob.glob('../playstore/screenshot-*.png'));print(len(fs),{Image.open(f).size for f in fs})"`
Expected: `8 {(1080, 1920)}`. Then open each of the 9 raw screenshots and the 8 Play screenshots with the Read tool and confirm: real data, Spanish UI, 4 tabs on the cashier shots, no spinners or toasts.

- [ ] **Step 5: Commit**

```bash
git add -A promo/tools/shoot.js promo/tools/promo.py promo/screenshots promo/playstore
git commit -m "Retake the promo screenshots with the multi-store screens"
```

---

### Task 3: Record the live sale

**Files:**
- Create: `promo/tools/record.js`

**Interfaces:**
- Consumes: the seed (Task 1) and `login()` from `shoot.js`; move `login`/`logout` into `promo/tools/lib/session.js` and require it from both.
- Produces: `promo/video/public/sale.mp4` (H.264, 30 fps, phone viewport 390×844 at `deviceScaleFactor: 2` → 780×1688, 8–12 s, no audio).
- Produces: `promo/video/public/sale-events.json`: `[{ "t": seconds, "kind": "swipe" | "tap", "x": px, "y": px }]` in video pixels. Task 4 draws the finger dot and places the sound effects from it.

- [ ] **Step 1: Implement `record.js`**: run the seed first so stock and history are fresh; log in as the cashier; open the product list and wait for rows; start `page.screencast({ path })` (puppeteer-core ≥ 22 uses ffmpeg). Then:
  1. Swipe 3 products into the cart with visible, paced gestures (~0.8 s each).
  2. Open the cart.
  3. Charge the sale through the app's real flow, picking "Público general" if it asks for a customer.
  4. Hold on the confirmation for ~1 s.

  Log each gesture's time and position into the events file. Upgrade `puppeteer-core` if the installed version has no `screencast`.

- [ ] **Step 2: Run it**

Run: `node record.js`

- [ ] **Step 3: Verify the file**

Run: `ffprobe -v error -show_entries stream=width,height,r_frame_rate,codec_name -show_entries format=duration -of compact ../video/public/sale.mp4`
Expected: `codec_name=h264|width=780|height=1688|r_frame_rate=30/1` and a duration between 8 and 12. Extract 4 frames (`ffmpeg -i sale.mp4 -vf fps=0.4 /tmp-dir/f%02d.png` into the scratchpad) and view them: no spinner, the cart fills, the sale completes.

- [ ] **Step 4: Commit**

```bash
git add promo/tools/record.js promo/tools/lib/session.js promo/tools/shoot.js promo/video/public/sale.mp4 promo/video/public/sale-events.json
git commit -m "Record the live cashier sale for the promo video"
```

---

### Task 4: Remotion video

**Files:**
- Create: `promo/video/` via `npx create-video@latest --yes --blank --no-tailwind video` from `promo/`; pin `remotion` and every `@remotion/*` to the same exact version `4.0.528`.
- Create: `promo/video/src/theme.ts`, `src/timeline.ts`, `src/components/PhoneFrame.tsx`, `src/components/Caption.tsx`, `src/components/FingerDot.tsx`, `src/scenes/{Intro,Sale,History,Store,Outro}.tsx`, `src/Promo.tsx`; modify `src/Root.tsx`.
- Create: `promo/video/scripts/sync-assets.mjs` (copies the needed screenshots and the icon into `public/`, fails if any is missing).
- Test: `promo/video/src/timeline.test.ts` (Vitest, or `node --test` with `tsx`; the builder picks)

**Interfaces:**
- Consumes: `promo/screenshots/{04-historial,05-detalle-venta,06-equipo,07-clientes,08-catalogo-publico}.png`, `promo/playstore/icon-512x512.png`, `public/sale.mp4`, `public/sale-events.json`.
- Produces: `theme.ts` exports `COLORS = { coral: '#E94E3C', slate: '#3F5C74', bg: '#0D121E' }`, `FONT = '"Avenir Next", Avenir, system-ui, sans-serif'`.
- Produces: `timeline.ts` exports `FPS = 30`, `SCENES: { id: 'intro'|'sale'|'history'|'store'|'outro'; from: number; durationInFrames: number; caption?: string | string[] }[]`, and `TOTAL_FRAMES`.
- Produces: composition id `PlayPromo`, 1920×1080, `fps: 30`, `durationInFrames: TOTAL_FRAMES`.

- [ ] **Step 1: Scaffold** (command above), then `npm i`, and add `"sync": "node scripts/sync-assets.mjs"`, `"prerender": "npm run sync"` and `"render": "remotion render PlayPromo out/minipos-promo.mp4 --codec=h264"`.

- [ ] **Step 2: Write the failing timeline test**

```ts
test('scenes follow the storyboard', () => {
  expect(SCENES.map(s => [s.id, s.from, s.durationInFrames])).toEqual([
    ['intro', 0, 90], ['sale', 90, 300], ['history', 390, 150], ['store', 540, 210], ['outro', 750, 150],
  ]);
  expect(TOTAL_FRAMES).toBe(900);
});
test('captions are the spec copy', () => {
  expect(SCENES.find(s => s.id === 'intro')!.caption).toBe('Vende en segundos.');
  expect(SCENES.find(s => s.id === 'sale')!.caption).toEqual(['Desliza para agregar', 'Cobra en un toque']);
  expect(SCENES.find(s => s.id === 'history')!.caption).toBe('Todas tus ventas, al día.');
  expect(SCENES.find(s => s.id === 'store')!.caption).toBe('Tu equipo, tus clientes y tu catálogo en línea.');
});
```

- [ ] **Step 3: Run it to see it fail, implement `timeline.ts`, run it to see it pass.**

- [ ] **Step 4: Write the failing asset test**: `sync-assets.mjs` run against an empty temp source directory exits non-zero and names the missing file. Then implement it so it passes.

- [ ] **Step 5: Build the components and scenes** following the plugin's `remotion-markup` guides (`sequencing.md`, `transitions.md`, `multi-scene-video.md`, `local-fonts.md`) and `remotion-create/video-layout.md`:
  - `PhoneFrame`: a rounded dark bezel that holds an `<Img>` or `<OffthreadVideo>`.
  - `Caption`: a large white Avenir headline with a coral accent.
  - `FingerDot`: a translucent circle driven by `sale-events.json`.
  - Scenes: the phone sits on one side and the caption on the other.
  - **Intro:** the icon springs in.
  - **Sale:** `sale.mp4`. The caption switches to "Cobra en un toque" at the first `tap` event after the cart opens.
  - **History:** history, then sale detail.
  - **Store:** quick cuts between Equipo, Clientes and Catálogo público.
  - **Outro:** icon, "Mini POS", "Disponible en Google Play".
  - Wire everything into `Promo.tsx` with `<Sequence>` from `SCENES`.

- [ ] **Step 6: Verify with stills**

Run: `npm run sync && for f in 45 200 330 465 645 840; do npx remotion still PlayPromo out/still-$f.png --frame=$f; done`
Expected: 6 PNGs at 1920×1080. View each with the Read tool and check:
- Brand colors and the Avenir Next font, not a serif fallback.
- The correct screen in each scene.
- The longest caption fits without clipping.
- No black phone screens.

Delete the stills afterwards.

- [ ] **Step 7: Commit** (`out/` is in `.gitignore`)

```bash
git add promo/video ':!promo/video/out' ':!promo/video/node_modules'
git commit -m "Compose the Play Store promo video in Remotion"
```

---

### Task 5: Sound effects, final render and docs

**Files:**
- Create: `promo/video/public/sfx/{whoosh,click,ding}.wav` (plus `switch.wav` if used)
- Create: `promo/video/src/components/Sfx.tsx`; modify the scenes
- Modify: `promo/README.md` (new "Video" and "Datos de demostración" sections; update the Play screenshot list to the 8 files)

- [ ] **Step 1: Check the license** for the effects at `https://remotion.media/*.wav` (Remotion docs for `@remotion/sfx`). If they are not clearly free to use in a published video, generate soft clicks and a chime with ffmpeg instead (`sine`/`anoisesrc` + `afade`). Store the files locally either way, so rendering works offline. Write the source and license in the README.

- [ ] **Step 2: Place the effects.** Put a soft click on each `swipe`/`tap` from `sale-events.json` and a ding when the sale completes. Put a whoosh on each scene transition, kept at volume ≤ 0.5. Do not use any of the meme sounds.

- [ ] **Step 3: Render**

Run: `cd promo/video && npm run render`

- [ ] **Step 4: Verify the output**

Run: `ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,r_frame_rate -show_entries format=duration -of compact out/minipos-promo.mp4`
Expected: a video stream `h264|1920|1080|30/1`, an audio stream (`aac`), and a duration of `30.0` (±0.1). Extract one frame per scene and view them. Then open the MP4 with `open out/minipos-promo.mp4` so the owner can watch it.

- [ ] **Step 5: Copy the deliverable and commit.** Copy the render to `promo/playstore/minipos-promo.mp4`; commit it only if it is under 25 MB, otherwise leave it uncommitted and say so.

```bash
git add promo/video/public/sfx promo/video/src promo/README.md promo/playstore/minipos-promo.mp4
git commit -m "Add sound effects, render the promo video and document how to regenerate it"
```
