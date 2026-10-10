# chatgpt_lab 🧪

**Ett gemensamt experimentrum för människor och AI-agenter.**

Här får idéer undersökas, lekas med och byggas till små projekt — ibland med ett praktiskt mål, ibland helt utan. Repot är en **samlingspunkt för fristående miniprojekt i valfria programmeringsspråk**, inte en monolit eller en gemensam applikation. Varje projekt äger sina beroenden och sin körning.

## Översikt

```text
chatgpt_lab/
├── README.md
├── AGENTS.md
├── docs/                     # Dokumentation och onlinehjälp
├── meningsloshetsmaskinen/    # Konstexperiment
└── life-lab/                 # Enda Game of Life-appen
    ├── README.md
    ├── AGENTS.md
    ├── index.html
    ├── app.mjs
    ├── engine.mjs
    ├── simulation.js
    ├── evolution.js
    ├── renderer.js
    ├── style.css
    └── tests/
```

**Regel:** Varje ny mapp under apps/ för ett experiment har en egen `README.md` och `AGENTS.md`. `docs/` är dokumentationssubprojektet och följer samma dokumentationskrav, men listas inte som experiment i katalogen.

## Experiment

| Namn | Språk | Vad det är | Start |
| --- | --- | --- | --- |
| [Meningslöshetsmaskinen](./apps/meningsloshetsmaskinen/) | HTML/CSS/JavaScript | Färgfläckar utan prestationsmål och en stoppbar slump-loop | [Öppna live](https://doldas.github.io/chatgpt_lab/apps/meningsloshetsmaskinen/) |
| **[Life Lab — Unified](./apps/life-lab/)** | JavaScript/HTML/CSS | **Gemensam app: egna regler, mutation och hyperkub i 2D–5D** | [Öppna live](https://doldas.github.io/chatgpt_lab/apps/life-lab/) |

Den maskinläsbara, fullständiga projektlistan ligger i [docs/projects.json](./docs/projects.json). Hjälpwebben läser den filen när du besöker sidan.

**Rekommenderat Game of Life-projekt:** [Life Lab — Unified](./apps/life-lab/). De tidigare Game of Life-mapparna är borttagna; deras motorer och tester ligger nu direkt i Life Lab.

## Onlinehjälp: hostbar webbplats

Dokumentationssubprojektet [docs/](./docs/) är en statisk webbplats. Sektionen **Se vad vi bygger** visar förslag och kodändringar från det publika GitHub-repot, medan [arbetsjournalen](./docs/ACTIVITY.md) sammanfattar större AI-assisterade insatser. Du kan hosta innehållet på **GitHub Pages eller valfri HTTP-webbserver**. Ingen databas, backend, Node-build eller betald tjänst behövs.

**Testa lokalt**, från repo-roten:

```sh
python3 -m http.server 8000
```

Öppna sedan **http://localhost:8000/docs/**. Se [docs/README.md](./docs/README.md) för publicering via GitHub Pages, andra hostar och felsökning.

**GitHub Pages är aktiverat.** Med publicering från repo-roten är webbapparnas adresser [Meningslöshetsmaskinen](https://doldas.github.io/chatgpt_lab/apps/meningsloshetsmaskinen/) och [Life Lab](https://doldas.github.io/chatgpt_lab/apps/life-lab/). Dokumentationssajten nås då på [webbhjälpen under /docs/](https://doldas.github.io/chatgpt_lab/docs/).

## Skapa ett nytt experiment

1. Välj ett unikt mappnamn i `kebab-case` under apps/, t.ex. `ljud-lek/`.
2. Skapa koden i önskat språk med projektets egna beroenden.
3. Skriv `README.md` med **syfte, beskrivning, bygga, köra, teknik, begränsningar och testning**.
4. Skriv `AGENTS.md` med **agentens lokala instruktioner, vilka filer som får ändras och eventuella gränser**.
5. Registrera experimentet i `docs/projects.json` och kör `python3 docs/validate_catalog.py` för att kontrollera att båda dokumentationsfilerna och katalogposten finns.
6. Följ [projektguiden](./docs/PROJECT_GUIDE.md). Föreslå ändringar via en separat branch och PR.

AI-agenter är välkomna att utforska och bidra i **sina egna experimentmappar**. De ska visa vad de föreslår genom PR:er med genomförda tester och korta ändringsbeskrivningar, och logga större arbete i `docs/ACTIVITY.md`. Experiment kan ha agentloopar, men de ska vara synliga, stoppbara och begränsade, och får inte skada andra projekt.

## Starta en ny ChatGPT-konversation

Ge den länken till detta repo och säg:

> Läs först `README.md`, `AGENTS.md`, `docs/AI_HANDOFF.md` och `docs/projects.json` på aktuell branch. Om du arbetar i ett projekt: läs också dess `README.md` och `AGENTS.md`. Skapa ny branch och PR för kodändringar; merge inte automatiskt.

Läs även [överlämningsdokumentet](./docs/AI_HANDOFF.md). En ny chatt känner inte automatiskt till tidigare samtal, men kan återuppta arbetet från detta repo om den kan läsa filerna.

## Princip

> **Utforska fritt. Bygg isolerat. Dokumentera så andra kan förstå. Låt människan behålla kontrollen.**
