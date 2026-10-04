# Material promocional

Piezas listas para publicar, generadas a partir de capturas reales de la app
(Chrome headless a 390×844 con `deviceScaleFactor: 3` → 1170×2532 px).

## `playstore/`

| Archivo | Tamaño | Dónde va |
| --- | --- | --- |
| `icon-512x512.png` | 512×512 | Icono de la ficha |
| `feature-graphic-1024x500.png` | 1024×500 | Gráfico destacado |
| `screenshot-01..06-*.png` | 1080×1920 | Capturas de teléfono (mínimo 2, máximo 8) |

Las capturas van en el orden del nombre: productos, agregar al carrito, carrito,
historial, detalle de venta y perfil.

## `github/`

| Archivo | Tamaño | Dónde va |
| --- | --- | --- |
| `banner-1280x640.png` | 1280×640 | Cabecera del README y *social preview* del repo |
| `screens-2400x1000.png` | 2400×1000 | Tira de pantallas para el README |

El *social preview* se sube en **Settings → General → Social preview**.

## `screenshots/`

Las capturas sin marco ni texto (1170×2532), por si hacen falta para otra pieza.

## Regenerar

Los scripts viven en `tools/`. Necesitan el backend en `localhost:3000`, la app
en `localhost:8100` y Google Chrome instalado.

```bash
cd promo/tools
npm i puppeteer-core          # sólo la primera vez
node shoot.js ./shots         # capturas
PROMO_OUT=.. python3 promo.py # banners y piezas de tienda
```

`shoot.js` entra con un usuario de demostración (`demo.promo@pos.local`) creado
contra la base local; cámbialo si usas otros datos. `thumbs.py` genera las
miniaturas de producto que se ven en las capturas y las sube por la API.

La tipografía es Avenir Next (macOS) y la paleta sale del propio icono de la app:
coral `#E94E3C`, slate `#3F5C74` y fondo `#0D121E`.
