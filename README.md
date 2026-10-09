# chatgpt_lab 🧪

**Ett gemensamt experimentrum för människor och AI-agenter.**

Här får idéer undersökas, lekas med och byggas till små projekt — ibland med ett praktiskt mål, ibland helt utan. Repot är en **samlingspunkt för fristående miniprojekt i valfria programmeringsspråk**, inte en monolit eller en gemensam applikation. Varje projekt äger sina beroenden och sin körning.

## Översikt

```text
chatgpt_lab/
├── README.md                  # Du är här: repots mänskliga introduktion
├── AGENTS.md                  # Globalt kontrakt för AI-agenter
├── docs/                      # EGET SUBPROJEKT: hostbar onlinehjälp
│   ├── README.md              # Bygg, kör och hosta hjälpwebben
│   ├── AGENTS.md              # Agentinstruktioner för dokumentationen
│   ├── index.html             # Webbplats
│   ├── styles.css
│   ├── app.js
│   ├── activity.js             # Synliga GitHub-PR:er och commits
│   ├── ACTIVITY.md             # Arbetsjournal för större agentjobb
│   ├── projects.json          # Gemensam projektkatalog
│   ├── AI_HANDOFF.md          # Ny ChatGPT-session börjar här
│   └── PROJECT_GUIDE.md       # Så bygger du nästa miniprojekt
├── meningsloshetsmaskinen/     # Experiment 001
│   ├── README.md              # Syfte, beskrivning, bygg/kör, test
│   ├── AGENTS.md              # Projektets agentinstruktioner
│   └── index.html
├── life-beyond-2d/           # Experiment 002: 2–5D
│   ├── README.md
│   ├── AGENTS.md
│   └── index.html
└── multidimension-life/      # Separat 2–5D regel-laboratorium
    ├── README.md
    ├── AGENTS.md
    ├── engine.mjs
    ├── engine.test.mjs
    ├── app.js
    ├── style.css
    └── index.html
```

**Regel:** Varje ny toppnivåmapp för ett experiment har en egen `README.md` och `AGENTS.md`. `docs/` är dokumentationssubprojektet och följer samma dokumentationskrav, men listas inte som experiment i katalogen.

## Experiment

| Namn | Språk | Vad det är | Start |
| --- | --- | --- | --- |
| [Meningslöshetsmaskinen](./meningsloshetsmaskinen/) | HTML/CSS/JavaScript | Färgfläckar utan prestationsmål och en stoppbar slump-loop | Öppna `meningsloshetsmaskinen/index.html` |
| [Life Beyond 2D](./life-beyond-2d/) | HTML/CSS/JavaScript | 2D–5D automat, hyperkubexperiment | Öppna `life-beyond-2d/index.html` |
| [Life Beyond Dimensions](./multidimension-life/) | JavaScript/HTML/CSS | Fristående 2D–5D-automat med egna regler | `python3 -m http.server 8000`, öppna `/multidimension-life/` |

Den maskinläsbara, fullständiga projektlistan ligger i [docs/projects.json](./docs/projects.json). Hjälpwebben läser den filen när du besöker sidan.

## Onlinehjälp: hostbar webbplats

Dokumentationssubprojektet [docs/](./docs/) är en statisk webbplats. Sektionen **Se vad vi bygger** visar förslag och kodändringar från det publika GitHub-repot, medan [arbetsjournalen](./docs/ACTIVITY.md) sammanfattar större AI-assisterade insatser. Du kan hosta innehållet på **GitHub Pages eller valfri HTTP-webbserver**. Ingen databas, backend, Node-build eller betald tjänst behövs.

**Testa lokalt**, från repo-roten:

```sh
python3 -m http.server 8000
```

Öppna sedan **http://localhost:8000/docs/**. Se [docs/README.md](./docs/README.md) för publicering via GitHub Pages (`master` / `/docs`), andra hostar och felsökning.

När repoägaren har aktiverat GitHub Pages och hjälpsajten publicerats är den tänkta adressen **https://doldas.github.io/chatgpt_lab/**. Den är inte garanterat aktiv förrän Pages konfigurerats.

## Skapa ett nytt experiment

1. Välj ett unikt mappnamn i `kebab-case` på rotnivå, t.ex. `ljud-lek/`.
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
