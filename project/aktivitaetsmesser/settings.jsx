/* AKTIVITÄTSMESSER — Settings screen */

const { useState: useStateSet } = React;

function SettingsScreen({ state, setState, currentDate, setCurrentDate, onOpenInfo }) {
  const [editName, setEditName] = useStateSet(false);
  const [tmpName, setTmpName] = useStateSet(state.user.name);
  const [confirmAnon, setConfirmAnon] = useStateSet(false);
  const [confirmAnonFinal, setConfirmAnonFinal] = useStateSet(false);
  const [confirmReset, setConfirmReset] = useStateSet(false);
  const [justAnon, setJustAnon] = useStateSet(false);

  const iso = isoDay(currentDate);
  const todayGoal = dayGoal(state, iso);
  const isToday = sameDay(currentDate, new Date());

  function setDefaultGoal(g) {
    setState(s => ({ ...s, user: { ...s.user, dailyGoalDefault: g } }));
  }
  function overrideToday(g) {
    setState(s => setDailyGoalForDay(s, iso, g));
  }
  function clearTodayOverride() {
    setState(s => ({ ...s, days: { ...s.days, [iso]: { ...getDay(s, iso), goal: null } } }));
  }
  function applyAnon() {
    setState(s => anonymizeContacts(s));
    setConfirmAnon(false);
    setConfirmAnonFinal(false);
    setJustAnon(true);
    setTimeout(() => setJustAnon(false), 2800);
  }
  function cancelAnon() {
    setConfirmAnon(false);
    setConfirmAnonFinal(false);
  }
  function applyReset() {
    setState(JSON.parse(JSON.stringify(DEFAULT_STATE)));
    setConfirmReset(false);
  }

  return (
    <>
      <header className="cal-head" style={{ justifyContent: 'space-between' }}>
        <div className="month">Einstellungen</div>
        <button className="r-info-btn" onClick={onOpenInfo} aria-label="Info">
          <Icon name="info" size={16} />
        </button>
      </header>

      <div className="scroll">
        <div className="settings-list">

          {/* Profile */}
          <div className="settings-group">
            <div className="sg-title">Profil</div>
            <div className="settings-card">
              <div className="settings-row">
                <span className="icon"><Icon name="user" size={18} /></span>
                <div className="body">
                  <div className="label">Vorname</div>
                  <div className="sub">Wir begrüßen dich damit.</div>
                </div>
                {editName ? (
                  <input
                    type="text" value={tmpName} autoFocus
                    onChange={(e) => setTmpName(e.target.value)}
                    onBlur={() => {
                      if (tmpName.trim()) setState(s => ({ ...s, user: { ...s.user, name: tmpName.trim() } }));
                      setEditName(false);
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                    maxLength={28}
                  />
                ) : (
                  <button className="value" onClick={() => { setTmpName(state.user.name); setEditName(true); }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--app-primary)' }}>
                    {state.user.name || 'Tippen'}
                    <Icon name="pencil" size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Daily goal */}
          <div className="settings-group">
            <div className="sg-title">Tagesziel · Standard</div>
            <div className="goal-slider-row">
              <div className="display">
                <span className="big">{state.user.dailyGoalDefault}</span>
                <span className="lbl">Punkte / Tag</span>
              </div>
              <input
                type="range" className="r-range"
                min="1" max="30" step="1"
                value={state.user.dailyGoalDefault}
                onChange={(e) => setDefaultGoal(parseInt(e.target.value, 10))}
              />
              <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 8 }}>
                Gilt für alle Tage. Einzelne Tage kannst du in der Tagesansicht überschreiben.
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="settings-group">
            <div className="sg-title">Privatsphäre</div>
            <div className="settings-card">
              <div className="settings-row" style={{ alignItems: 'flex-start' }}>
                <span className="icon" style={{ marginTop: 2 }}><Icon name="eye-off" size={18} /></span>
                <div className="body">
                  <div className="label">Kontakte anonymisieren</div>
                  <div className="sub" style={{ marginBottom: 10 }}>
                    Einmalige Aktion: bestehende Namen werden zu „Person 1", „Person 2"… ersetzt. Lässt sich nicht rückgängig machen.
                  </div>
                  {justAnon ? (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontSize: 12, color: 'var(--app-primary)', fontWeight: 500,
                      background: 'var(--app-primary-tint)',
                      padding: '4px 10px', borderRadius: 999,
                    }}>
                      <Icon name="check" size={12} stroke={2.5} />
                      Anonymisiert
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmAnon(true)}
                      style={{
                        background: 'var(--bg-subtle)',
                        color: 'var(--fg-1)',
                        border: '1px solid var(--border-strong)',
                        borderRadius: 10,
                        padding: '8px 14px',
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      Jetzt anonymisieren
                    </button>
                  )}
                </div>
              </div>
              <div className="settings-row">
                <span className="icon"><Icon name="database" size={18} /></span>
                <div className="body">
                  <div className="label">Daten bleiben lokal</div>
                  <div className="sub">Nichts wird hochgeladen. Speicherung im Browser deines Geräts.</div>
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="settings-group">
            <div className="sg-title">Über</div>
            <div className="settings-card">
              <div className="settings-row">
                <span className="icon"><Icon name="info" size={18} /></span>
                <div className="body">
                  <div className="label">Aktivitätsmesser</div>
                  <div className="sub">30-Tage-Challenge · v1.0 · Juni 2026</div>
                </div>
              </div>
              <div className="settings-row">
                <span className="icon"><Icon name="rotate-ccw" size={18} /></span>
                <div className="body">
                  <button onClick={() => setConfirmReset(true)} style={{ color: 'var(--cat-umsatz)', fontSize: 14, textAlign: 'left' }}>
                    Alle Daten zurücksetzen
                  </button>
                  <div className="sub">Lokale Daten löschen und neu starten.</div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <div style={{ height: 24 }}></div>
      </div>

      {/* Anonymize confirm — step 1 */}
      <Sheet
        open={confirmAnon}
        onClose={cancelAnon}
        title="Kontakte anonymisieren?"
        sub="Diese Aktion ersetzt einmalig alle Namen."
      >
        <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6, margin: '0 0 16px' }}>
          Alle bestehenden Kontakte heißen danach <b>Person 1</b>, <b>Person 2</b>, … Bereits eingetragene Aktivitäten und Punkte bleiben erhalten. Neue Kontakte kannst du danach wieder mit echtem Namen anlegen.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={cancelAnon}>Abbrechen</button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={() => { setConfirmAnon(false); setConfirmAnonFinal(true); }}
          >
            Weiter
          </button>
        </div>
      </Sheet>

      {/* Anonymize confirm — step 2 (final warning) */}
      <Sheet
        open={confirmAnonFinal}
        onClose={cancelAnon}
        title="Wirklich sicher?"
        sub="Letzte Bestätigung — danach kein Zurück."
      >
        <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6, margin: '0 0 16px' }}>
          Bist du wirklich sicher, dass du deine Daten anonymisieren willst? <b>Dieser Schritt kann nicht rückgängig gemacht werden.</b>
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={cancelAnon}>Abbrechen</button>
          <button
            className="btn btn-primary"
            style={{ flex: 1, background: 'var(--cat-umsatz)' }}
            onClick={applyAnon}
          >
            Anonymisieren
          </button>
        </div>
      </Sheet>

      {/* Reset confirm sheet */}
      <Sheet
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Alle Daten zurücksetzen?"
        sub="Diese Aktion lässt sich nicht rückgängig machen."
      >
        <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6, margin: '0 0 16px' }}>
          Profil, Kontakte und alle erfassten Aktivitäten werden gelöscht. Die App startet wieder mit dem Willkommens-Bildschirm.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setConfirmReset(false)}>Abbrechen</button>
          <button className="btn btn-primary" style={{ flex: 1, background: 'var(--cat-umsatz)' }} onClick={applyReset}>Zurücksetzen</button>
        </div>
      </Sheet>
    </>
  );
}

Object.assign(window, { SettingsScreen });
