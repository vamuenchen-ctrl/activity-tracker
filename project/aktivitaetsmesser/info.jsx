/* AKTIVITÄTSMESSER — Info screen (overlay) */
/* Mapping: app-internal Kurz-Wording ⇄ ÜBERSICHT (volle Beschreibung). */

function InfoScreen({ open, onClose }) {
  return (
    <div className={`info-overlay ${open ? 'open' : ''}`}>
      <header className="info-head">
        <button className="info-back" onClick={onClose} aria-label="Schließen">
          <Icon name="chevron-left" size={20} />
        </button>
        <div className="info-title">Info</div>
        <span style={{ width: 36 }} aria-hidden="true"></span>
      </header>

      <div className="info-body">
        <section className="info-intro">
          <div className="onb-eyebrow" style={{ color: 'var(--app-primary)' }}>Aktivitäten &amp; Punkte</div>
          <h2>So zählt die 30-Tage-Challenge.</h2>
          <p>Hier siehst du das Kurz-Wording aus der App neben dem vollen Wortlaut aus der ÜBERSICHT — und wieviel Punkte jede Aktivität gibt.</p>
        </section>

        {ACTIVITY_GROUPS.map(grp => (
          <section className="info-group" key={grp.id}>
            <div className="info-group-head">
              <CategoryDot color={grp.color} size={10} />
              <span className="info-group-name">{grp.label}</span>
              <span className="info-group-meta">{grp.perContact ? 'pro Kontakt' : 'einmal pro Tag'}</span>
            </div>
            <div className="info-cards">
              {grp.items.map(a => (
                <article className="info-card" key={a.id}>
                  <div className="info-card-top">
                    <span className="info-short">{a.short}</span>
                    <span className="info-pts">{a.pts === 1 ? '1 Pkt' : `${a.pts} Pkte`}</span>
                  </div>
                  <div className="info-full">{a.label}</div>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="info-foot">
          <h4>Wie wird gezählt?</h4>
          <p>Jede markierte Aktivität zählt mit ihrem Punktewert. Werden mehrere Aktivitäten bei einem Kontakt gesetzt, werden die Einzelpunkte summiert. Das Tagesergebnis ist die Summe über alle Kontakte sowie deine Sichtbarkeits- und Mindset-Aktivitäten an diesem Tag.</p>
          <h4 style={{ marginTop: 18 }}>Pro Kontakt vs. pro Tag</h4>
          <p><b>Pro Kontakt</b> markierst du Aktivitäten im Kontakte-Sheet — sie zählen mehrfach, wenn du sie bei verschiedenen Kontakten setzt. <b>Pro Tag</b> sind Sichtbarkeit und Mindset: einmal pro Tag erledigt, einmal gezählt.</p>
        </section>

        <div style={{ height: 24 }}></div>
      </div>
    </div>
  );
}

Object.assign(window, { InfoScreen });
