/* AKTIVITÄTSMESSER — Home (Today) screen with contact sheet */

const { useState: useStateHome, useMemo: useMemoHome, useEffect: useEffectHome } = React;

function HomeScreen({ state, setState, currentDate, setCurrentDate, onOpenInfo, hero = 'ring' }) {
  const iso = isoDay(currentDate);
  const isToday = sameDay(currentDate, new Date());
  const isPast  = currentDate < new Date() && !isToday;
  const isFuture = currentDate > new Date() && !isToday;

  const day = getDay(state, iso);
  const dailyPts   = dayPoints(state, iso);
  const goal       = dayGoal(state, iso);
  const weekPts    = weekPoints(state, iso);
  const monthPts   = monthPoints(state, iso);

  const [openContact, setOpenContact] = useStateHome(null); // contact id
  const [showAdd, setShowAdd] = useStateHome(false);
  const [newName, setNewName] = useStateHome('');
  const [search, setSearch] = useStateHome('');

  // Collapsed-by-default sections: sichtbarkeit, mindset, kontakt, tagesziel
  const [collapsed, setCollapsed] = useStateHome({
    sichtbarkeit: true,
    mindset: true,
    kontakt: true,
    tagesziel: true,
  });
  const toggleCollapsed = (key) => setCollapsed(c => ({ ...c, [key]: !c[key] }));

  const goalOverridden = day.goal != null;
  function setTodayGoal(g) {
    setState(s => setDailyGoalForDay(s, iso, g));
  }
  function clearGoalOverride() {
    setState(s => ({ ...s, days: { ...s.days, [iso]: { ...getDay(s, iso), goal: null } } }));
  }

  function moveDay(delta) {
    const next = addDays(currentDate, delta);
    if (next < MIN_DATE) return;
    if (next > MAX_DATE) return;
    setCurrentDate(next);
  }

  function toggleDaily(aid) {
    setState(s => toggleDailyActivity(s, iso, aid));
  }
  function toggleContactAct(cid, aid) {
    setState(s => toggleContactActivity(s, iso, cid, aid));
  }
  function commitNewContact() {
    if (!newName.trim()) { setShowAdd(false); return; }
    setState(s => addContact(s, newName.trim()));
    setNewName('');
    setShowAdd(false);
  }

  return (
    <>
      <header className="topbar">
        <div className="greet-line">
          <h2 className="greeting">{isToday ? `Hallo ${state.user.name}.` : (isPast ? 'Tagesübersicht' : 'Tag in der Zukunft')}</h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span className="date">{formatDateShort(currentDate)}</span>
            <button className="r-info-btn" onClick={onOpenInfo} aria-label="Info">
              <Icon name="info" size={16} />
            </button>
          </div>
        </div>
        <div className="day-nav">
          <button onClick={() => moveDay(-1)} disabled={addDays(currentDate, -1) < MIN_DATE} aria-label="Tag zurück">
            <Icon name="chevron-left" size={18} />
          </button>
          <div className="label">{formatDateLong(currentDate)}</div>
          <button onClick={() => moveDay(1)} disabled={addDays(currentDate, 1) > MAX_DATE} aria-label="Tag vor">
            <Icon name="chevron-right" size={18} />
          </button>
        </div>
        {!isToday && (
          <div className="notice-banner" style={{ margin: '12px 0 0' }}>
            <Icon name="calendar-clock" size={14} />
            <span className="lbl">{isFuture ? 'Zukünftiger Tag — Eingaben sind nicht aktiv.' : 'Du betrachtest einen vergangenen Tag.'}</span>
            <button onClick={() => setCurrentDate(new Date())}>Zu heute</button>
          </div>
        )}
      </header>

      <div className="scroll">
        {/* Hero — Ring or Bar depending on tweak */}
        {hero === 'bar' ? (
          <section style={{ paddingTop: 12 }}>
            {isToday && <div className="ring-eyebrow" style={{ padding: '0 20px 4px' }}>Heute</div>}
            <ProgressBar value={dailyPts} of={goal} />
          </section>
        ) : (
          <section className="hero-ring">
            {isToday && <div className="ring-eyebrow">Heute</div>}
            <ProgressRing value={dailyPts} of={goal} />
          </section>
        )}

        {/* Tagesziel-Banner — bei Erreichen + Übererfüllung */}
        {goal > 0 && dailyPts >= goal && (
          <div className="overshoot-banner">
            <span className="rocket" aria-hidden="true">🎉</span>
            <span className="text">
              {dailyPts > goal
                ? <><b>+{dailyPts - goal}</b> über dem Tagesziel</>
                : <>Tagesziel erreicht</>}
            </span>
          </div>
        )}

        {/* Stats strip */}
        <div className="stats-strip">
          <div className="stat-cell">
            <div className="label">Diese Woche</div>
            <div className="value">{weekPts}</div>
            <div className="sub">Punkte gesammelt</div>
          </div>
          <div className="stat-cell">
            <div className="label">Dieser Monat</div>
            <div className="value">{monthPts}</div>
            <div className="sub">Punkte gesammelt</div>
          </div>
        </div>

        {/* Sichtbarkeit + Mindset — daily toggles (collapsible) */}
        {DAILY_GROUPS.map(grp => {
          const groupItemIds = new Set(grp.items.map(i => i.id));
          const ptsInGroup = (day.daily || [])
            .filter(id => groupItemIds.has(id))
            .reduce((s, id) => s + (ACTIVITY_BY_ID[id]?.pts || 0), 0);
          const isCollapsed = collapsed[grp.id];
          return (
            <section className="section" key={grp.id}>
              <button
                className="section-title section-title-toggle"
                onClick={() => toggleCollapsed(grp.id)}
                aria-expanded={!isCollapsed}
              >
                <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <CategoryDot color={grp.color} /> {grp.label}
                </h3>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <span className="meta">{ptsInGroup === 1 ? '1 Punkt' : `${ptsInGroup} Punkte`}</span>
                  <Icon name="chevron-down" size={16} style={{ color: 'var(--fg-3)', transform: isCollapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 220ms cubic-bezier(0.22,1,0.36,1)' }} />
                </span>
              </button>
              {!isCollapsed && (
                <div className="daily-grid" style={{ marginTop: 12 }}>
                  {grp.items.map(a => (
                    <DailyToggle
                      key={a.id}
                      activity={a}
                      color={grp.color}
                      on={(day.daily || []).includes(a.id)}
                      onClick={() => !isFuture && toggleDaily(a.id)}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}

        {/* Contacts section (collapsible) */}
        <section className="section">
          {(() => {
            const contactPts = Object.values(day.contactActivities || {})
              .flat()
              .reduce((s, id) => s + (ACTIVITY_BY_ID[id]?.pts || 0), 0);
            return (
              <button
                className="section-title section-title-toggle"
                onClick={() => toggleCollapsed('kontakt')}
                aria-expanded={!collapsed.kontakt}
              >
                <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <CategoryDot color="var(--cat-kontakt)" /> Kontakte
                </h3>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <span className="meta">{contactPts === 1 ? '1 Punkt' : `${contactPts} Punkte`}</span>
                  <Icon name="chevron-down" size={16} style={{ color: 'var(--fg-3)', transform: collapsed.kontakt ? 'rotate(-90deg)' : 'none', transition: 'transform 220ms cubic-bezier(0.22,1,0.36,1)' }} />
                </span>
              </button>
            );
          })()}

          {!collapsed.kontakt && (
            <div style={{ marginTop: 12 }}>
              {state.contacts.length > 0 && (
                <div className="contact-search">
                  <Icon name="search" size={14} style={{ color: 'var(--fg-3)' }} />
                  <input
                    type="text"
                    placeholder="Kontakt suchen"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <button
                      className="contact-search-clear"
                      onClick={() => setSearch('')}
                      aria-label="Suche zurücksetzen"
                    >
                      <Icon name="x" size={12} />
                    </button>
                  )}
                </div>
              )}

              {state.contacts.length === 0 && !showAdd && (
                <div className="empty-state">
                  <h4>Noch keine Kontakte.</h4>
                  <div>Lege deinen ersten Kontakt an — Name reicht.</div>
                </div>
              )}

              {(() => {
                const q = search.trim().toLowerCase();
                const filtered = q
                  ? state.contacts.filter(c => c.name.toLowerCase().includes(q))
                  : state.contacts;
                if (q && filtered.length === 0) {
                  return (
                    <div className="empty-state">
                      <div>Kein Kontakt gefunden für „{search}".</div>
                    </div>
                  );
                }
                return filtered.map(c => (
                  <ContactRow
                    key={c.id}
                    contact={c}
                    points={contactPointsOnDay(state, iso, c.id)}
                    activityIds={(day.contactActivities && day.contactActivities[c.id]) || []}
                    onClick={() => !isFuture && setOpenContact(c.id)}
                  />
                ));
              })()}

              {showAdd ? (
                <div className="new-contact-form">
                  <input
                    type="text" placeholder="Vorname oder Spitzname"
                    value={newName} onChange={(e) => setNewName(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => { if (e.key === 'Enter') commitNewContact(); if (e.key === 'Escape') { setShowAdd(false); setNewName(''); } }}
                    maxLength={32}
                  />
                  <button className="cancel" onClick={() => { setShowAdd(false); setNewName(''); }}>Abbrechen</button>
                  <button onClick={commitNewContact}>Hinzufügen</button>
                </div>
              ) : (
                <button className="add-contact-btn" onClick={() => setShowAdd(true)} disabled={isFuture}>
                  <Icon name="plus" size={16} />
                  Kontakt hinzufügen
                </button>
              )}
            </div>
          )}
        </section>

        {/* ───── Divider ───── */}
        <div className="goal-divider"></div>

        {/* Tagesziel — per-day override (collapsible, default collapsed) */}
        <section className="section goal-section">
          <button
            className="section-title section-title-toggle"
            onClick={() => toggleCollapsed('tagesziel')}
            aria-expanded={!collapsed.tagesziel}
          >
            <h3 style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Icon name="target" size={14} style={{ color: 'var(--fg-2)' }} />
              Tagesziel
            </h3>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span className="meta">
                {goal} {goal === 1 ? 'Punkt' : 'Punkte'}
                {goalOverridden && <span style={{ color: 'var(--app-primary)', marginLeft: 6 }}>· angepasst</span>}
              </span>
              <Icon name="chevron-down" size={16} style={{ color: 'var(--fg-3)', transform: collapsed.tagesziel ? 'rotate(-90deg)' : 'none', transition: 'transform 220ms cubic-bezier(0.22,1,0.36,1)' }} />
            </span>
          </button>

          {!collapsed.tagesziel && (
            <div className="goal-slider-row" style={{ marginTop: 12 }}>
              <div className="display">
                <span className="big">{goal}</span>
                <span className="lbl">{isToday ? 'Punkte heute' : `Punkte am ${formatDateShort(currentDate)}`}</span>
              </div>
              <input
                type="range" className="r-range"
                min="1" max="30" step="1"
                value={goal}
                onChange={(e) => setTodayGoal(parseInt(e.target.value, 10))}
                disabled={isFuture}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 12 }}>
                <span style={{ fontSize: 11.5, color: 'var(--fg-3)', lineHeight: 1.4 }}>
                  {goalOverridden
                    ? `Für diesen Tag angepasst. Standard wäre ${state.user.dailyGoalDefault} Pkte.`
                    : `Aktueller Standard für alle Tage. In Einstellungen änderbar.`}
                </span>
                {goalOverridden && (
                  <button
                    onClick={clearGoalOverride}
                    style={{ color: 'var(--app-primary)', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    Zurücksetzen
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        <div style={{ height: 24 }}></div>
      </div>

      {/* Contact activity sheet */}
      <ContactSheet
        contact={state.contacts.find(c => c.id === openContact)}
        open={!!openContact}
        onClose={() => setOpenContact(null)}
        selected={(day.contactActivities && day.contactActivities[openContact]) || []}
        onToggle={(aid) => toggleContactAct(openContact, aid)}
        onRename={(name) => setState(s => renameContact(s, openContact, name))}
        readonly={isFuture}
      />
    </>
  );
}

/* ───── Contact sheet — marks activities for one contact on the selected day ───── */
function ContactSheet({ contact, open, onClose, selected, onToggle, onRename, readonly }) {
  const [editName, setEditName] = useStateHome(false);
  const [tmpName, setTmpName] = useStateHome('');

  useEffectHome(() => {
    if (open && contact) { setTmpName(contact.name); setEditName(false); }
  }, [open, contact?.id]);

  if (!contact) return <Sheet open={false} onClose={onClose} />;

  const totalPts = selected.reduce((s, aid) => s + (ACTIVITY_BY_ID[aid]?.pts || 0), 0);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={null}
      sub={null}
    >
      {/* custom head inside sheet body */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 999,
          background: 'var(--app-primary-tint)',
          color: 'var(--app-primary)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 500,
          flexShrink: 0,
        }}>
          {(() => {
            const n = contact.name.trim();
            if (/^Person\s+\d+/i.test(n)) return 'P' + n.match(/\d+/)[0].slice(0, 2);
            const parts = n.split(/\s+/);
            return (parts[0]?.[0] || '?').toUpperCase() + (parts[1]?.[0] || '').toUpperCase();
          })()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {editName ? (
            <input
              type="text" value={tmpName} autoFocus
              onChange={(e) => setTmpName(e.target.value)}
              onBlur={() => { if (tmpName.trim()) onRename(tmpName); setEditName(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') { if (tmpName.trim()) onRename(tmpName); setEditName(false); } }}
              style={{
                width: '100%',
                fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 20,
                letterSpacing: '-0.01em', color: 'var(--fg-1)',
                background: 'var(--bg-subtle)', borderRadius: 8,
                padding: '6px 10px',
              }}
              maxLength={32}
            />
          ) : (
            <button onClick={() => setEditName(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}>
              <div className="title" style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 20, letterSpacing: '-0.01em', color: 'var(--fg-1)' }}>{contact.name}</div>
              <Icon name="pencil" size={14} style={{ color: 'var(--fg-3)' }} />
            </button>
          )}
          <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>
            {selected.length === 0 ? 'Noch keine Aktivität für heute' : `${selected.length} Aktivität${selected.length !== 1 ? 'en' : ''} · ${totalPts} Punkt${totalPts !== 1 ? 'e' : ''}`}
          </div>
        </div>
        <button onClick={onClose} className="close" style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-subtle)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-2)' }}>
          <Icon name="x" size={16} />
        </button>
      </div>

      {readonly && (
        <div className="notice-banner" style={{ margin: '0 0 14px' }}>
          <Icon name="lock" size={14} />
          <span className="lbl">Zukünftiger Tag — du kannst hier nichts markieren.</span>
        </div>
      )}

      {PER_CONTACT_GROUPS.map(grp => (
        <div className="chip-group" key={grp.id}>
          <div className="grp-head">
            <CategoryDot color={grp.color} />
            <span className="name" style={{ whiteSpace: 'nowrap' }}>{grp.label}</span>
          </div>
          <div className="chips">
            {grp.items.map(a => (
              <Chip
                key={a.id}
                label={a.short}
                pts={a.pts}
                on={selected.includes(a.id)}
                onClick={() => !readonly && onToggle(a.id)}
              />
            ))}
          </div>
        </div>
      ))}

      <div style={{ height: 8 }}></div>
    </Sheet>
  );
}

Object.assign(window, { HomeScreen, ContactSheet });
