"""Genera material promocional (Play Store + GitHub) a partir de capturas reales."""
import math
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
SHOTS = os.path.join(HERE, "shots")
ICON = "/Users/feliperamirez/Documents/projects/POS/POS_APP/assets/icon.png"
OUT = os.environ.get("PROMO_OUT", os.path.join(HERE, "promo"))

FONT_TTC = "/System/Library/Fonts/Avenir Next.ttc"
BOLD, DEMI, MEDIUM, REGULAR = 0, 2, 5, 7


def font(size, face=BOLD):
    return ImageFont.truetype(FONT_TTC, size, index=face)


# Paleta tomada del ícono de la app (toldo coral + fachada slate)
CORAL = (233, 78, 60)
CORAL_HI = (246, 124, 96)
SLATE = (63, 92, 116)
INK = (9, 13, 22)
INK_2 = (22, 30, 48)
WHITE = (255, 255, 255)
MUTED = (163, 178, 199)


# --------------------------------------------------------------------------- utilidades


def rounded_mask(size, radius, supersample=4):
    w, h = size
    m = Image.new("L", (w * supersample, h * supersample), 0)
    ImageDraw.Draw(m).rounded_rectangle(
        [0, 0, w * supersample - 1, h * supersample - 1], radius=radius * supersample, fill=255
    )
    return m.resize((w, h), Image.LANCZOS)


def shadow(layer, blur=40, spread=0, color=(0, 0, 0, 170), offset=(0, 24)):
    """Sombra suave derivada del canal alfa de `layer`."""
    a = layer.split()[-1]
    if spread:
        a = a.filter(ImageFilter.MaxFilter(spread * 2 + 1))
    s = Image.new("RGBA", layer.size, color)
    s.putalpha(a)
    pad = blur * 3
    canvas = Image.new("RGBA", (layer.width + pad * 2, layer.height + pad * 2), (0, 0, 0, 0))
    canvas.paste(s, (pad + offset[0], pad + offset[1]), s)
    return canvas.filter(ImageFilter.GaussianBlur(blur)), pad


def linear_gradient(size, top, bottom, angle=90):
    """Degradado lineal; angle 90 = vertical, 0 = horizontal."""
    w, h = size
    base = Image.new("RGB", (w, h))
    px = base.load()
    rad = math.radians(angle)
    dx, dy = math.cos(rad), math.sin(rad)
    denom = abs(dx) * w + abs(dy) * h or 1
    for y in range(h):
        for x in range(w):
            t = (x * dx + y * dy) / denom
            t = min(1.0, max(0.0, t if (dx >= 0 and dy >= 0) else t + 1))
            px[x, y] = tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
    return base


def glow(canvas, center, radius, color, alpha=90):
    """Mancha de luz radial sobre el fondo."""
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse(
        [center[0] - radius, center[1] - radius, center[0] + radius, center[1] + radius],
        fill=color + (alpha,),
    )
    layer = layer.filter(ImageFilter.GaussianBlur(radius * 0.55))
    canvas.alpha_composite(layer)


def background(size, tilt=False):
    bg = linear_gradient(size, (13, 18, 30), (7, 10, 18), angle=90).convert("RGBA")
    w, h = size
    glow(bg, (w * 0.18, h * 0.08), int(min(w, h) * 0.55), CORAL, 60)
    glow(bg, (w * 0.92, h * 0.85), int(min(w, h) * 0.6), SLATE, 80)
    glow(bg, (w * 0.75, h * 0.05), int(min(w, h) * 0.3), (130, 49, 211), 45)
    return bg


def text(draw, xy, s, f, fill=WHITE, anchor="la", spacing=0):
    draw.text(xy, s, font=f, fill=fill, anchor=anchor) if not spacing else _tracked(
        draw, xy, s, f, fill, anchor, spacing
    )


def _tracked(draw, xy, s, f, fill, anchor, spacing):
    widths = [draw.textlength(c, font=f) for c in s]
    total = sum(widths) + spacing * (len(s) - 1)
    x, y = xy
    if anchor[0] == "m":
        x -= total / 2
    for c, cw in zip(s, widths):
        draw.text((x, y), c, font=f, fill=fill, anchor="l" + anchor[1])
        x += cw + spacing


# --------------------------------------------------------------------------- mockup


def device(shot_path, width, radius_ratio=0.085, bezel_ratio=0.028):
    """Envuelve una captura en un marco de teléfono con bisel y notch."""
    shot = Image.open(shot_path).convert("RGB")
    bezel = max(2, round(width * bezel_ratio))
    inner_w = width - bezel * 2
    inner_h = round(inner_w * shot.height / shot.width)
    shot = shot.resize((inner_w, inner_h), Image.LANCZOS)

    height = inner_h + bezel * 2
    radius = round(width * radius_ratio)

    frame = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    body = Image.new("RGBA", (width, height), (16, 18, 26, 255))
    body.putalpha(rounded_mask((width, height), radius))
    frame.alpha_composite(body)

    screen = Image.new("RGBA", (inner_w, inner_h))
    screen.paste(shot)
    screen.putalpha(rounded_mask((inner_w, inner_h), max(1, radius - bezel)))
    frame.alpha_composite(screen, (bezel, bezel))

    # borde superior brillante que da sensación de vidrio
    edge = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    ed = ImageDraw.Draw(edge)
    ed.rounded_rectangle([0, 0, width - 1, height - 1], radius=radius, outline=(255, 255, 255, 46), width=max(2, bezel // 3))
    frame.alpha_composite(edge)

    return frame


def place(canvas, layer, xy, blur=46, offset=(0, 26), alpha=185):
    sh, pad = shadow(layer, blur=blur, color=(0, 0, 0, alpha), offset=offset)
    canvas.alpha_composite(sh, (xy[0] - pad, xy[1] - pad))
    canvas.alpha_composite(layer, xy)


def wrap(draw, s, f, max_w):
    words, lines, cur = s.split(), [], ""
    for w in words:
        probe = (cur + " " + w).strip()
        if draw.textlength(probe, font=f) <= max_w or not cur:
            cur = probe
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def badge(draw, xy, label, f, fg=CORAL_HI, bg=(233, 78, 60, 38), pad=(22, 11), radius=999):
    w = draw.textlength(label, font=f)
    h = f.size
    x, y = xy
    draw.rounded_rectangle(
        [x, y, x + w + pad[0] * 2, y + h + pad[1] * 2], radius=radius, fill=bg, outline=(233, 78, 60, 110), width=2
    )
    draw.text((x + pad[0], y + pad[1] - h * 0.08), label, font=f, fill=fg)
    return h + pad[1] * 2


def app_icon(size):
    ic = Image.open(ICON).convert("RGBA")
    return ic.resize((size, size), Image.LANCZOS)


# --------------------------------------------------------------------------- piezas

SCREENS = [
    ("01-productos", "Tu inventario,\nsiempre a la mano", "Busca, filtra y controla existencias en segundos"),
    ("02-agregar-al-carrito", "Vende con\nun solo gesto", "Desliza el producto y ya está en el carrito"),
    ("03-carrito", "Cobra rápido,\nsin errores", "Totales automáticos y control de stock en vivo"),
    ("04-historial", "Todas tus ventas\nen un historial", "Consulta cada orden con su total y su fecha"),
    ("06-detalle-venta", "El detalle de\ncada venta", "Productos, cantidades y subtotales al instante"),
    ("05-perfil", "Tu negocio,\na tu manera", "Tema claro u oscuro y tres idiomas disponibles"),
]


def play_screenshot(idx, key, headline, sub):
    W, H = 1080, 1920
    bg = background((W, H))
    d = ImageDraw.Draw(bg)

    f_head = font(72, BOLD)
    f_sub = font(36, MEDIUM)

    y = 112
    for line in headline.split("\n"):
        d.text((W // 2, y), line, font=f_head, fill=WHITE, anchor="ma")
        y += 88
    y += 16
    for line in wrap(d, sub, f_sub, W - 220):
        d.text((W // 2, y), line, font=f_sub, fill=MUTED, anchor="ma")
        y += 50

    # el teléfono entra completo: así la barra de pestañas queda visible
    top = y + 66
    phone = device(os.path.join(SHOTS, f"{key}.png"), 690)
    top = min(top, H - 56 - phone.height)
    place(bg, phone, ((W - phone.width) // 2, top), blur=60, offset=(0, 34), alpha=200)

    # línea de acento inferior
    d.rectangle([0, H - 10, W, H], fill=CORAL)
    out = os.path.join(OUT, "playstore", f"screenshot-{idx:02d}-{key.split('-', 1)[1]}.png")
    bg.convert("RGB").save(out, optimize=True)
    print("  ", os.path.relpath(out, OUT))


def feature_graphic():
    """Gráfico destacado de Play Store: 1024x500."""
    W, H = 1024, 500
    bg = background((W, H))
    d = ImageDraw.Draw(bg, "RGBA")

    ic = app_icon(84)
    bg.alpha_composite(ic, (74, 92))
    d.text((176, 104), "Mini POS", font=font(62, BOLD), fill=WHITE)
    d.text((178, 176), "PUNTO DE VENTA", font=font(22, DEMI), fill=CORAL_HI)

    f_tag = font(31, MEDIUM)
    y = 246
    for line in wrap(d, "Inventario, ventas e historial de tu tienda, desde el celular.", f_tag, 480):
        d.text((76, y), line, font=f_tag, fill=MUTED)
        y += 44

    # Los rellenos translúcidos van en su propia capa: PIL no mezcla al dibujar sobre RGBA
    chips = Image.new("RGBA", bg.size, (0, 0, 0, 0))
    cd = ImageDraw.Draw(chips)
    f_b = font(22, DEMI)
    bx = 78
    for label in ["Código de barras", "3 idiomas"]:
        w = cd.textlength(label, font=f_b)
        cd.rounded_rectangle(
            [bx, y + 20, bx + w + 34, y + 20 + 44], radius=22, fill=(255, 255, 255, 30), outline=(255, 255, 255, 80)
        )
        cd.text((bx + 17, y + 30), label, font=f_b, fill=WHITE)
        bx += w + 34 + 14
    bg.alpha_composite(chips)

    # dos teléfonos a la derecha, con el principal al frente
    back = device(os.path.join(SHOTS, "04-historial.png"), 206).rotate(-7, expand=True, resample=Image.BICUBIC)
    place(bg, back, (808, 104), blur=34, offset=(0, 18), alpha=170)
    front = device(os.path.join(SHOTS, "01-productos.png"), 244)
    place(bg, front, (596, 126), blur=44, offset=(0, 24), alpha=195)

    out = os.path.join(OUT, "playstore", "feature-graphic-1024x500.png")
    bg.convert("RGB").save(out, optimize=True)
    print("  ", os.path.relpath(out, OUT))


def github_banner():
    """Banner ancho para el README / social preview: 1280x640."""
    W, H = 1280, 640
    bg = background((W, H))
    d = ImageDraw.Draw(bg)

    ic = app_icon(88)
    cx = W // 2
    bg.alpha_composite(ic, (cx - 44, 40))

    d.text((cx, 144), "Mini POS", font=font(74, BOLD), fill=WHITE, anchor="ma")
    _tracked(d, (cx, 232), "PUNTO DE VENTA · IONIC + ANGULAR + NESTJS", font(20, DEMI), CORAL_HI, "ma", 3)

    f_tag = font(29, MEDIUM)
    d.text((cx, 276), "Controla inventario, cobra y consulta tus ventas desde el celular.",
           font=f_tag, fill=MUTED, anchor="ma")

    # tres teléfonos en abanico, sangrando por abajo
    specs = [
        ("04-historial", 244, -8, (196, 372)),
        ("03-carrito", 244, 8, (856, 372)),
        ("01-productos", 286, 0, (cx - 143, 340)),
    ]
    for key, w, rot, xy in specs:
        ph = device(os.path.join(SHOTS, f"{key}.png"), w)
        if rot:
            ph = ph.rotate(rot, expand=True, resample=Image.BICUBIC)
        place(bg, ph, xy, blur=46, offset=(0, 24), alpha=190)

    out = os.path.join(OUT, "github", "banner-1280x640.png")
    bg.convert("RGB").save(out, optimize=True)
    print("  ", os.path.relpath(out, OUT))


def github_hero():
    """Tira de capturas para el README: 2400x1000."""
    W, H = 2400, 1000
    bg = background((W, H))
    d = ImageDraw.Draw(bg)
    keys = ["00-login", "01-productos", "03-carrito", "04-historial", "05-perfil"]
    labels = ["Acceso", "Productos", "Carrito", "Historial", "Perfil"]
    pw = 380
    gap = 40
    total = pw * len(keys) + gap * (len(keys) - 1)
    x = (W - total) // 2
    f_l = font(30, DEMI)
    for key, label in zip(keys, labels):
        ph = device(os.path.join(SHOTS, f"{key}.png"), pw)
        place(bg, ph, (x, 120), blur=40, offset=(0, 22), alpha=185)
        d.text((x + pw // 2, 60), label, font=f_l, fill=MUTED, anchor="ma")
        x += pw + gap
    out = os.path.join(OUT, "github", "screens-2400x1000.png")
    bg.convert("RGB").save(out, optimize=True)
    print("  ", os.path.relpath(out, OUT))


def store_icon():
    """Ícono 512x512 para la ficha de Play Store (sin transparencia)."""
    S = 512
    bg = linear_gradient((S, S), (245, 247, 250), (214, 222, 233), angle=90).convert("RGBA")
    ic = app_icon(int(S * 0.66))
    bg.alpha_composite(ic, ((S - ic.width) // 2, (S - ic.height) // 2))
    out = os.path.join(OUT, "playstore", "icon-512x512.png")
    bg.convert("RGB").save(out, optimize=True)
    print("  ", os.path.relpath(out, OUT))


if __name__ == "__main__":
    for sub in ("playstore", "github", "screenshots"):
        os.makedirs(os.path.join(OUT, sub), exist_ok=True)

    print("Play Store:")
    for i, (key, head, sub) in enumerate(SCREENS, start=1):
        play_screenshot(i, key, head, sub)
    feature_graphic()
    store_icon()

    print("GitHub:")
    github_banner()
    github_hero()

    print("Capturas limpias:")
    for f in sorted(os.listdir(SHOTS)):
        if f.endswith(".png"):
            Image.open(os.path.join(SHOTS, f)).save(os.path.join(OUT, "screenshots", f), optimize=True)
    print("  ", len(os.listdir(os.path.join(OUT, "screenshots"))), "archivos")
    print("listo ->", OUT)
