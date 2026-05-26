"""
AKTIVITÄTSMESSER — PWA Icon Generator (final)

Ring exactly matches the approved preview (white bg, gray track, olive arc,
gap at upper-left like the app). Letter A added in center without touching ring.

Arc: starts at 12 o'clock (top), goes CLOCKWISE for 288° (80% fill).
Gap: ~72° at upper-left (between ~8 o'clock and 12 o'clock).

In atan2 screen coords (y-down), angles normalised to [0, 2π]:
  0        = 3 o'clock (right)
  π/2      = 6 o'clock (bottom)
  π        = 9 o'clock (left)
  3π/2     = 12 o'clock (top)   ← arc starts here
  3π/2 + 288°×π/180 mod 2π ≈ 3.456 ≈ 198° ← arc ends here (~8 o'clock)
  Gap: from 3.456 to 4.712 (upper-left quadrant, ~9–12 o'clock area)
"""
import struct, zlib, math, os

OLIVE      = (103, 126, 61)   # #677E3D
WHITE      = (255, 255, 255)
GRAY_TRACK = (238, 238, 238)  # #EEEEEE


# ── PNG encoder ──────────────────────────────────────────────────────────────
def make_png(pixels, w, h):
    def chunk(t, d):
        c = t + d
        return struct.pack('>I', len(d)) + c + struct.pack('>I', zlib.crc32(c) & 0xFFFFFFFF)
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
    raw  = b''.join(b'\x00' + bytes(v for px in row for v in px) for row in pixels)
    idat = chunk(b'IDAT', zlib.compress(raw, 9))
    return sig + ihdr + idat + chunk(b'IEND', b'')

def clamp(v):     return max(0, min(255, int(v)))
def blend(fg, bg, a): return tuple(clamp(fg[i]*a + bg[i]*(1-a)) for i in range(3))
def seg_dist(px, py, ax, ay, bx, by):
    dx, dy = bx-ax, by-ay
    t = max(0., min(1., ((px-ax)*dx + (py-ay)*dy) / (dx*dx + dy*dy + 1e-12)))
    return math.hypot(px-(ax+t*dx), py-(ay+t*dy))


# ── Icon renderer ─────────────────────────────────────────────────────────────
def gen_icon(size):
    sc = size / 192.0
    cx = cy = size / 2.0
    aa = 1.5

    # Ring
    ring_r   = 73.0 * sc
    stroke_w = 23.0 * sc
    outer_r  = ring_r + stroke_w / 2.0
    inner_r  = ring_r - stroke_w / 2.0
    cap_r    = stroke_w / 2.0

    # Arc: 288° clockwise from top (3π/2), gap at upper-left
    ARC_START = 3 * math.pi / 2          # top (12 o'clock), normalised [0,2π]
    ARC_SPAN  = 288.0 * math.pi / 180.0  # 288° in radians
    ARC_END   = (ARC_START + ARC_SPAN) % (2 * math.pi)   # ≈ 3.456 rad (~8 o'clock)

    # Cap circle centres (on the ring centre-line)
    cap_sx = cx + ring_r * math.cos(ARC_START)   # top → (cx, cy - ring_r)
    cap_sy = cy + ring_r * math.sin(ARC_START)
    cap_ex = cx + ring_r * math.cos(ARC_END)
    cap_ey = cy + ring_r * math.sin(ARC_END)

    def in_arc(a):
        """True if normalised angle a (in [0,2π]) falls inside the 288° arc."""
        # Arc goes from ARC_START clockwise to ARC_END, wrapping past 2π.
        # Because ARC_START (4.712) > ARC_END (3.456), the arc wraps through 0:
        #   in arc  ↔  a >= ARC_START  OR  a <= ARC_END
        return a >= ARC_START or a <= ARC_END

    # Letter "A" — sized to fit clearly inside the inner ring hole
    a_h  = inner_r * 0.85          # height: 85% of inner radius × 2 … fits with margin
    a_w  = a_h * 0.68              # width
    a_st = a_h * 0.13              # stroke half-width
    # Vertices
    apex  = (cx,         cy - a_h / 2)
    bl    = (cx - a_w/2, cy + a_h / 2)
    br    = (cx + a_w/2, cy + a_h / 2)
    # Crossbar at 52% from top
    cb_y  = cy - a_h/2 + a_h * 0.52
    cbl   = (cx - a_w * 0.27, cb_y)
    cbr   = (cx + a_w * 0.27, cb_y)

    pixels = []
    for yi in range(size):
        row = []
        for xi in range(size):
            px = xi + 0.5
            py = yi + 0.5
            dx = px - cx
            dy = py - cy
            dist  = math.hypot(dx, dy)
            angle = math.atan2(dy, dx) % (2 * math.pi)  # normalised [0, 2π]

            # 1. White background
            col = WHITE

            # 2. Gray track (full circle)
            d_track = abs(dist - ring_r) - stroke_w / 2.0
            if d_track < aa:
                col = blend(GRAY_TRACK, col, max(0., min(1., (aa - d_track) / aa)))

            # 3. Olive arc fill + rounded caps
            d_band     = abs(dist - ring_r) - stroke_w / 2.0
            d_cap_s    = math.hypot(px - cap_sx, py - cap_sy) - cap_r
            d_cap_e    = math.hypot(px - cap_ex, py - cap_ey) - cap_r

            arc_a = 0.0
            if in_arc(angle) and d_band < aa:
                arc_a = max(arc_a, max(0., min(1., (aa - d_band) / aa)))
            if d_cap_s < aa:
                arc_a = max(arc_a, max(0., min(1., (aa - d_cap_s) / aa)))
            if d_cap_e < aa:
                arc_a = max(arc_a, max(0., min(1., (aa - d_cap_e) / aa)))
            if arc_a > 0:
                col = blend(OLIVE, col, arc_a)

            # 4. Olive letter "A"
            d_a = min(
                seg_dist(px, py, apex[0], apex[1], bl[0],  bl[1]),
                seg_dist(px, py, apex[0], apex[1], br[0],  br[1]),
                seg_dist(px, py, cbl[0],  cbl[1],  cbr[0], cbr[1]),
            ) - a_st
            if d_a < aa:
                col = blend(OLIVE, col, max(0., min(1., (aa - d_a) / aa)))

            row.append(col)
        pixels.append(row)
    return pixels


# ── Write files ───────────────────────────────────────────────────────────────
targets = [
    ('/home/claude/repo/aktivitaetsmesser/icon-192.png',  192),
    ('/home/claude/repo/aktivitaetsmesser/icon-512.png',  512),
    ('/home/claude/repo/previews/icon-final-preview.png', 192),
]
for path, sz in targets:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    data = make_png(gen_icon(sz), sz, sz)
    with open(path, 'wb') as f:
        f.write(data)
    print(f'OK: {os.path.basename(path)} ({sz}px, {len(data)//1024}KB)')
