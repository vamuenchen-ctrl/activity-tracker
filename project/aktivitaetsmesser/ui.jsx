/* AKTIVITÄTSMESSER — shared UI primitives */

const { useEffect, useRef, useState, useLayoutEffect } = React;

/* ───── Icon (Lucide via global) ───── */
function Icon({ name, size = 18, stroke = 1.6, style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.lucide && ref.current) {
      // Re-create just this node
      ref.current.setAttribute('data-lucide', name);
      try { window.lucide.createIcons({ icons: window.lucide.icons, attrs: { 'stroke-width': stroke } }); } catch (e) {}
    }
  }, [name, stroke]);
  return (
    <i
      ref={ref}
      data-lucide={name}
      style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', strokeWidth: stroke, ...style }}
    ></i>
  );
}

/* ───── Button ───── */
function Btn({ variant = 'primary', size = 'md', block, children, onClick, disabled, type = 'button' }) {
  const cls = ['btn', `btn-${variant}`, block ? 'btn-block' : ''].filter(Boolean).join(' ');
  return (
    <button className={cls} onClick={onClick} disabled={disabled} type={type}
      style={size === 'lg' ? { padding: '16px 26px', fontSize: 16 } : null}>
      {children}
    </button>
  );
}

/* ───── Progress ring ─────
   Centered SVG ring, with a numeric center stack. value/of as numbers. */
function ProgressRing({ value, of, size = 160, stroke = 11, label = 'Tagesziel' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = of > 0 ? Math.min(1, value / of) : 0;
  const offset = c * (1 - pct);
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg className="ring-svg" viewBox={`0 0 ${size} ${size}`}>
        <circle className="ring-track" cx={size/2} cy={size/2} r={r} />
        <circle className="ring-fill"  cx={size/2} cy={size/2} r={r}
          strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div className="ring-center">
        <span className="num">{value}</span>
        <span className="of">von <b>{of}</b> Punkten</span>
      </div>
    </div>
  );
}

/* ───── Bottom sheet — generic ───── */
function Sheet({ open, onClose, title, sub, children, peakClose = true }) {
  const hasHead = title || sub;
  return (
    <>
      <div className={`sheet-backdrop ${open ? 'open' : ''}`} onClick={onClose}></div>
      <div className={`sheet ${open ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="grabber"></div>
        {hasHead && (
          <div className="sheet-head">
            <div className="left">
              {title && <div className="title">{title}</div>}
              {sub && <div className="sub">{sub}</div>}
            </div>
            {peakClose && (
              <button className="close" onClick={onClose} aria-label="Schließen">
                <Icon name="x" size={16} />
              </button>
            )}
          </div>
        )}
        <div className="sheet-body">{children}</div>
      </div>
    </>
  );
}

/* ───── Activity chip ───── */
function Chip({ label, pts, on, onClick }) {
  return (
    <button className={`chip ${on ? 'on' : ''}`} onClick={onClick}>
      {label}
      <span className="pts">{pts === 1 ? '1 Pkt' : `${pts} Pkte`}</span>
    </button>
  );
}

/* ───── Activity dot ───── */
function CategoryDot({ color, size = 8 }) {
  return <span style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }}></span>;
}

/* ───── Daily quick-toggle (visibility + mindset) ───── */
function DailyToggle({ activity, color, on, onClick }) {
  return (
    <button className={`daily-tog ${on ? 'on' : ''}`} onClick={onClick}>
      <CategoryDot color={color} />
      <div className="text">
        <div className="name">{activity.short}</div>
        <div className="pts">{activity.pts === 1 ? '1 Punkt' : `${activity.pts} Punkte`}</div>
      </div>
      <span className="check">{on ? <Icon name="check" size={12} stroke={2.5} /> : null}</span>
    </button>
  );
}

/* ───── Contact list row ───── */
function ContactRow({ contact, points, activityIds, onClick }) {
  // Initials from name (max 2 chars, supports "Person 1" → P1)
  const initials = (() => {
    const n = (contact.name || '').trim();
    if (/^Person\s+\d+/i.test(n)) return 'P' + n.match(/\d+/)[0].slice(0, 2);
    const parts = n.split(/\s+/);
    return (parts[0]?.[0] || '?').toUpperCase() + (parts[1]?.[0] || '').toUpperCase();
  })();

  // Colored dots representing distinct activity groups marked today
  const groupIds = Array.from(new Set(activityIds.map(id => ACTIVITY_BY_ID[id]?.groupId).filter(Boolean)));
  const groupColors = {
    sichtbarkeit: 'var(--cat-sicht)',
    kontakt:      'var(--cat-kontakt)',
    followup:     'var(--cat-follow)',
    umsatz:       'var(--cat-umsatz)',
    mindset:      'var(--cat-mindset)',
  };

  return (
    <button className="contact-row" onClick={onClick}>
      <span className="avatar">{initials}</span>
      <div className="body">
        <div className="name">{contact.name}</div>
        <div className="activities">
          {activityIds.length === 0 ? (
            <span className="none">noch keine Aktivität</span>
          ) : (
            <>
              <span className="tag-dots">
                {groupIds.map(g => <span key={g} style={{ background: groupColors[g] }}></span>)}
              </span>
              <span>· {activityIds.length} Aktivität{activityIds.length !== 1 ? 'en' : ''}</span>
            </>
          )}
        </div>
      </div>
      <span className={`pts ${points > 0 ? 'has' : ''}`}>{points}</span>
    </button>
  );
}

/* ───── Tab bar ───── */
function TabBar({ tab, onChange }) {
  const tabs = [
    { id: 'home',     label: 'Heute',         icon: 'home' },
    { id: 'calendar', label: 'Kalender',      icon: 'calendar' },
    { id: 'settings', label: 'Einstellungen', icon: 'settings' },
  ];
  return (
    <nav className="tabbar">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`tab ${tab === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <Icon name={t.icon} size={17} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ───── Switch toggle ───── */
function Switch({ on, onChange }) {
  return (
    <button
      className={`switch ${on ? 'on' : ''}`}
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
    />
  );
}

/* ───── Progress bar (alt hero) ───── */
function ProgressBar({ value, of }) {
  const pct = of > 0 ? Math.min(1, value / of) : 0;
  return (
    <div className="hero-bar">
      <div className="hero-bar-head">
        <span className="num">{value}</span>
        <span className="of">von <b>{of}</b> Punkten heute</span>
        <span className="pct">{Math.round(pct * 100)}%</span>
      </div>
      <div className="track">
        <div className="fill" style={{ transform: `scaleX(${pct})` }}></div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Icon, Btn, ProgressRing, ProgressBar, Sheet, Chip, CategoryDot, DailyToggle, ContactRow, TabBar, Switch,
});
