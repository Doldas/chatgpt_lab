# AGENTS.md – Life Beyond 2D

Läs rotens [AGENTS.md](../AGENTS.md), projektets [README.md](./README.md) och aktuell kod före ändring.

## Uppdrag

Utforska cellulära automater i 2–5 dimensioner och helt nya regelverk. Experiment får misslyckas eller skapa oväntade mönster. Prioritera reproducerbara observationer framför påståenden om intelligens eller biologi.

## Arbetsområde

Ändra endast `life-beyond-2d/` samt `docs/projects.json` om projektmetadata behöver uppdateras. Ändra inte andra experiment. Använd separat branch och PR; merge hanteras av människan.

## Arkitektur och teknik

- `simulation.js`: testbar, dimensionsgenerell, DOM-fri automatsimulering.
- `evolution.js`: separat, DOM-fri evolverande automatsimulering med ärftliga regelpaket; måste förbli kompatibel med Universe-gränssnittet och renderarens datamodell.
- `app.js`: canvas-ritning, visningslägen, kontroller och stoppbar tidsloop.
- `renderer.js`: DOM-fri geometri, projektion från 2–5 dimensioner och 3D-snitt. Behåll API:t testbart och låt aldrig renderaren mutera simuleringens celler.
- `index.html`: responsiv statisk sida utan externa paket.
- `tests/*.test.cjs`: inbyggd Node.js test-runner, inga paket att installera.

**Bygg:** ingen byggprocess. **Kör:** öppna `index.html` eller `python3 -m http.server 8000` från repots rot. **Test:** `node --test tests/*.test.cjs`.

## Dimensionernas innebörd

Varje cell har `3^D - 1` omedelbara grannar på en D-dimensionell torus. Allt uppdateras synkront från föregående generation. GUI erbjuder ett klassiskt 2D-snitt, en projicerad hel 2D–5D-hyperkub och ett 3D-snitt. Var tydlig med att 4D/5D projiceras geometriskt, inte visas direkt som samtliga rumsliga dimensioner. 3D-snitt i högre D filtrerar W/V och muterar inte simuleringen. Dimensionalitetsbyte startar ett nytt universum för att undvika otydlig projektion av gamla tillstånd.

## Säkra ramar

- Behåll **Pausa**, begränsade dimensioner och explicita storlekar.
- Stoppa simuleringen när sidan döljs; använd inga dolda, autonoma bakgrundsloopar.
- Inga API-anrop, personuppgifter, hemligheter, molnkostnader eller oannonserad publicering.
- Undvik prestandakrävande växande rutnät utan benchmark och tydlig användarkontroll.

## Färdigställande

När du ändrar regler eller arv: dokumentera regelintervall, dimensionernas inverkan, föräldravalsalgoritm, mutation och hur tester verifierar genotyper. Håll mutationer reproducerbara med injicerad RNG i tester. Uppdatera `README.md`, testsamlingen och vid behov `docs/projects.json`. Testa med `node --test tests/*.test.cjs`, kontrollera projektkatalogen och dokumentera manuell webbläsartestning i PR.
