# Life Beyond Dimensions 🌌

Ett fristående **2D–5D Game of Life-laboratorium** där människor och AI kan utforska helt egna naturlagar.

## Syfte och beskrivning

Undersöka hur komplexitet och emergenta mönster påverkas av antalet rumsliga dimensioner och enkla lokala regler. Projektet erbjuder klassiska Conway's Game of Life i 2D **och experimentella, självvalda regler** i 3D, 4D och 5D. Här finns inget krav på att universum ska överleva eller vara användbart.

Detta är en riktig diskret D-dimensionell cellautomat, inte en 2D-effekt med en etikett. Alla celler har D heltalskoordinater och grannar i samtliga D axlar. Vyn är däremot 2D av praktiska skäl.

## Teknik och bygge

- JavaScript (ES-moduler), HTML5 Canvas och CSS, utan ramverk eller beroenden.
- En modern webbläsare och en **lokal HTTP-server** behövs för ES-modulerna.
- **Ingen kompilering eller byggprocess behövs.**
- För motor-/enhetstester: Node.js 18 eller senare (endast standardbiblioteket).
- Inga konton, API-nycklar, betalda tjänster, anrop till AI-modeller eller nätverksanrop från applikationen.

## Kör

Från **repo-roten**:

\`\`\`sh
python3 -m http.server 8000
\`\`\`

Öppna **http://localhost:8000/multidimension-life/**. Alternativt kan hela mappen publiceras på vilken statisk HTTP(S)-server som helst.

Kör testerna från repo-roten:

\`\`\`sh
node multidimension-life/engine.test.mjs
\`\`\`

Att öppna \`index.html\` direkt via \`file://\` fungerar ofta **inte**, eftersom browsern då blockerar ES-modulimporter.

## Kontroller

| Kontroll | Funktion |
|---|---|
| Dimensioner 2–5 | Skapar en ny värld med faktiskt nytt antal koordinataxlar och rätt grannar |
| 2D-skiva | Visar XY vid valda Z/W/V-koordinater |
| Projektion | Summerar alla levande celler över de dolda dimensionerna till XY |
| Axlar Z, W, V | Välj var en 2D-skiva ligger; måla alltid i denna skiva |
| B och S | Skriv egna grannantal eller intervall, t.ex. \`3,5-7\`, och tillämpa |
| Förval | Återställ det experimentella förvalet för aktiv dimension |
| Starta/stoppa | Kör eller pausa simuleringen |
| Ett steg | Simulera en generation |
| Nya frön | Nytt slumpuniversum, behåll nuvarande regel |
| Töm världen | Börja med tom värld och rita själv |
| Klick/dra | Skapa celler på aktuell XY-skiva |
| Shift-/högerklick | Radera celler på aktuell skiva |
| Tempo | Reglera hastigheten på simuleringen |

## Fysiken: vad betyder D dimensioner?

Världen är ett D-dimensionellt rutnät med samma längd längs alla D axlar, och **periodiska gränser** (ett torusuniversum). En cell kan ha \`3^D - 1\` grannar i sitt fulla Moore-grannskap:

| Dimension | Världens sidlängd | Totala positioner | Möjliga grannar/cell | Förvald regel |
|---|---:|---:|---:|---|
| 2D | 48 | 2 304 | 8 | Conway B3/S2,3 |
| 3D | 22 | 10 648 | 26 | Moln B6,7/S5–8 |
| 4D | 12 | 20 736 | 80 | Väv B14/S12–17 |
| 5D | 8 | 32 768 | 242 | Eko B30/S27–34 |

B betyder antalet grannar för att en **död** cell ska födas. S betyder antalet grannar för att en **levande** cell ska överleva. 3D–5D är *egna experimentella regelverk* och ska inte misstas för Conways ursprungliga regler. Du kan skriva vilken giltig regelkombination som helst för de aktuella grannantalen, inklusive \`B0\` om du vill utforska extrem tillväxt.

En 2D-skiva visar bara celler vars dolda koordinater matchar reglagen. En projektion räknar alla celler med samma X/Y men olika Z/W/V. **Vyn är inte en fullständigt begriplig bild av 5D-rummet**, men den låter dig utforska dess snitt och överlappningar.

## Säkerhets- och prestandagränser

- Max **6 000 levande celler** och max **1 200 000 grannbesök** per steg för att skydda webbläsaren.
- Vid gränsöverskridande **stoppas simuleringen med ett meddelande**. Celler klipps inte tyst bort.
- En start av den automatiska loopen kör högst **80 generationer** och kan stoppas när som helst.
- Simuleringen pausas när sidan döljs.
- Reglers dynamik kan orsaka utrotning, stabilisering eller snabb tillväxt. Det är förväntat och en del av experimentet.

## Filer och testning

- \`index.html\`: gränssnitt och kontroller.
- \`style.css\`: responsiv visuell layout.
- \`app.js\`: UI, 2D-vyer, interaktion och stoppbar loop.
- \`engine.mjs\`: oberoende, testbar simulator för 2–5 dimensioner.
- \`engine.test.mjs\`: assertions för Conway-oscillator, periodiska kanter, 2–5D-grannar, 2D-skivor, anpassade regler och gränser.
- \`AGENTS.md\`: regler för AI-agenter som vidareutvecklar experimentet.

Körtid, FPS, visuella interaktioner och mobilprestanda behöver även kontrolleras i riktig webbläsare; motorprov ersätter inte webbläsartest.

## Agentutveckling

Läs [AGENTS.md](./AGENTS.md) före ändringar, tillsammans med rotens gemensamma agentregler. Nya idéer som alternativa grannskap, dimensionella mutationer eller egna födelseregler är välkomna som avgränsade, testbara experiment.

> Kan en värld bli intressant bara för att vi låter reglerna leka?
