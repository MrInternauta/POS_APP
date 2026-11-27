# Video promocional para Google Play — diseño

Fecha: 2026-11-27 · Rama base: `feat/stores-manage` (multi-store)

## Intención

Un video corto para la ficha de **Mini POS** (`mx.ramirex.minipos`) en Google Play.
Quien lo vea debe quedarse con una idea: **"es tan simple que me sirve para mi
tienda"**. El público es el dueño de una tienda pequeña en México, no una cadena.

## Objetivos

- Demostrar, no afirmar, que vender es rápido: una venta real en pantalla en pocos segundos.
- Mostrar lo que trajo multi-store (equipo, clientes, catálogo público) como
  extras útiles para una tienda chica, no como complejidad.
- Que se vea igual que el resto del material de `promo/`.
- Que se pueda volver a generar con un par de comandos cuando cambie la app.

## No objetivos

- Subir el video a YouTube o a la ficha: lo hace el dueño a mano (Play sólo acepta un enlace de YouTube).
- Versión vertical, versiones en otros idiomas o cortes para redes.
- Mostrar el panel de super admin.

## Anti-objetivos (fracaso aunque "funcione")

- Que parezca un software complicado o para empresas: demasiadas pantallas, menús, texto.
- Pantallas con datos falsos evidentes, errores, spinners o la marca de otra app.
- Texto en inglés o mezclado.

## Restricciones

- Formato: MP4 H.264, 1920×1080, 30 fps, ~30 s (Play recomienda 30 s–2 min).
- Idioma: español (México), textos cortos en pantalla.
- Identidad (de `promo/README.md`): Avenir Next; coral `#E94E3C`, slate `#3F5C74`, fondo `#0D121E`; icono `promo/playstore/icon-512x512.png`.
- Las capturas y la grabación salen de la app real corriendo local (backend en `localhost:3000`, app en `localhost:8100`, usuario `demo.promo@pos.local`), igual que hoy.
- Sin la insignia oficial de Google Play (tiene reglas de marca); sólo el texto "Disponible en Google Play".

## Enfoques considerados

| | Enfoque | A favor | En contra |
|---|---|---|---|
| A | Sólo capturas animadas en un marco de teléfono | Barato, controlado, fácil de regenerar | La simplicidad se dice, no se ve |
| B | Sólo grabaciones de pantalla editadas | La prueba más fuerte | Frágil: tiempos, cargas y datos; regrabar todo a cada cambio |
| **C** | **Mixto: una grabación real de la venta + capturas animadas para lo demás** | La grabación prueba "simple"; las capturas mantienen breve lo de multi-store | Sólo ~10 s dependen de la grabación frágil |

**Elegido: C.** El dueño eligió C tras ver las tres.

## Qué decidió el dueño

- El mensaje: "simple para una tienda pequeña".
- Volver a tomar las capturas incluyendo multi-store.
- El enfoque C.
- **Sonido:** sin música; efectos ligeros (toques, deslizamientos, cobro, transiciones)
  libres de derechos, para no arriesgar reclamos de Content ID en YouTube.
- **Capturas de Play (máx. 8):** se quita Perfil. Orden: Productos, Agregar al carrito,
  Carrito, Historial, Detalle de venta, Equipo, Clientes, Catálogo público.

## Decisiones del constructor (revisables)

- **Dos cuentas demo.** Un Dueño ve 6 pestañas (Reportes y Asistente dependen de
  `selectCanManage`), lo que choca con "demasiados menús". La venta grabada y las
  capturas de venta se hacen como **Cajero** (4 pestañas, app real sin CSS inyectado);
  las de Mi tienda (Equipo, Clientes, Catálogo público) como **Dueño**. El cajero
  aparece en el Equipo del dueño, así que ambas cuentas cuentan la misma historia.
- **Siembra con reinicio.** El script de datos borra y recrea sólo la tienda demo
  (ventas, clientes, equipo, stock) en la base **local**, para que cada grabación
  empiece igual. Nunca corre contra producción (pos-nest en Vercel/Neon).
- **Backend:** `POS-Nest` en `feat/stores-team` (la rama con la API de equipo y
  catálogo público) corriendo en `localhost:3000`.
- **El gráfico destacado y las piezas de GitHub se quedan como están.**

## Guion (propuesta; ~30 s)

| Tiempo | Escena | Fuente | Texto en pantalla |
|---|---|---|---|
| 0–3 s | Icono entra sobre fondo oscuro | icono | "Vende en segundos." |
| 3–13 s | Venta real como Cajero: deslizar 2–3 productos al carrito, abrir carrito, cobrar (con efectos de sonido) | **grabación** | "Desliza para agregar" → "Cobra en un toque" |
| 13–18 s | Historial y detalle de una venta | capturas | "Todas tus ventas, al día." |
| 18–25 s | Mi tienda: Equipo, Clientes, Catálogo público (3 capturas rápidas) | capturas | "Tu equipo, tus clientes y tu catálogo en línea." |
| 25–30 s | Cierre: icono, "Mini POS", "Disponible en Google Play" | icono | — |

El teléfono va en un marco simple dibujado en código (sin el diseño de un fabricante),
sobre el fondo de la marca, con el texto al lado.

## Partes

1. **Datos de demostración.** La tienda del usuario demo con: productos con foto
   (como hoy, `thumbs.py`), 2–3 personas en el equipo, algunos clientes, varios
   productos públicos y ventas previas para que el historial no esté vacío. Que se
   pueda volver a sembrar con un script.
2. **Capturas.** Ampliar `promo/tools/shoot.js` con las pantallas de Mi tienda (como Dueño; las de venta como Cajero)
   (equipo, clientes, catálogo público) y volver a tomar las existentes. Las
   capturas nuevas también reemplazan las de `promo/playstore/` y `promo/screenshots/`
   (regenerando con `promo.py`).
3. **Grabación.** Un script nuevo junto a `shoot.js` que graba la venta real en el
   mismo viewport de teléfono y deja un `.mp4` o secuencia de cuadros.
4. **Video.** Proyecto Remotion en `promo/video/` que arma el guion con la
   grabación, las capturas y el icono, y lo exporta a `promo/video/out/minipos-promo.mp4`.
5. **Instrucciones** en `promo/README.md` para regenerar todo.

## Lo que queda a criterio del constructor

- Cómo grabar (screencast de Puppeteer, cuadros de CDP + ffmpeg, etc.) y a qué escala.
- Cómo se ve el toque/deslizamiento (p. ej. un punto que sigue al dedo, añadido en Remotion).
- Animaciones exactas, transiciones y tiempos dentro de cada escena.
- Cómo sembrar los datos (API o script contra la base local).
- Versión de Remotion y estructura del proyecto (`promo/video/` con su propio `package.json`, fuera del build de la app).
