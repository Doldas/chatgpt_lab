# Life Lab 🌌🧬 – ett gemensamt Game of Life-labb

## Syfte och beskrivning

**Life Lab** sammanför två tidigare experiment i `chatgpt_lab` till **en enda webbaserad applikation och ett GUI**. Målet är att utforska emergens i 2D–5D, egenkonstruerade cellulära automatregler och ärftliga muterande cellregler. De äldre experimenten är borttagna, men all nödvändig kod och alla tester finns nu i den här mappen. Git-historiken bevarar de gamla versionerna.

## Arkitektur och ursprung

- `app.mjs`: gemensamt GUI och adapter mellan två beräkningsmotorer.
- **Egna B/S-regler:** importerar den glesa, begränsade motorn från `engine.mjs` (ursprungligen PR #4).
- **Conway/Echo/Bloom/Crystal:** använder den dimensionella motorn från `simulation.js` (ursprungligen PR #5).
- **Evolving:** `evolution.js` integrerar de ärftliga, muterande familjereglerna från PR #7.
- **Hypercube Renderer:** `renderer.js` integrerar 2D–5D-hyperkubprojektionen från PR #6.
- `index.html`, `style.css`: hostbar, fristående statisk webbapp.
- Koden är kompatibel med webbläsare som stöder ES-moduler, Canvas och moderna JavaScript-funktioner.

All kod som appen behöver ligger nu i `apps/life-lab/`.

## Bygg och kör

**Bygg:** ingen kompilering, npm-installation, Python-kod eller serverbackend behövs. Eftersom appen importerar ES-moduler måste en vanlig HTTP-server användas.

Från repo-roten:

```sh
python3 -m http.server 8000
```

Öppna **http://localhost:8000/apps/life-lab/**. På GitHub Pages är appens adress **https://doldas.github.io/chatgpt_lab/apps/life-lab/** (under förutsättning att publicering sker från repo-roten).

För publicering räcker det att hosta **enbart `apps/life-lab/`** på en statisk HTTP(S)-server.

## GUI och funktioner

- **Dimensioner 2–5:** verklig dimensionell simulering, inte bara visuella etiketter. Byte startar ett nytt universum.
- **Regelvärld:** Egna B/S-regler eller Conway i 2D, Echo/Bloom/Crystal i 2–5D och Evolving i 2–5D.
- **Egna B/S:** skriv grannantal eller intervall, t.ex. `3,5-7`; klicka Tillämpa B/S. Den glesa motorn har explicita säkerhetsgränser.
- **Evolving:** föräldrakandidat väljs slumpmässigt bland levande grannar. Vid födseln kan regel-familj, födelsetröskel eller överlevnadströskel mutera. Mutation 0–30 %.
- **Utifrån:** full projektion av hyperkubens wireframe och alla levande celler i 2–5D.
- **Inifrån:** projicerat 3D-XYZ-snitt; vid 4D/5D väljs W och V via axelreglagen.
- **2D-snitt:** valbar X/Y-vy för att rita levande och döda celler med mus/finger. Övriga axlar väljs med Z/W/V-sliders.
- **Rotation / lutning / wireframe**, slumpstart, rensa, ett steg och paus.

Alla simuleringar kör lokalt. **Auto-körning stannar efter högst 80 steg per start**, och när sidan döljs pausas den. Ingen dold AI-agent, ingen nätverkstrafik från appens egen kod och inga API-nycklar.

## Begränsningar

4D och 5D visualiseras genom **matematiska projektioner**, inte genom att visa alla dimensioner direkt. Samma skärmpunkt kan motsvara flera olika celler. Cellernas regler i Evolving är en experimentell ärftlig cellulär automat, inte biologisk evolution eller en självlärande AI.

De två motorerna har olika rutnätsstorlekar och regler, så **byte av regelvärld startar om universum**; detta är avsiktligt och inga celler migreras mellan motorerna. 5D-uppdateringar är beräkningstunga eftersom varje cell har 242 grannar. Renderer använder Canvas 2D, inte WebGL.

## Tester

- Kör befintliga tester:
  - `node --test apps/life-lab/tests/*.test.cjs` (originalmotor, integration, genetik, rendering).
  - `node apps/life-lab/tests/engine.test.mjs` (egna B/S-regler).
  - `python3 docs/validate_catalog.py` (projektstruktur).
- Testa även manuellt i webbläsare: byt dimensioner/regler, prova båda kameralägen och 2D-målning, start/paus, mutation och felsvar för ogiltiga B/S-regler.

## Historiska projekt

**`apps/life-lab/` är den enda kvarvarande Game of Life-applikationen.** Gamla mappar är borttagna efter att deras motorer och tester flyttats hit; tidigare versioner finns i Git-historiken.
