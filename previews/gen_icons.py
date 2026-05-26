import struct
import zlib
import math
import os

SIZE = 192

# Colors
OLIVE = (103, 126, 61)
WHITE = (255, 255, 255)
OFF_WHITE = (245, 245, 243)


def make_png(pixels, width, height):
    """Encode pixel array (list of [r,g,b,a] rows) as PNG bytes."""
    def png_chunk(chunk_type, data):
        c = chunk_type + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xFFFFFFFF)

    # PNG signature
    sig = b'\x89PNG\r\n\x1a\n'

    # IHDR
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)  # 8-bit RGB
    ihdr = png_chunk(b'IHDR', ihdr_data)

    # IDAT: filter byte 0 (None) per row
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


def lerp_color(c1, c2, t):
    t = max(0.0, min(1.0, t))
    return tuple(clamp(c1[i] * (1 - t) + c2[i] * t) for i in range(3))


# ─────────────────────────────────────────────
# Option 1: Progress Ring
# ─────────────────────────────────────────────
def gen_ring():
    cx = cy = SIZE / 2
    ring_r = SIZE * 0.65 / 2       # ~62.4 px radius
    stroke = SIZE * 0.12 / 2       # half-stroke width ~11.5 px
    center_r = SIZE * 0.08 / 2     # center dot radius ~7.7 px
    aa = 1.5                       # anti-alias width in pixels

    # Arc covers 270° starting from ~135° (bottom-left) going clockwise
    # Gap at top-right (around 45°)
    arc_start = math.radians(135)   # start angle
    arc_end   = math.radians(45)    # end angle (going clockwise, so gap from 45..135)

    def angle_in_arc(angle):
        """True if angle is inside the 270° arc (clockwise from 135° to 45°)."""
        # Normalize angle to [0, 2pi)
        a = angle % (2 * math.pi)
        s = arc_start % (2 * math.pi)  # 135° = 2.356
        e = arc_end % (2 * math.pi)    # 45°  = 0.785
        # Arc goes clockwise from s=135° through 180°, 270°, 0°, to e=45°
        # That means the GAP is from e=45° to s=135° (going clockwise 90°)
        # Equivalently: point is IN the arc if it's NOT in [45°..135°]
        if e < s:
            # arc wraps around 0: in arc if a >= s OR a <= e
            return a >= s or a <= e
        else:
            return s <= a <= e

    pixels = []
    for y in range(SIZE):
        row = []
        for x in range(SIZE):
            dx = x - cx + 0.5
            dy = y - cy + 0.5
            dist = math.sqrt(dx * dx + dy * dy)
            angle = math.atan2(dy, dx)

            # Background
            px = list(OLIVE)

            # ── Center dot ──
            d_center = dist - center_r
            if d_center < aa:
                alpha = max(0.0, min(1.0, (aa - d_center) / aa))
                px = list(blend(WHITE, OLIVE, alpha))

            # ── Ring arc ──
            d_ring = abs(dist - ring_r) - stroke
            if d_ring < aa:
                # Check angular position (with soft end-cap blending)
                in_arc = angle_in_arc(angle)
                if in_arc:
                    alpha_ring = max(0.0, min(1.0, (aa - d_ring) / aa))

                    # Soft cap at arc ends: fade near the gap edges
                    # Gap is from 45° (π/4) to 135° (3π/4) clockwise
                    # That's just the 90° region. Let's fade within 5° of each cap.
                    fade_deg = 8.0
                    fade_rad = math.radians(fade_deg)
                    a_norm = angle % (2 * math.pi)
                    # Cap 1 at 135° (arc start)
                    diff1 = abs(a_norm - arc_start % (2 * math.pi))
                    diff1 = min(diff1, 2 * math.pi - diff1)
                    # Cap 2 at 45° (arc end)
                    diff2 = abs(a_norm - arc_end % (2 * math.pi))
                    diff2 = min(diff2, 2 * math.pi - diff2)
                    cap_fade = min(1.0, min(diff1, diff2) / fade_rad)
                    alpha_ring *= cap_fade

                    px = list(blend(WHITE, tuple(px), alpha_ring))

            row.append(px)
        pixels.append(row)

    return pixels


# ─────────────────────────────────────────────
# Option 2: Monogram "A"
# ─────────────────────────────────────────────
def gen_monogram():
    """Draw a bold geometric sans-serif 'A' using line-segment distance functions."""
    cx = cy = SIZE / 2
    aa = 1.2

    # Letter "A" geometry (normalized to [-0.5, 0.5] space, then scaled)
    # Height of letter: ~55% of SIZE = 105.6 px
    letter_h = SIZE * 0.55
    letter_w = letter_h * 0.72   # aspect ratio
    stroke_w = letter_h * 0.13   # stroke half-width
    crossbar_y_frac = 0.42       # crossbar position from bottom

    # Coordinate origin: center of icon
    # Bottom of letter at cy + letter_h/2, top at cy - letter_h/2
    top    = cy - letter_h / 2
    bottom = cy + letter_h / 2
    left   = cx - letter_w / 2
    right  = cx + letter_w / 2

    # Apex
    apex = (cx, top)
    bot_left  = (left,  bottom)
    bot_right = (right, bottom)

    crossbar_y = bottom - letter_h * crossbar_y_frac
    # Crossbar endpoints: where the diagonals are at crossbar_y
    # Left diagonal: from apex to bot_left, parametric
    t_left = (crossbar_y - top) / (bottom - top)
    cb_left  = (apex[0] + t_left * (bot_left[0] - apex[0]),  crossbar_y)
    cb_right = (apex[0] + t_left * (bot_right[0] - apex[0]), crossbar_y)
    # Pull crossbar slightly inward
    cb_inset = stroke_w * 0.2
    cb_left  = (cb_left[0]  + cb_inset, crossbar_y)
    cb_right = (cb_right[0] - cb_inset, crossbar_y)

    def seg_dist(px, py, ax, ay, bx, by):
        """Signed distance from point to line segment."""
        dx, dy = bx - ax, by - ay
        t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy + 1e-12)
        t = max(0.0, min(1.0, t))
        qx = ax + t * dx
        qy = ay + t * dy
        return math.sqrt((px - qx) ** 2 + (py - qy) ** 2)

    pixels = []
    for y in range(SIZE):
        row = []
        for x in range(SIZE):
            px_coord = x + 0.5
            py_coord = y + 0.5

            # Distance to each stroke
            d_left  = seg_dist(px_coord, py_coord, apex[0], apex[1], bot_left[0],  bot_left[1])
            d_right = seg_dist(px_coord, py_coord, apex[0], apex[1], bot_right[0], bot_right[1])
            d_cross = seg_dist(px_coord, py_coord, cb_left[0], cb_left[1], cb_right[0], cb_right[1])

            d_min = min(d_left, d_right, d_cross) - stroke_w
            alpha = max(0.0, min(1.0, (aa - d_min) / aa)) if d_min < aa else 0.0

            if alpha > 0:
                row.append(list(blend(WHITE, OLIVE, alpha)))
            else:
                row.append(list(OLIVE))
        pixels.append(row)

    return pixels


# ─────────────────────────────────────────────
# Option 3: Checkmark on rounded square
# ─────────────────────────────────────────────
def gen_check():
    cx = cy = SIZE / 2
    aa = 1.5

    # Rounded square
    sq_half = SIZE * 0.70 / 2      # half-size of square
    corner_r = sq_half * 0.30      # corner radius

    def rounded_rect_dist(px, py):
        """SDF for rounded rectangle centered at (cx,cy)."""
        qx = abs(px - cx) - sq_half + corner_r
        qy = abs(py - cy) - sq_half + corner_r
        return (math.sqrt(max(qx, 0) ** 2 + max(qy, 0) ** 2)
                + min(max(qx, qy), 0)
                - corner_r)

    # Checkmark: two line segments forming a ✓
    # Relative to center of the rounded square
    # Short left arm: from bottom-left inward-up
    # Long right arm: from that junction to top-right
    ck_scale = sq_half * 1.0
    stroke_w = sq_half * 0.175   # half-stroke

    # Check vertices (offsets from center)
    v0 = (cx - ck_scale * 0.38, cy + ck_scale * 0.05)   # left tip
    v1 = (cx - ck_scale * 0.05, cy + ck_scale * 0.38)   # bottom junction
    v2 = (cx + ck_scale * 0.42, cy - ck_scale * 0.32)   # top-right tip

    def seg_dist(px, py, ax, ay, bx, by):
        dx, dy = bx - ax, by - ay
        t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy + 1e-12)
        t = max(0.0, min(1.0, t))
        qx = ax + t * dx
        qy = ay + t * dy
        return math.sqrt((px - qx) ** 2 + (py - qy) ** 2)

    pixels = []
    for y in range(SIZE):
        row = []
        for x in range(SIZE):
            px = x + 0.5
            py = y + 0.5

            # Background
            color = list(OFF_WHITE)

            # Rounded square fill
            d_sq = rounded_rect_dist(px, py)
            if d_sq < aa:
                alpha_sq = max(0.0, min(1.0, (aa - d_sq) / aa))
                color = list(blend(OLIVE, OFF_WHITE, alpha_sq))

            # Checkmark (only drawn inside square region)
            if d_sq < stroke_w + aa * 2:
                d_ck1 = seg_dist(px, py, v0[0], v0[1], v1[0], v1[1])
                d_ck2 = seg_dist(px, py, v1[0], v1[1], v2[0], v2[1])
                d_ck = min(d_ck1, d_ck2) - stroke_w
                if d_ck < aa:
                    alpha_ck = max(0.0, min(1.0, (aa - d_ck) / aa))
                    bg_at_point = list(blend(OLIVE, OFF_WHITE, max(0.0, min(1.0, (aa - d_sq) / aa))))
                    color = list(blend(WHITE, tuple(bg_at_point), alpha_ck))

            row.append(color)
        pixels.append(row)

    return pixels


# ─────────────────────────────────────────────
# Write files
# ─────────────────────────────────────────────
out_dir = '/home/claude/repo/previews'
os.makedirs(out_dir, exist_ok=True)

files = [
    ('icon-preview-ring.png',      gen_ring),
    ('icon-preview-mono.png',      gen_monogram),
    ('icon-preview-check.png',     gen_check),
]

for fname, gen_fn in files:
    pixels = gen_fn()
    data = make_png(pixels, SIZE, SIZE)
    path = os.path.join(out_dir, fname)
    with open(path, 'wb') as f:
        f.write(data)
    print(f'Done: {fname}')
