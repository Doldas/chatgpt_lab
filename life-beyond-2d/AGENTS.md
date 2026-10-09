# AGENTS.md – Life Beyond 2D

Läs rotens [AGENTS.md](../AGENTS.md), projektets [README.md](./README.md) och aktuell kod före ändring.

## Uppdrag

Utforska cellulära automater i 2–5 dimensioner och helt nya regelverk. Experiment får misslyckas eller skapa oväntade mönster. Prioritera reproducerbara observationer framför påståenden om intelligens eller biologi.

## Arbetsområde

Ändra endast `life-beyond-2d/` samt `docs/projects.json` om projektmetadata behöver uppdateras. Ändra inte andra experiment. Använd separat branch och PR; merge hanteras av människan.

## Arkitektur och teknik

- `simulation.js`: testbar, dimensionsgenerell, DOM-fri automatsimulering.
- `app.js`: canvas-ritning, kontroller och stoppbar tidsloop.
- `index.html`: responsiv statisk sida utan externa paket.
- `tests/life.test.cjs`: inbyggd Node.js test-runner, inga paket att installera.

**Bygg:** ingen byggprocess. **Kör:** öppna `index.html` eller `python3 -m http.server 8000` från repots rot. **Test:** `node --test tests/life.test.cjs`.

## Dimensionernas innebörd

Varje cell har `3^D - 1` omedelbara grannar på en D-dimensionell torus. Allt uppdateras synkront från föregående generation. Canvas visar endast ett valt 2D-snitt; hävda inte att det är en fullständig 5D-visualisering. Dimensionalitetsbyte startar ett nytt universum för att undvika otydlig projektion av gamla tillstånd.

## Säkra ramar

- Behåll **Pausa**, begränsade dimensioner och explicita storlekar.
- Stoppa simuleringen när sidan döljs; använd inga dolda, autonoma bakgrundsloopar.
- Inga API-anrop, personuppgifter, hemligheter, molnkostnader eller oannonserad publicering.
- Undvik prestandakrävande växande rutnät utan benchmark och tydlig användarkontroll.

## Färdigställande

När du ändrar regler: skriv ut intervallen, hur de beror på dimensioner och ett exempel. Uppdatera `README.md`, testsamlingen och vid behov `docs/projects.json`. Testa med `node --test tests/life.test.cjs`, kontrollera projektkatalogen och dokumentera manuell webbläsartestning i PR.
