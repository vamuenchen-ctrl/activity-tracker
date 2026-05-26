/* AKTIVITÄTSMESSER — App container, tabs, state, tweaks */

const { useState: useStateApp2, useEffect: useEffectApp2, useRef: useRefApp2 } = React;

function App() {
  const [state, setStateRaw] = useStateApp2(() => loadState());
  const [tab, setTab] = useStateApp2('home');
  const [currentDate, setCurrentDate] = useStateApp2(() => new Date());
  const [infoOpen, setInfoOpen] = useStateApp2(false);

  // Tweaks — three expressive levers
  const [tweaks, setTweak] = useTweaks(window.TWEAK_DEFAULTS || {
    vibe: 'ruhig',
    palette: ['#677E3D', '#EFF1E5', '#56692F'],
    hero: 'ring',
  });
  const [paletteP, paletteTint, paletteDark] = Array.isArray(tweaks.palette)
    ? tweaks.palette
    : ['#677E3D', '#EFF1E5', '#56692F'];

  const firstRun = useRefApp2(true);
  useEffectApp2(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    saveState(state);
  }, [state]);

  useEffectApp2(() => {
    if (window.lucide) {
      try { window.lucide.createIcons(); } catch (e) {}
    }
  });

  function setState(next) {
    setStateRaw(typeof next === 'function' ? next : () => next);
  }

  function completeOnboarding({ name, dailyGoalDefault }) {
    setStateRaw(s => ({
      ...s,
      user: { ...s.user, name, dailyGoalDefault, onboarded: true },
      contacts: s.contacts.length === 0
        ? [
            { id: 'seed1', name: 'Anna',   createdAt: isoDay(new Date()) },
            { id: 'seed2', name: 'Lisa',   createdAt: isoDay(new Date()) },
            { id: 'seed3', name: 'Sophie', createdAt: isoDay(new Date()) },
          ]
        : s.contacts,
    }));
  }

  function handleCalendarPick(d) {
    setCurrentDate(d);
    setTab('home');
  }

  // Inline style overrides for the chosen accent palette
  const paletteStyle = {
    '--app-primary':      paletteP,
    '--app-primary-tint': paletteTint,
    '--app-primary-dark': paletteDark,
  };

  return (
    <IOSDevice width={402} height={874}>
      <div className="app" data-vibe={tweaks.vibe} style={paletteStyle}>
        {!state.user.onboarded && (
          <Onboarding onComplete={completeOnboarding} />
        )}

        {state.user.onboarded && tab === 'home' && (
          <HomeScreen
            state={state}
            setState={setState}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onOpenInfo={() => setInfoOpen(true)}
            hero={tweaks.hero}
          />
        )}

        {state.user.onboarded && tab === 'calendar' && (
          <CalendarScreen
            state={state}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onDayPicked={handleCalendarPick}
            onOpenInfo={() => setInfoOpen(true)}
          />
        )}

        {state.user.onboarded && tab === 'settings' && (
          <SettingsScreen
            state={state}
            setState={setState}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onOpenInfo={() => setInfoOpen(true)}
          />
        )}

        {state.user.onboarded && (
          <TabBar tab={tab} onChange={setTab} />
        )}

        <InfoScreen open={infoOpen} onClose={() => setInfoOpen(false)} />
      </div>

      {/* Tweaks panel — outside the .app frame so it floats independently */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Stimmung">
          <TweakRadio
            label="Vibe"
            value={tweaks.vibe}
            options={[
              { value: 'ruhig',    label: 'Ruhig' },
              { value: 'coaching', label: 'Coaching' },
              { value: 'pur',      label: 'Pur' },
            ]}
            onChange={(v) => setTweak('vibe', v)}
          />
        </TweakSection>

        <TweakSection label="Akzentfarbe">
          <TweakColor
            label="Palette"
            value={tweaks.palette}
            options={[
              ['#677E3D', '#EFF1E5', '#56692F'],  // Olive (Default)
              ['#C94963', '#FBE6EB', '#A93B52'],  // Beere
              ['#26496F', '#E6ECF3', '#1D3654'],  // Navy
              ['#1A1A1A', '#F5F5F3', '#000000'],  // Schwarz
            ]}
            onChange={(v) => setTweak('palette', v)}
          />
        </TweakSection>

        <TweakSection label="Tageshero">
          <TweakRadio
            label="Darstellung"
            value={tweaks.hero}
            options={[
              { value: 'ring', label: 'Ring' },
              { value: 'bar',  label: 'Balken' },
            ]}
            onChange={(v) => setTweak('hero', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </IOSDevice>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
