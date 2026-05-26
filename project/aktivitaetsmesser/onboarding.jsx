/* AKTIVITÄTSMESSER — onboarding (3 steps: name → goal → how it works) */

const { useState: useStateOnb } = React;

function Onboarding({ onComplete }) {
  const [step, setStep] = useStateOnb(0);
  const [name, setName] = useStateOnb('');
  const [goal, setGoal] = useStateOnb(10);

  const next = () => setStep(s => Math.min(2, s + 1));
  const back = () => setStep(s => Math.max(0, s - 1));
  const finish = () => onComplete({ name: name.trim() || 'Hallo', dailyGoalDefault: goal });

  return (
    <div className="onb">
      <div className="onb-progress">
        <div className={`seg ${step >= 0 ? 'on' : ''}`}></div>
        <div className={`seg ${step >= 1 ? 'on' : ''}`}></div>
        <div className={`seg ${step >= 2 ? 'on' : ''}`}></div>
      </div>

      {step === 0 && (
        <div className="onb-step">
          <div className="onb-eyebrow">Willkommen zu deinem Activity Tracker</div>
          <h1>Aktivität ist alles. Schön, dass du da bist.</h1>
          <p>Diese App hilft dir, deine täglichen Business-Aktivitäten zu messen — fokussiert und ohne Erfolgsdruck.</p>
          <div className="field" style={{ marginTop: 20 }}>
            <input
              type="text"
              placeholder="Dein Vorname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              maxLength={28}
            />
            <div className="hint">Wir begrüßen dich damit. Bleibt nur auf deinem Gerät.</div>
          </div>
          <div style={{ flex: 1 }}></div>
          <div className="onb-actions">
            <Btn variant="primary" size="lg" block onClick={next} disabled={!name.trim()}>
              Weiter
            </Btn>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="onb-step">
          <div className="onb-eyebrow">Tagesziel</div>
          <h1>Wie viele Punkte möchtest du pro Tag sammeln?</h1>
          <p>Ein Tagesziel ist ein freundlicher Anker, kein Maßstab. Du kannst es jederzeit anpassen.</p>

          <div className="goal-display">
            <span className="big">{goal}</span>
            <span className="pkt">Punkte / Tag</span>
          </div>
          <input
            type="range" className="r-range slider"
            min="1" max="30" step="1"
            value={goal}
            onChange={(e) => setGoal(parseInt(e.target.value, 10))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--fg-3)', marginTop: -8 }}>
            <span>1</span><span>10</span><span>20</span><span>30</span>
          </div>

          <div style={{ flex: 1 }}></div>
          <div className="onb-actions">
            <button className="btn btn-ghost skip" onClick={back}>Zurück</button>
            <Btn variant="primary" size="lg" onClick={next}>Weiter</Btn>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="onb-step">
          <div className="onb-eyebrow">So funktioniert's</div>
          <h1>Hallo {name}. Drei Klicks — den Rest macht die App.</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 6 }}>
            <Step n={1}
              title="Kontakte anlegen"
              text={'Auf der Heute-Seite, „+ Kontakt hinzufügen". Namen reichen — keine Telefonnummern, keine Tags.'} />
            <Step n={2}
              title="Aktivitäten markieren"
              text="Tippe auf einen Kontakt, wähle die passenden Aktivitäten aus. Punkte werden direkt aufsummiert." />
            <Step n={3}
              title="Tag wechseln & nachschauen"
              text="Im Kalender siehst du, wieviele Punkte du an diesem Tag erreicht hast. Durch Auswahl eines Tages wechselst du in die detaillierte Tagesansicht." />
          </div>

          <div style={{ flex: 1 }}></div>
          <div className="onb-actions">
            <button className="btn btn-ghost skip" onClick={back}>Zurück</button>
            <Btn variant="primary" size="lg" onClick={finish}>Los geht's</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

function Step({ n, title, text }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{
        width: 28, height: 28, borderRadius: 999,
        background: 'var(--app-primary-tint)',
        color: 'var(--app-primary)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14,
        flexShrink: 0,
      }}>{n}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--fg-1)' }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>{text}</div>
      </div>
    </div>
  );
}

Object.assign(window, { Onboarding });
