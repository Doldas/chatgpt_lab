# AGENTS.md – Life Beyond Dimensions

## Syfte och frihet

Du är en AI-agent i en **isolerad sandlåda för 2–5D cellautomater**. Här får du experimentera med egna regler, nya grannskap, visualiseringar och emergens – också när de saknar nyttomål. Prioritera nyfikenhet, begriplighet och säkra ändringar.

Läs även repo-rotens \`AGENTS.md\`. Den gäller över denna fil.

## Arbetsyta

- Ändra i normalfallet **bara \`multidimension-life/\`**.
- Uppdatera \`docs/projects.json\` när experimentets metadata ändras, så katalogen förblir korrekt.
- Skapa egen branch och PR. Ändra aldrig andra projektmappar eller default branch direkt.
- Om du behöver en CI-workflow är ändringar i \`.github/workflows/\` tillåtna när de är snävt kopplade till just detta experiment.
- Lämna alltid beslut om merge och publik hostning till människan.

## Arkitektur

- \`engine.mjs\` är en ren, DOM-fri beräkningsmotor.
- \`app.js\` läser motorn och visar 2D-skivor/projektioner av verkliga D-dimensionella världar.
- \`index.html\` och \`style.css\` är UI utan buildsteg och ramverk.
- \`engine.test.mjs\` använder Node:s standardbibliotek.

Undvik beroenden som gör att resten av labbet måste byggas eller installeras.

## Bygg, kör och testa

**Bygg:** ingenting. ES-modulerna är direkt körbara.

**Kör:** från repo-roten \`python3 -m http.server 8000\`, öppna \`http://localhost:8000/multidimension-life/\`.

**Tester:** \`node multidimension-life/engine.test.mjs\` (Node.js 18+).

Verifiera särskilt:
- 2D Conways B3/S23, oscillatorer och wraparound.
- 3D, 4D och 5D använder rätt antal Moore-grannar och rätt antal koordinater.
- Skivor och projektioner överensstämmer med den faktiska simulerade världen.
- Anpassade regler accepteras eller får tydliga felmeddelanden.
- Start/stopp, dimensionsbyte, ritning och projektionslägen fungerar.
- Prestanda-/stoppgränser kan inte kringgås av en oändlig körning.

## Begränsningar och säkerhet

- **Inga dolda agentloopar.** Användaren kan alltid stoppa simuleringen.
- Bibehåll högst 80 generationer per auto-körning och rimliga cell-/arbetsgränser, om inte människan uttryckligen beslutar något annat.
- Gör ingen nätverkstrafik, datainsamling, GPU-mine eller kostsamma API-anrop utan uttrycklig överenskommelse.
- Separera utforskande regelmekanik från externa handlingar.
- Beskriv ärligt när ett förval är experimentellt, när en 5D-vy bara är projektion, och vilka tester som faktiskt körts.

## Överlämning

Uppdatera denna \`AGENTS.md\` om agentens arbetsregler ändras, och \`README.md\` om syfte, bygg/kör, kontroller eller testning ändras. Öppna PR med tydlig sammanfattning, tester och begränsningar. Våga testa oväntade idéer; bevara människans möjlighet att avbryta och förstå dem.
