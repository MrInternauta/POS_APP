"""Genera miniaturas limpias (gradiente + monograma) para productos de demo."""
import os, math, unicodedata
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "thumbs")
os.makedirs(OUT, exist_ok=True)
FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
S = 512

# (id, nombre) de los productos que se ven arriba en la lista
PRODUCTS = [
    (130, "Aceite de oliva extra virgen 500ml"),
    (46, "Aceitunas en salmuera vermex"),
    (34, "Achiote"),
    (43, "Alcaparras en vinagre"),
    (95, "Arroz grano grande precissim"),
    (100, "Arroz prima 250g"),
    (104, "Arroz prima 500g"),
    (1, "Atrapa moscas Catca Max"),
    (2, "Atrapa moscas Trapamex"),
    (131, "Atun en agua 140g"),
    (31, "Axion 750"),
    (109, "Bimbunuelos"),
]

PALETTE = [
    ((34, 197, 94), (16, 122, 78)),
    ((249, 115, 22), (194, 65, 12)),
    ((59, 130, 246), (29, 78, 155)),
    ((236, 72, 153), (157, 23, 108)),
    ((168, 85, 247), (107, 33, 168)),
    ((14, 165, 233), (7, 89, 133)),
    ((245, 158, 11), (180, 83, 9)),
    ((239, 68, 68), (153, 27, 27)),
    ((20, 184, 166), (13, 108, 100)),
    ((99, 102, 241), (55, 48, 163)),
]


def initials(name):
    clean = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    words = [w for w in clean.split() if w[:1].isalpha()]
    if len(words) >= 2:
        return (words[0][0] + words[1][0]).upper()
    return words[0][:2].upper() if words else "??"


def gradient(a, b):
    img = Image.new("RGB", (S, S))
    px = img.load()
    for y in range(S):
        for x in range(S):
            t = (x + y) / (2 * S - 2)
            px[x, y] = tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))
    return img


for idx, (pid, name) in enumerate(PRODUCTS):
    a, b = PALETTE[idx % len(PALETTE)]
    img = gradient(a, b)
    d = ImageDraw.Draw(img, "RGBA")
    # anillo decorativo suave
    d.ellipse([S * 0.55, -S * 0.25, S * 1.35, S * 0.55], fill=(255, 255, 255, 26))
    d.ellipse([-S * 0.3, S * 0.6, S * 0.5, S * 1.4], fill=(0, 0, 0, 26))

    txt = initials(name)
    f = ImageFont.truetype(FONT, int(S * 0.38))
    bbox = d.textbbox((0, 0), txt, font=f)
    d.text(
        ((S - (bbox[2] - bbox[0])) / 2 - bbox[0], (S - (bbox[3] - bbox[1])) / 2 - bbox[1]),
        txt, font=f, fill=(255, 255, 255, 235),
    )
    path = os.path.join(OUT, f"{pid}.png")
    img.save(path)
    print(pid, txt, path)
