# AGENTS.md – dokumentation och onlinehjälp

Läs repo-rotens [AGENTS.md](../AGENTS.md) och denna mapps [README.md](./README.md) innan du ändrar onlinehjälpen.

## Syfte
`docs/` är ett **eget subprojekt för dokumentation**, inte en applikationsruntime och inte ett experiment i projektkatalogen. Här finns användarhjälp, startprompt, agentöverlämning och en hostbar statisk webbplats.

## Teknik och körning
- Ren HTML, CSS och JavaScript; ingen npm-/Python-build.
- Kör från repo-roten med `python3 -m http.server 8000` och öppna `http://localhost:8000/docs/`.
- GitHub Pages kan publicera mappen `docs/` från `master`. Publicering måste aktiveras av repoägaren.
- Ändra inte stödet för relativa resurser så att webbplatsen går sönder under en underkatalog.

## Källa till sanning
- `projects.json` listar experiment, **inte** dokumentationssubprojektet.
- Alla katalogposter måste peka på existerande toppnivåmappar som har både `README.md` och `AGENTS.md`.
- Undvik att hårdkoda projektkort; `app.js` läser katalogen dynamiskt.
- Länka bara liveappar om användaren/agenten **verifierat** en fungerande publik URL.
- Håll `AI_HANDOFF.md`, `PROJECT_GUIDE.md`, `ACTIVITY.md` och rotinstruktionerna synkroniserade.
- Visa den publika PR- och commitaktiviteten via `activity.js`; visa tydligt felmeddelande vid GitHub API-fel eller begränsningar. `activity.js` får inte kräva hemliga API-nycklar.

## Arbetsregler
- Skriv för både människor och AI-agenter. Skilj aktuell repo-status från historiska samtalsidéer.
- Inga hemligheter, dolda nätverksanrop, externa paket eller oändliga agentloopar.
- Ändra genom ny branch och PR; låt en människa godkänna merge.
- Kontrollera JSON-syntax, relativa URL:er, sökning, tillgänglighet och mobil layout när det går.
- Ange uttryckligen om webbläsar- eller Pages-testning inte har genomförts.
- Skriv transparensnoteringar i `ACTIVITY.md` för större arbete. Förklara att offentliga GitHub-händelser **inte** är en direktvy av agentens interna resonemang eller osparade arbete.

## När ett nytt projekt läggs till
Kräv en egen mapp på rotnivå, `README.md` med bygg- och körinstruktioner, samt `AGENTS.md` med agenternas regler. Lägg sedan till en rad i `projects.json`. Ändra normalt inte hjälpsajtens HTML.
