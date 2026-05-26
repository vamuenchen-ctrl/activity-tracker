/* RINGANA web kit — page sections (header, hero, grids, footer). */

const { useState: useStateS } = React;

function Header({ cartCount = 0, onCartOpen, onNavigate, active = 'home' }) {
  const links = [
    ['home',   'Home'],
    ['fresh',  'FRESH'],
    ['caps',   'CAPS'],
    ['packs',  'PACKS'],
    ['drinks', 'DRINKS'],
    ['story',  'Über uns'],
  ];
  return (
    <header className="r-header">
      <div className="container">
        <div className="r-header-inner">
          <nav>
            {links.map(([k, label]) => (
              <a
                key={k}
                href="#"
                className={active === k ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(k); }}
              >
                {label}
              </a>
            ))}
          </nav>
          <a href="#" className="r-wordmark-link" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('home'); }}>
            RINGANA
          </a>
          <div className="r-header-actions">
            <button className="r-icon-btn" aria-label="Sprache">
              <span className="r-lang">DE</span>
            </button>
            <button className="r-icon-btn" aria-label="Suchen"><Icon name="search" size={18} /></button>
            <button className="r-icon-btn" aria-label="Konto"><Icon name="user" size={18} /></button>
            <button className="r-icon-btn" aria-label="Warenkorb" onClick={onCartOpen}>
              <Icon name="shopping-bag" size={18} />
              {cartCount > 0 && <span className="badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero({ onCTA }) {
  return (
    <section className="hero" style={{ background: 'var(--ringana-beige)' }}>
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-eyebrow">Neu · FRESH eye serum</div>
            <h1 className="hero-title">Wach werden,<br />ohne Worte.</h1>
            <p className="hero-sub">
              Ein hochkonzentriertes Augen-Serum mit Koffein aus Grüntee.
              Frisch hergestellt in Österreich, dermatologisch getestet,
              ohne synthetische Konservierungsstoffe.
            </p>
            <div className="hero-ctas">
              <Button variant="primary" size="lg" onClick={onCTA}>Jetzt entdecken</Button>
              <Button variant="outline" size="lg">Inhaltsstoffe</Button>
            </div>
          </div>
          <div className="hero-image">
            <div className="placeholder">eye serum</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Story strip — one campaign chip per palette color, mirrors the brand's
   "one accent per moment" pattern. */
function StoryStrip({ onPick }) {
  const stories = [
    { bg: '#F7D0D3', fg: '#1A1A1A', eyebrow: 'Valentine',  title: 'Friends set',     link: 'fresh' },
    { bg: '#26496F', fg: '#FFFFFF', eyebrow: 'Nachtpflege', title: 'Schlaf dich schön.', link: 'fresh' },
    { bg: '#677E3D', fg: '#FFFFFF', eyebrow: 'Manifesto',   title: 'Spot the difference.', link: 'story' },
    { bg: '#FEE8C4', fg: '#1A1A1A', eyebrow: 'Skin Perfection', title: 'Frisch ausstrahlen.',  link: 'fresh' },
  ];
  return (
    <div className="container">
      <div className="story-strip">
        {stories.map((s, i) => (
          <div
            key={i}
            className="chip"
            style={{ background: s.bg, color: s.fg }}
            onClick={() => onPick && onPick(s.link)}
          >
            <div className="eyebrow">{s.eyebrow}</div>
            <h3>{s.title}</h3>
            <div className="arrow">→</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Featured product grid */
const FEATURED = [
  { id: 'eye',   line: 'FRESH', name: 'FRESH eye serum',        desc: 'Augenpflege · 15 ml',     price: '49,90 €', bg: '#E5DAD1', label: 'eye serum',     tag: { v: 'new', text: 'Neu' } },
  { id: 'hydro', line: 'FRESH', name: 'FRESH hydro pure',       desc: 'Feuchtigkeitsserum · 30 ml', price: '49,90 €', bg: '#D2F0E8', label: 'hydro pure' },
  { id: 'lip',   line: 'FRESH', name: 'FRESH lip care',         desc: 'Lippenpflege · 5 ml',     price: '19,90 €', bg: '#ECB6B8', label: 'lip care',      tag: { v: 'sale', text: '−20 %' } },
  { id: 'night', line: 'FRESH', name: 'FRESH night recovery',   desc: 'Nachtpflege · 30 ml',    price: '69,90 €', bg: '#26496F', label: 'night',  dark: true },
  { id: 'cleanse', line: 'FRESH', name: 'FRESH cleansing water', desc: 'Reinigung · 200 ml',     price: '24,90 €', bg: '#F5F5F3', label: 'cleansing' },
  { id: 'tonic', line: 'FRESH', name: 'FRESH tonic pure',       desc: 'Gesichtstoner · 100 ml', price: '34,90 €', bg: '#F4EFEE', label: 'tonic' },
  { id: 'scrub', line: 'FRESH', name: 'FRESH scrub',            desc: 'Enzympeeling · 50 ml',   price: '39,90 €', bg: '#FEE8C4', label: 'scrub' },
  { id: 'caps',  line: 'CAPS',  name: 'CAPS immun',             desc: 'Nahrungsergänzung · 60 Stk', price: '32,90 €', bg: '#677E3D', label: 'immun', dark: true },
];

function FeaturedGrid({ onPick }) {
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="FRESH Kollektion"
          title="Frisch aus dem Labor."
          lead="Hochkonzentrierte Wirkstoffe, in kleinen Chargen hergestellt — mit echtem Ablaufdatum."
          action={<Button variant="ghost">Alle Produkte →</Button>}
        />
        <div className="product-grid">
          {FEATURED.slice(0, 8).map((p) => (
            <article key={p.id} className="pcard" onClick={() => onPick && onPick(p.id)}>
              <ProductImage bg={p.bg} dark={p.dark} label={p.label} />
              {p.tag && (
                <div style={{ position: 'absolute' }}></div>
              )}
              <div className="meta">
                <div className="line">{p.line}</div>
                <div className="name">{p.name}</div>
                <div className="desc">{p.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="price">{p.price}</span>
                  {p.tag && <Pill variant={p.tag.v}>{p.tag.text}</Pill>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Philosophy band */
function Philosophy() {
  const points = [
    { b: 'Frisch hergestellt.', s: 'Kleine Chargen mit echtem Ablaufdatum. Kein Lagerverlust an Wirkstoffen.' },
    { b: 'Ohne Konservierungsstoffe.', s: 'Keine Parabene, kein Phenoxyethanol. Antioxidantien tragen statt zu konservieren.' },
    { b: 'Ohne Mikroplastik.', s: 'Kein PEG, kein flüssiges Polymer. Was draufsteht, ist drin — sonst nichts.' },
    { b: 'Made in Austria.', s: 'St. Johann in der Haide. 100 % erneuerbare Energie. Glas, das zurückkehrt.' },
  ];
  return (
    <section className="philosophy">
      <div className="container">
        <div className="philosophy-grid">
          <div>
            <div className="hero-eyebrow">Unser Ansatz</div>
            <h2>Frische ist eine<br />Haltung.</h2>
          </div>
          <div>
            <p className="lead">
              Seit 1996 verzichten wir auf alles, was Naturkosmetik aufweicht:
              synthetische Konservierung, Mikroplastik, Mineralöle, übertriebene
              Emulgatoren. Was bleibt, ist Frische — und ein Ablaufdatum.
            </p>
            <ul>
              {points.map((p, i) => (
                <li key={i}>
                  <Icon name="check" size={20} />
                  <div><b>{p.b}</b><span>{p.s}</span></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterBand({ onSubmit }) {
  const [email, setEmail] = useStateS('');
  const [done, setDone] = useStateS(false);
  return (
    <section className="newsletter-band">
      <div className="container">
        <div className="hero-eyebrow" style={{ marginBottom: 6 }}>Newsletter</div>
        <h2>Frisch im Posteingang.</h2>
        <p>Neue Produkte, Hintergründe, gelegentliche Aktionen. Einmal pro Monat. Kein Spam.</p>
        {!done ? (
          <form
            className="newsletter-form"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
              onSubmit && onSubmit(email);
            }}
          >
            <input
              type="email"
              required
              placeholder="ihre.email@beispiel.at"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button variant="primary" type="submit">Abonnieren</Button>
          </form>
        ) : (
          <div style={{ fontSize: 15, color: 'var(--fg-1)', maxWidth: 460, margin: '0 auto' }}>
            <Icon name="check" size={18} /> Danke. Bestätigungsmail ist unterwegs.
          </div>
        )}
        <div className="small">Mit dem Abonnement stimmen Sie unserer Datenschutzerklärung zu.</div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="r-footer">
      <div className="container">
        <div className="r-footer-cols">
          <div className="brand">
            <Wordmark size={22} />
            <p style={{ marginTop: 14 }}>
              Frische Kosmetik und Nahrungsergänzung aus St. Johann in der Haide, Österreich. Seit 1996.
            </p>
            <div style={{ display: 'flex', gap: 12, color: 'var(--fg-1)' }}>
              <a href="#" aria-label="Instagram"><Icon name="instagram" size={18} /></a>
              <a href="#" aria-label="Facebook"><Icon name="facebook" size={18} /></a>
              <a href="#" aria-label="YouTube"><Icon name="youtube" size={18} /></a>
            </div>
          </div>
          <div>
            <h4>Produkte</h4>
            <ul>
              <li><a href="#">FRESH Kosmetik</a></li>
              <li><a href="#">FRESH baby</a></li>
              <li><a href="#">CAPS Supplements</a></li>
              <li><a href="#">PACKS</a></li>
              <li><a href="#">DRINKS</a></li>
            </ul>
          </div>
          <div>
            <h4>Service</h4>
            <ul>
              <li><a href="#">Versand &amp; Rückgabe</a></li>
              <li><a href="#">Glas zurückgeben</a></li>
              <li><a href="#">Kontakt</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4>Unternehmen</h4>
            <ul>
              <li><a href="#">Über uns</a></li>
              <li><a href="#">Nachhaltigkeit</a></li>
              <li><a href="#">Partner werden</a></li>
              <li><a href="#">Presse</a></li>
            </ul>
          </div>
          <div>
            <h4>Rechtliches</h4>
            <ul>
              <li><a href="#">Impressum</a></li>
              <li><a href="#">Datenschutz</a></li>
              <li><a href="#">AGB</a></li>
              <li><a href="#">Cookie-Einstellungen</a></li>
            </ul>
          </div>
        </div>
        <div className="r-footer-bottom">
          <div>© 1996–2026 RINGANA GmbH · Made in Austria</div>
          <div className="certs">
            <Pill variant="cert">vegan</Pill>
            <Pill variant="cert">COSMOS organic</Pill>
            <Pill variant="cert">CO₂-neutral</Pill>
            <Pill variant="cert">made in Austria</Pill>
          </div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Header, Hero, StoryStrip, FeaturedGrid, FEATURED, Philosophy, NewsletterBand, Footer,
});
