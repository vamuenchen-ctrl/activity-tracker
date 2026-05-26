import struct
import zlib
import math
import os


# Colors
OLIVE = (103, 126, 61)
WHITE = (255, 255, 255)
GRAY_TRACK = (238, 238, 238)


def make_png(pixels, width, height):
    """Encode pixel array (list of [r,g,b] rows) as PNG bytes."""
    def png_chunk(chunk_type, data):
        c = chunk_type + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xFFFFFFFF)

    sig = b'\x89PNG\r\n\x1a\n'

    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)  # 8-bit RGB
    ihdr = png_chunk(b'IHDR', ihdr_data)

    raw_rows = []
    for row in pixels:
        row_bytes = bytearray([0])  # filter type None
        for r, g, b in row:
            row_bytes += bytearray([r, g, b])
        raw_rows.append(bytes(row_bytes))

    raw_data = b''.join(raw_rows)
    compressed = zlib.compress(raw_data, 9)
    idat = png_chunk(b'IDAT', compressed)

    iend = png_chunk(b'IEND', b'')

    return sig + ihdr + idat + iend


def clamp(v, lo=0, hi=255):
    return max(lo, min(hi, int(v)))


def blend(fg, bg, alpha):
    """Alpha blend fg over bg. alpha in [0,1]."""
    return tuple(clamp(fg[i] * alpha + bg[i] * (1 - alpha)) for i in range(3))


def dist_to_segment(px, py, ax, ay, bx, by):
    dx, dy = bx - ax, by - ay
    lenSq = dx * dx + dy * dy
    if lenSq == 0:
        return math.sqrt((px - ax) ** 2 + (py - ay) ** 2)
    t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / lenSq))
    return math.sqrt((px - (ax + t * dx)) ** 2 + (py - (ay + t * dy)) ** 2)


def gen_ring_with_a(size):
    """
    Draw a progress ring (270° arc, olive on gray track, white background)
    with an olive green letter 'A' centered inside the ring hole.

    Ring parameters (at size=192): cx=cy=96, ring_r=73, stroke_w=23
    All scaled by size/192.
    """
    scale = size / 192.0
    cx = cy = size / 2.0

    # Ring parameters
    ring_r   = 73.0 * scale
    stroke_w = 23.0 * scale
    aa = 1.5

    # Arc: 270° clockwise from 135° to 45° (gap from 45° to 135°)
    arc_start = math.radians(135)
    arc_end   = math.radians(45)

    def angle_in_arc(angle):
        a = angle % (2 * math.pi)
        s = arc_start % (2 * math.pi)  # ~2.356
        e = arc_end   % (2 * math.pi)  # ~0.785
        # arc wraps past 0: in arc if a >= s OR a <= e
        return a >= s or a <= e

    # Rounded cap radius = half stroke width
    cap_r = stroke_w / 2.0

    # Cap centers at arc start (135°) and arc end (45°)
    cap_start = (
        cx + ring_r * math.cos(arc_start),
        cy + ring_r * math.sin(arc_start),
    )
    cap_end = (
        cx + ring_r * math.cos(arc_end),
        cy + ring_r * math.sin(arc_end),
    )

    # ── Letter "A" geometry ──
    inner_ring_r = ring_r - stroke_w / 2.0   # inner edge of ring
    a_height = inner_ring_r * 0.9
    a_width  = a_height * 0.65
    a_stroke = a_height * 0.14
    aa_a = 1.5

    a_top    = cy - a_height / 2.0
    a_bottom = cy + a_height / 2.0
    a_left   = cx - a_width  / 2.0
    a_right  = cx + a_width  / 2.0

    # Three segments of the "A"
    # 1. Left leg: top-center to bottom-left
    la = (cx,     a_top)
    lb = (a_left, a_bottom)
    # 2. Right leg: top-center to bottom-right
    ra = (cx,      a_top)
    rb = (a_right, a_bottom)
    # 3. Crossbar at 45% height from top
    cross_y = a_top + a_height * 0.45
    cba = (cx - a_width * 0.28, cross_y)
    cbb = (cx + a_width * 0.28, cross_y)

    # Precompute crossbar y offset: spec says cy - height*0.05
    # Re-read spec: crossbar at (cx - width*0.28, cy - height*0.05)
    # That means crossbar_y = cy - a_height * 0.05
    cross_y2 = cy - a_height * 0.05
    cba = (cx - a_width * 0.28, cross_y2)
    cbb = (cx + a_width * 0.28, cross_y2)

    pixels = []
    for y in range(size):
        row = []
        for x in range(size):
            px = x + 0.5
            py = y + 0.5
            dx = px - cx
            dy = py - cy
            dist = math.sqrt(dx * dx + dy * dy)
            angle = math.atan2(dy, dx)

            # ── Layer 1: White background ──
            color = list(WHITE)

            # ── Layer 2: Gray track ring ──
            d_track = abs(dist - ring_r) - stroke_w / 2.0
            if d_track < aa:
                alpha_track = max(0.0, min(1.0, (aa - d_track) / aa))
                color = list(blend(GRAY_TRACK, tuple(color), alpha_track))

            # ── Layer 3: Olive arc fill (with rounded caps) ──
            in_arc = angle_in_arc(angle)

            # Distance to the arc band
            d_arc_band = abs(dist - ring_r) - stroke_w / 2.0

            # Distance to the two rounded end caps
            d_cap_start = math.sqrt((px - cap_start[0]) ** 2 + (py - cap_start[1]) ** 2) - cap_r
            d_cap_end   = math.sqrt((px - cap_end[0])   ** 2 + (py - cap_end[1])   ** 2) - cap_r

            # A pixel is part of the olive arc if:
            # - it's in the arc band AND in the angular arc region, OR
            # - it's inside one of the rounded end caps
            in_arc_band = d_arc_band < aa

            # Check cap membership: caps cover the gap transition
            in_cap_start = d_cap_start < aa
            in_cap_end   = d_cap_end   < aa

            arc_alpha = 0.0
            if in_arc and in_arc_band:
                arc_alpha = max(arc_alpha, max(0.0, min(1.0, (aa - d_arc_band) / aa)))
            if in_cap_start:
                arc_alpha = max(arc_alpha, max(0.0, min(1.0, (aa - d_cap_start) / aa)))
            if in_cap_end:
                arc_alpha = max(arc_alpha, max(0.0, min(1.0, (aa - d_cap_end) / aa)))

            if arc_alpha > 0.0:
                color = list(blend(OLIVE, tuple(color), arc_alpha))

            # ── Layer 4: Letter "A" (olive, inside ring hole) ──
            d_ll = dist_to_segment(px, py, la[0], la[1], lb[0], lb[1])
            d_rl = dist_to_segment(px, py, ra[0], ra[1], rb[0], rb[1])
            d_cb = dist_to_segment(px, py, cba[0], cba[1], cbb[0], cbb[1])
            d_min = min(d_ll, d_rl, d_cb) - a_stroke / 2.0

            if d_min < aa_a:
                a_alpha = max(0.0, min(1.0, (aa_a - d_min) / aa_a))
                if a_alpha > 0.0:
                    color = list(blend(OLIVE, tuple(color), a_alpha))

            row.append(tuple(color))
        pixels.append(row)

    return pixels


# ── Generate and save all three files ──
outputs = [
    ('/home/claude/repo/aktivitaetsmesser/icon-192.png',        192),
    ('/home/claude/repo/aktivitaetsmesser/icon-512.png',        512),
    ('/home/claude/repo/previews/icon-final-preview.png',       192),
]

for path, size in outputs:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pixels = gen_ring_with_a(size)
    data = make_png(pixels, size, size)
    with open(path, 'wb') as f:
        f.write(data)
    print(f'OK: {path}')
