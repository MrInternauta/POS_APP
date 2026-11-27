# Material promocional

Piezas listas para publicar, generadas a partir de capturas reales de la app
(Chrome headless a 390×844 con `deviceScaleFactor: 3` → 1170×2532 px).

## `playstore/`

| Archivo | Tamaño | Dónde va |
| --- | --- | --- |
| `icon-512x512.png` | 512×512 | Icono de la ficha |
| `feature-graphic-1024x500.png` | 1024×500 | Gráfico destacado |
| `screenshot-01..08-*.png` | 1080×1920 | Capturas de teléfono (mínimo 2, máximo 8) |
| `minipos-promo.mp4` | 1920×1080, 30 s | Video promocional: se sube a YouTube y el enlace va en la ficha |

Las capturas van en el orden del nombre: productos, agregar al carrito, carrito,
historial, detalle de venta, equipo, clientes y catálogo público. Las de venta se toman como
cajero (4 pestañas) y las de "Mi tienda" como dueño.

## `github/`

| Archivo | Tamaño | Dónde va |
| --- | --- | --- |
| `banner-1280x640.png` | 1280×640 | Cabecera del README y *social preview* del repo |
| `screens-2400x1000.png` | 2400×1000 | Tira de pantallas para el README |

El *social preview* se sube en **Settings → General → Social preview**.

## `screenshots/`

Las capturas sin marco ni texto (1170×2532), por si hacen falta para otra pieza.

## Regenerar

Todo sale de la app real corriendo en local:

- Backend `POS-Nest` (rama con multi-store) en `localhost:3000`, con su `.env` apuntando a una base
  **local** (el seed se niega a correr contra cualquier otra). Sin `BLOB_READ_WRITE_TOKEN`, así las
  fotos de demo se quedan en disco y no en el Blob de producción.
- La app en `localhost:8100` (`npx ng serve --port 8100`).
- Google Chrome, ffmpeg (`brew install ffmpeg`) y Pillow para `/usr/bin/python3`
  (otro Python: `PROMO_PYTHON=/ruta/python3`).

```bash
cd promo/tools
npm i                                  # sólo la primera vez
npm test                               # pruebas del seed
node seed.js                           # tienda de demo desde cero
node shoot.js                          # capturas → tools/shots/
PROMO_OUT=.. /usr/bin/python3 promo.py capturas   # capturas de Play + limpias
node record.js                         # graba la venta → video/public/sale.mp4
```

`python3 promo.py` sin argumento también rehace el gráfico destacado, el icono y las piezas de
GitHub.

### Datos de demostración

`seed.js` borra y vuelve a crear **Abarrotes La Esquina** (`demo-data.js`): 14 productos (8 en el
catálogo público), 4 clientes, 12 ventas de los últimos días y un equipo de 4. Cuentas, todas con
contraseña `demo12345`:

| Correo | Rol |
| --- | --- |
| `demo.promo@pos.local` | Dueña (Lupita Hernández) |
| `demo.cajero@pos.local` | Cajero (Carlos Ramos), el que vende en el video |
| `demo.jorge@pos.local`, `demo.ana@pos.local` | Dueño y cajera |

Sólo borra tiendas en las que **todos** los miembros son cuentas `@pos.local`. Las cuentas de demo
se conservan, pero salen de cualquier otra tienda y dejan de ser super admin, para que la app
muestre una sola tienda.

## `video/`

Proyecto Remotion con el video promocional (guion en
`docs/superpowers/specs/2026-11-27-playstore-promo-video-design.md`).

```bash
cd promo/video
npm i                 # sólo la primera vez
npm test              # tiempos del guion y assets
npm run dev           # vista previa en Remotion Studio
npm run render        # → out/minipos-promo.mp4 (copia final en playstore/)
```

`npm run sync` (lo corre `render`) copia las capturas y el icono a `public/`, y falla nombrando
cualquier archivo que falte.

### Efectos de sonido (`video/public/sfx/`)

| Archivo | Origen | Licencia |
| --- | --- | --- |
| `whoosh.wav` | "Woosh" de 1bob, [freesound.org/s/831936](https://freesound.org/s/831936/), vía remotion.media | CC0 |
| `click.wav` | "Mouse Click Sound" de Pixeliota, [freesound.org/s/678248](https://freesound.org/s/678248/), vía remotion.media | CC0 |
| `chime.wav` | Generado con ffmpeg (dos senos con desvanecido) | Propio |

Sin música, para que YouTube no reclame derechos (Content ID).

La tipografía es Avenir Next (macOS) y la paleta sale del propio icono de la app:
coral `#E94E3C`, slate `#3F5C74` y fondo `#0D121E`.
