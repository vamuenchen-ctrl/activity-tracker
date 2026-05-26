/* AKTIVITÄTSMESSER — Calendar / Statistics screen */

const { useState: useStateCal, useMemo: useMemoCal } = React;

function CalendarScreen({ state, currentDate, setCurrentDate, onDayPicked, onOpenInfo }) {
  const [anchor, setAnchor] = useStateCal(() => startOfMonth(currentDate));

  function prevMonth() {
    const p = new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1);
    if (p < startOfMonth(MIN_DATE)) return;
    setAnchor(p);
  }
  function nextMonth() {
    const n = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1);
    if (n > MAX_DATE) return;
    setAnchor(n);
  }

  const today = new Date();
  const monthStart = startOfMonth(anchor);
  const monthEnd   = endOfMonth(anchor);

  // Build a 6-row × 7-col grid, Monday-first
  const cells = useMemoCal(() => {
    const start = startOfWeek(monthStart);
    const out = [];
    for (let i = 0; i < 42; i++) {
      const d = addDays(start, i);
      out.push(d);
    }
    return out;
  }, [anchor]);

  // Aggregate stats for this month
  const monthIso = isoDay(anchor);
  const monthTotal = monthPoints(state, monthIso);

  // Count days the user MET their goal this month
  const daysMet = useMemoCal(() => {
    let met = 0, attempted = 0;
    for (let d = new Date(monthStart); d <= monthEnd && d <= today; d = addDays(d, 1)) {
      const pts = dayPoints(state, isoDay(d));
      const g   = dayGoal(state, isoDay(d));
      if (d >= MIN_DATE) { attempted++; if (pts >= g) met++; }
    }
    return { met, attempted };
  }, [state, anchor]);

  // Average across past days in the month
  const avgPts = daysMet.attempted > 0 ? Math.round(monthTotal / daysMet.attempted) : 0;

  const canPrev = startOfMonth(addDays(monthStart, -1)) >= startOfMonth(MIN_DATE);
  const canNext = anchor < startOfMonth(MAX_DATE) || sameMonth(anchor, MAX_DATE);

  function sameMonth(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  }

  return (
    <>
      <header className="cal-head">
        <button onClick={prevMonth} disabled={!canPrev} aria-label="Vorheriger Monat">
          <Icon name="chevron-left" size={18} />
        </button>
        <div className="month">{formatMonth(anchor)}</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <button onClick={nextMonth} disabled={!canNext} aria-label="Nächster Monat">
            <Icon name="chevron-right" size={18} />
          </button>
          <button className="r-info-btn" onClick={onOpenInfo} aria-label="Info">
            <Icon name="info" size={16} />
          </button>
        </div>
      </header>

      <div className="scroll">
        <div className="cal-stats">
          <div className="ks">
            <div className="label">Summe</div>
            <div className="v">{monthTotal}</div>
            <div className="sub">Punkte</div>
          </div>
          <div className="ks">
            <div className="label">Ziel erreicht</div>
            <div className="v">{daysMet.met}</div>
            <div className="sub">von {daysMet.attempted} Tagen</div>
          </div>
          <div className="ks">
            <div className="label">Schnitt</div>
            <div className="v">{avgPts}</div>
            <div className="sub">Pkte / Tag</div>
          </div>
        </div>

        <div className="cal-grid-wrap">
          <div className="cal-grid-headers">
            {DE_WEEKDAYS_SHORT.map(w => <div key={w}>{w}</div>)}
          </div>
          <div className="cal-grid">
            {cells.map((d, i) => {
              const inMonth = d.getMonth() === anchor.getMonth();
              const iso     = isoDay(d);
              const isFut   = d > today;
              const isPast  = d < today && !sameDay(d, today);
              const isToday = sameDay(d, today);
              const tooEarly = d < MIN_DATE;
              const pts = (tooEarly || isFut) ? null : dayPoints(state, iso);
              const goal = dayGoal(state, iso);
              const met  = pts != null && pts >= goal && goal > 0;
              const over = pts != null && goal > 0 && pts > goal;
              const partial = pts != null && pts > 0 && !met;

              let cls = 'cal-cell';
              if (!inMonth) cls += ' empty';
              if (isFut || tooEarly) cls += ' future';
              if (isToday) cls += ' today';
              if (met) cls += ' met';
              else if (partial) cls += ' partial';
              if (over) cls += ' over';
              if (isPast && pts === 0) cls += ' past-zero';

              const interactive = inMonth && !tooEarly && !isFut;
              return (
                <button
                  key={i}
                  className={cls}
                  onClick={() => interactive && onDayPicked(d)}
                  disabled={!interactive}
                  aria-label={formatDateLong(d)}
                >
                  {inMonth && (
                    <>
                      {met && <span className="cell-rocket" aria-hidden="true">🎉</span>}
                      <span className="day">{d.getDate()}</span>
                      <span className="num">{pts == null ? '·' : pts}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="cal-legend">
          <span><span className="leg-sw" style={{ background: 'var(--app-primary)' }}></span>Tagesziel</span>
          <span><span className="leg-sw" style={{ background: 'var(--app-primary-tint)' }}></span>angefangen</span>
          <span><span className="leg-sw" style={{ background: 'var(--bg-subtle)' }}></span>kein Eintrag</span>
        </div>

        {/* Übersicht / day-detail breakdown — always today, per the spec */}
        <DayBreakdown
          state={state}
          date={new Date()}
        />

        <div style={{ height: 24 }}></div>
      </div>
    </>
  );
}

/* ───── Day breakdown (Übersicht) — Counts × points by activity for given date ───── */
function DayBreakdown({ state, date }) {
  const iso = isoDay(date);
  const day = getDay(state, iso);

  // Build counts: activityId → count
  const counts = {};
  (day.daily || []).forEach(aid => { counts[aid] = (counts[aid] || 0) + 1; });
  Object.values(day.contactActivities || {}).forEach(ids => {
    ids.forEach(aid => { counts[aid] = (counts[aid] || 0) + 1; });
  });

  const total = dayPoints(state, iso);
  const hasAny = total > 0;

  return (
    <section className="section" style={{ marginTop: 22 }}>
      <div className="section-title">
        <h3>Übersicht · Heute · {formatDateShort(date)}</h3>
        <span className="meta">{total} Punkte</span>
      </div>

      {!hasAny ? (
        <div className="empty-state" style={{ background: 'var(--bg-subtle)', borderRadius: 14, padding: 22 }}>
          <h4>Noch keine Aktivitäten erfasst.</h4>
          <div>Beginne heute.</div>
        </div>
      ) : (
        <div className="overview-list">
          {ACTIVITY_GROUPS.map(grp => {
            const rows = grp.items
              .map(a => ({ ...a, count: counts[a.id] || 0 }))
              .filter(r => r.count > 0);
            if (rows.length === 0) return null;
            return (
              <div key={grp.id} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 4px 6px' }}>
                  <CategoryDot color={grp.color} />
                  <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-2)' }}>{grp.label}</span>
                </div>
                {rows.map(r => (
                  <div key={r.id} className="ov-row">
                    <span className="dot" style={{ background: grp.color }}></span>
                    <span className="label">{r.label}</span>
                    <span className="count">{r.count}× · {r.count * r.pts} Pkt</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

Object.assign(window, { CalendarScreen, DayBreakdown });
