/* RINGANA web kit — screens that compose sections. */

const { useState: useStateScr } = React;

function HomeScreen({ onNavigate, onPickProduct }) {
  return (
    <main>
      <Hero onCTA={() => onPickProduct('eye')} />
      <StoryStrip onPick={onNavigate} />
      <FeaturedGrid onPick={onPickProduct} />
      <Philosophy />
      <NewsletterBand />
    </main>
  );
}

/* ------- Product Detail ------- */
function ProductDetail({ productId, onAdd, onBack }) {
  const product = FEATURED.find((p) => p.id === productId) || FEATURED[0];
  const [qty, setQty] = useStateScr(1);
  const [thumb, setThumb] = useStateScr(0);

  // Build a few alt-color thumbnail palettes to suggest gallery shots.
  const altBgs = [product.bg, '#F4EFEE', '#F5F5F3', '#FEE8C4'];

  return (
    <main className="container pdp">
      <div style={{ marginBottom: 18, fontSize: 12, color: 'var(--fg-3)', letterSpacing: '0.04em' }}>
        <a href="#" onClick={(e) => { e.preventDefault(); onBack && onBack(); }}>← Zurück</a>
        <span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>
        FRESH Kosmetik / Augenpflege
      </div>
      <div className="pdp-grid">
        <div className="pdp-gallery">
          <div className="main" style={{ background: altBgs[thumb] }}>
            <div className="placeholder" style={product.dark ? { color: 'rgba(255,255,255,0.28)' } : null}>{product.label}</div>
          </div>
          <div className="thumbs">
            {altBgs.map((bg, i) => (
              <div
                key={i}
                style={{ background: bg }}
                className={i === thumb ? 'active' : ''}
                onClick={() => setThumb(i)}
              ></div>
            ))}
          </div>
        </div>
        <div className="pdp-info">
          <div className="line">{product.line}</div>
          <h1>{product.name.replace(product.line + ' ', '')}</h1>
          <div className="vol">{product.desc}</div>
          <p className="desc">
            Hochkonzentrierte Wirkstoffe für die empfindliche Haut rund um die Augen.
            Koffein aus Grüntee strafft sichtbar, Acacia-Peptide stützen die Haut­barriere.
            Frisch hergestellt — wirkt schnell und verlässlich.
          </p>
          <div className="price-row">
            <span className="price">{product.price}</span>
            <span className="ship">Versand klimaneutral · Lieferung in 1–3 Tagen</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="weniger">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="mehr">+</button>
            </div>
            <Button variant="primary" size="lg" onClick={() => onAdd(product, qty)}>
              In den Warenkorb
            </Button>
          </div>
          <div className="certs-row">
            <Pill variant="cert">vegan</Pill>
            <Pill variant="cert">COSMOS organic</Pill>
            <Pill variant="cert">dermatologisch getestet</Pill>
          </div>
          <div className="accordion">
            <details open>
              <summary>Zutaten</summary>
              <div>
                Aqua, Caffeine, Acacia Senegal Gum, Camellia Sinensis Leaf Extract,
                Glycerin, Tocopherol, Pentylene Glycol, Citric Acid. Aus kontrolliert
                biologischem Anbau, soweit verfügbar.
              </div>
            </details>
            <details>
              <summary>Anwendung</summary>
              <div>
                Morgens und abends eine erbsengroße Menge auf die gereinigte Haut
                unter den Augen auftragen. Sanft einklopfen. Anschließend
                FRESH hydro pure verwenden.
              </div>
            </details>
            <details>
              <summary>Nachhaltigkeit</summary>
              <div>
                Glasflakon, voll recyclebar. Sammeln Sie 10 leere Flakons, schicken
                Sie diese zurück — Sie erhalten ein RINGANA-Produkt Ihrer Wahl gratis.
              </div>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ------- Cart Drawer ------- */
function CartDrawer({ open, items, onClose, onRemove, onCheckout }) {
  const subtotal = items.reduce((s, it) => s + it.priceN * it.qty, 0);
  return (
    <>
      <div className={`cart-backdrop ${open ? 'open' : ''}`} onClick={onClose}></div>
      <aside className={`cart-drawer ${open ? 'open' : ''}`}>
        <header>
          <h3>Warenkorb</h3>
          <button className="r-icon-btn" onClick={onClose} aria-label="Schließen"><Icon name="x" size={18} /></button>
        </header>
        <div className="body">
          {items.length === 0 ? (
            <div className="empty">
              <div style={{ marginBottom: 8 }}><Icon name="shopping-bag" size={28} /></div>
              Ihr Warenkorb ist leer.
            </div>
          ) : (
            items.map((it, i) => (
              <div key={i} className="cart-item">
                <div className="ci-img" style={{ background: it.bg }}>
                  <div className="ph" style={it.dark ? { color: 'rgba(255,255,255,0.5)' } : null}>{it.label.slice(0, 3)}</div>
                </div>
                <div className="ci-meta">
                  <div className="line">{it.line}</div>
                  <div className="name">{it.name}</div>
                  <div className="row">
                    <span>Menge {it.qty}</span>
                    <span className="remove" onClick={() => onRemove(i)}>entfernen</span>
                  </div>
                </div>
                <div className="ci-price">{(it.priceN * it.qty).toFixed(2).replace('.', ',')} €</div>
              </div>
            ))
          )}
        </div>
        <footer>
          <div className="sum muted"><span>Zwischensumme</span><span>{subtotal.toFixed(2).replace('.', ',')} €</span></div>
          <div className="sum muted"><span>Versand</span><span>klimaneutral · gratis ab 49 €</span></div>
          <div className="sum total"><span>Gesamt</span><span>{subtotal.toFixed(2).replace('.', ',')} €</span></div>
          <Button variant="primary" size="lg" onClick={onCheckout}>Zur Kasse</Button>
        </footer>
      </aside>
    </>
  );
}

/* ------- Email newsletter mock screen -------
   Shown when user navigates to "story" — represents the newsletter side of
   the brand surface (same color/type system, slightly different layout). */
function EmailScreen() {
  return (
    <main className="email-screen">
      <div className="container-narrow" style={{ textAlign: 'center', marginBottom: 24 }}>
        <div className="hero-eyebrow" style={{ marginBottom: 4 }}>Newsletter · Februar 2026</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
          So sieht eine RINGANA-Mail aus.
        </h2>
        <p style={{ color: 'var(--fg-2)', maxWidth: 48 + 'ch', margin: '0 auto' }}>
          Beispiel-Layout. Newsletter nutzen dieselbe Type & Palette wie die Website,
          mit kräftigeren Akzentflächen pro Story.
        </p>
      </div>
      <div className="email-canvas">
        {/* Email header */}
        <div style={{ padding: '20px 0 16px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
          <Wordmark size={18} />
        </div>
        {/* Hero block */}
        <div style={{ background: '#F7D0D3', padding: '36px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#8a4a50', marginBottom: 10 }}>Valentine</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 34, letterSpacing: '-0.02em', margin: '0 0 14px' }}>Friends set.</h3>
          <p style={{ color: '#5a2528', maxWidth: 36 + 'ch', margin: '0 auto 20px', fontSize: 14, lineHeight: 1.55 }}>
            Drei Lieblings­produkte, die Sie weiter­schenken oder behalten dürfen.
          </p>
          <Button variant="primary">Zum Set</Button>
        </div>
        {/* Product row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          <div style={{ background: '#ECB6B8', padding: 28, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: 'rgba(26,26,26,0.22)', height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '-0.02em' }}>lip</div>
            <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5a2528', marginTop: 8 }}>FRESH</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>FRESH lip care</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, marginTop: 4 }}>19,90 €</div>
          </div>
          <div style={{ background: '#D2F0E8', padding: 28, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: 'rgba(26,26,26,0.22)', height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '-0.02em' }}>hydro</div>
            <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2F6A55', marginTop: 8 }}>FRESH</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>FRESH hydro pure</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, marginTop: 4 }}>49,90 €</div>
          </div>
        </div>
        {/* Info block — soft mint */}
        <div style={{ background: '#D2F0E8', padding: '28px 28px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2F6A55', marginBottom: 8 }}>Wussten Sie</div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '-0.01em', lineHeight: 1.25, margin: 0, maxWidth: 30 + 'ch', marginInline: 'auto' }}>
            10 leere Glasflakons = 1 RINGANA-Produkt Ihrer Wahl.
          </p>
        </div>
        {/* Footer */}
        <div style={{ padding: '24px 28px', background: '#EEEEEE', textAlign: 'center', color: '#7A7A7A', fontSize: 11, lineHeight: 1.6 }}>
          RINGANA GmbH · Badstraße 13, 8295 St. Johann i. d. Haide, Österreich<br />
          <a href="#" style={{ color: '#4A4A4A', textDecoration: 'underline', textUnderlineOffset: 2 }}>Abmelden</a> · <a href="#" style={{ color: '#4A4A4A', textDecoration: 'underline', textUnderlineOffset: 2 }}>Im Browser ansehen</a>
        </div>
      </div>
    </main>
  );
}

Object.assign(window, { HomeScreen, ProductDetail, CartDrawer, EmailScreen });
