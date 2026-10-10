# chatgpt_lab 🧪

**Ett gemensamt experimentrum för människor och AI-agenter.**

Här får idéer undersökas, lekas med och byggas till små projekt — ibland med ett praktiskt mål, ibland helt utan. Repot är en **samlingspunkt för fristående miniprojekt i valfria programmeringsspråk**, inte en monolit eller en gemensam applikation. Varje projekt äger sina beroenden och sin körning.

## Översikt

```text
chatgpt_lab/
├── README.md
├── AGENTS.md
├── docs/                        # Documentation and project catalog
└── apps/
    ├── meningsloshetsmaskinen/
    ├── life-lab/
    ├── regnorkestern/
    ├── framtidsposten/
    └── quantum-resonance-matrix/
```

**Regel:** Varje ny mapp under apps/ för ett experiment har en egen `README.md` och `AGENTS.md`. `docs/` är dokumentationssubprojektet och följer samma dokumentationskrav, men listas inte som experiment i katalogen.

## Experiment

Alla appar finns i [apps/](./apps/) och har egen README och AGENTS. Här är hela katalogen:

| App | Teknik | Vad den gör | Starta lokalt |
| --- | --- | --- | --- |
| [Meningslöshetsmaskinen](./apps/meningsloshetsmaskinen/) | HTML/CSS/JS | Lekfull Canvas-konst med stoppbar slump-loop och PNG-export | `/apps/meningsloshetsmaskinen/` |
| [Life Lab](./apps/life-lab/) | HTML/CSS/JS | Game of Life i 2–5D, egna regler, mutation och hyperkubprojektion | `/apps/life-lab/` |
| [Regnorkestern](./apps/regnorkestern/) | HTML/CSS/JS, Web Audio | Ringar och pentatoniska toner, ljud som aktivt tillval | `/apps/regnorkestern/` |
| [Framtidsposten](./apps/framtidsposten/) | Python 3.9+ | Frimärken från omöjliga platser i terminalen | `python3 apps/framtidsposten/stamps.py "hej"` |
| [Quantum Resonance Matrix](./apps/quantum-resonance-matrix/) | HTML5 Canvas, JS, Web Audio | Interferensfält med reglage, ringpulser och valfritt ljud | `/apps/quantum-resonance-matrix/` |

Webbadresserna ovan avser en **lokal server** på `http://localhost:8000`, inte verifierade GitHub Pages-demos. Starta webbservern från repo-roten med `python3 -m http.server 8000`.

[**Appöversikt, kör- och testkommandon**](./apps/README.md) · [Maskinläsbar projektkatalog](./docs/projects.json)

**Game of Life:** [Life Lab](./apps/life-lab/) är labbets enda aktiva Game of Life-app.

## Onlinehjälp: hostbar webbplats

Dokumentationssubprojektet [docs/](./docs/) är en statisk webbplats. Sektionen **Se vad vi bygger** visar förslag och kodändringar från det publika GitHub-repot, medan [arbetsjournalen](./docs/ACTIVITY.md) sammanfattar större AI-assisterade insatser. Du kan hosta innehållet på **GitHub Pages eller valfri HTTP-webbserver**. Ingen databas, backend, Node-build eller betald tjänst behövs.

**Testa lokalt**, från repo-roten:

```sh
python3 -m http.server 8000
```

Öppna sedan **http://localhost:8000/docs/**. Se [docs/README.md](./docs/README.md) för publicering via GitHub Pages, andra hostar och felsökning.

**Efter merge och driftsättning** ligger webapparna under `/apps/<projektnamn>/`. De nya publika adresserna är ännu inte verifierade, så kontrollera GitHub Pages innan de markeras som live i katalogen. Dokumentationen ligger fortsatt under `/docs/`.

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
