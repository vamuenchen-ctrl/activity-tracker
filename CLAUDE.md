# Aktivitätsmesser — Projektkontext

## Projektbeschreibung
PWA-App für RINGANA-Partnerinnen zum Tracken täglicher Aktivitäten (Sichtbarkeit, Kontakt, Follow-Up, Umsatz, Mindset) mit Punktesystem.

## Technologie
- Einzelne Datei: `aktivitaetsmesser/index.html` (~4200 Zeilen)
- React 18 via Babel Standalone (kein Build-Schritt)
- Alle CSS + JSX inline in der HTML-Datei
- Mehrere `<script type="text/babel">` Blöcke, jeder exportiert via `Object.assign(window, {...})`
- React-Hooks pro Script-Block aliased (z.B. `useStateHome`, `useRefHome` etc.)
- localStorage-Persistenz unter Key `aktivitaetsmesser:v1`

## GitHub
- Repo: https://github.com/vamuenchen-ctrl/activity-tracker
- Branch: `main`
- Push mit PAT (Token im Remote-URL einbetten, danach sofort entfernen):
  ```
  git remote set-url origin https://DEIN_GITHUB_PAT@github.com/vamuenchen-ctrl/activity-tracker.git
  git push -u origin main
  git remote set-url origin https://github.com/vamuenchen-ctrl/activity-tracker.git
  ```
- Commits ohne GPG-Signing: `git -c gpg.format=openpgp -c commit.gpgsign=false commit`

## Wichtige Code-Stellen in index.html
- `ACTIVITY_GROUPS` (~Zeile 2397): Aktivitätsdaten
- `DEFAULT_STATE` (~Zeile 2504): Standardwerte (dailyGoalDefault: 6)
- `HomeScreen` (~Zeile 3070): Heute-Seite, React-Aliases inkl. `useRef: useRefHome`
- `Onboarding` (~Zeile 2944): Onboarding-Flow
- `completeOnboarding` (~Zeile 4023): Navigiert nach Onboarding zur Home-Tab

## Aktivitätsgruppen (aktuelle Reihenfolge)
- **Sichtbarkeit** (perContact: false): Angebote promotet, WhatsApp Status, Social Media Story, 3x Kommentare, Reel, Beitrag
- **Kontakt & Gespräch** (perContact: true): Neukontakt, Altkontakt, Bedürfnisse, Sprachnachricht, Telefonat, Kompliment, Weiterempfehlung
- **Follow-Up & Einladung** (perContact: true): Follow-Up, Einladung, Terminiert (2Pkt), Teilnahme (2Pkt)
- **Direkter Umsatz** (perContact: true): Bestellung (2Pkt), Neupartner (3Pkt), Founderbonus (2Pkt)
- **Mindset** (perContact: false): 15 Min. Mindset, Wochenreflexion (3Pkt)

## Design
- Ringana Business-Farbpalette, Primärfarbe: `#677E3D` (olive green)
- Font: DM Sans
