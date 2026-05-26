/* RINGANA web kit — small reusable primitives.
   Exported to window at the bottom so the other JSX files can use them.
*/

const { useState, useEffect, useRef } = React;

/* --------- Icon: thin wrapper around Lucide ---------- */
function Icon({ name, size = 18, stroke = 1.5, style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons({ icons: window.lucide.icons });
  }, [name]);
  return (
    <i
      ref={ref}
      data-lucide={name}
      style={{ width: size, height: size, display: 'inline-flex', strokeWidth: stroke, ...style }}
    ></i>
  );
}

/* --------- Wordmark ---------- */
function Wordmark({ size = 22, color }) {
  return (
    <span
      className="r-wordmark"
      style={{
        fontSize: size,
        letterSpacing: '0.16em',
        fontWeight: 500,
        color: color || 'inherit',
      }}
    >
      RINGANA
    </span>
  );
}

/* --------- Button ---------- */
function Button({ variant = 'primary', size = 'md', children, onClick, onColor, type = 'button', icon }) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size === 'lg' ? 'btn-lg' : size === 'sm' ? 'btn-sm' : '',
    onColor ? 'btn-on-color' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button className={cls} onClick={onClick} type={type}>
      {children}
      {icon && <Icon name={icon} size={16} />}
    </button>
  );
}

/* --------- Pill ---------- */
function Pill({ variant = 'default', children, dot = false }) {
  return (
    <span className={`pill pill-${variant}`}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}></span>}
      {children}
    </span>
  );
}

/* --------- Section helpers ---------- */
function SectionHead({ eyebrow, title, lead, action }) {
  return (
    <header className="section-head">
      <div>
        {eyebrow && (
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--fg-2)',
              marginBottom: 12,
            }}
          >
            {eyebrow}
          </div>
        )}
        <h2>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {action && <div style={{ alignSelf: 'end' }}>{action}</div>}
    </header>
  );
}

/* --------- Product image placeholder (no real photo available) ---------- */
function ProductImage({ bg, dark, label, big = false }) {
  return (
    <div className={`img ${dark ? 'dark' : ''}`} style={{ background: bg }}>
      <div className="placeholder" style={big ? { fontSize: 80 } : null}>
        {label}
      </div>
    </div>
  );
}

Object.assign(window, {
  Icon, Wordmark, Button, Pill, SectionHead, ProductImage,
});
