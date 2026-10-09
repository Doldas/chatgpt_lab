# AGENTS.md – Life Lab (gemensamt experiment)

Läs [README.md](./README.md), [../AGENTS.md](../AGENTS.md), samt de båda tidigare experimentens README/AGENTS innan ändring.

## Syfte och arbetsområde
Den här mappen är den **gemensamma användarapplikationen** för båda Game of Life-experimenten, med 2–5D, egna regelverk, ärftlig mutation och hyperkubprojektioner.

Ändra normalt endast `life-lab/` och katalogposten i `docs/projects.json` om dess metadata behöver uppdateras. Ändringar i ursprungliga experimentmappar kräver en uttrycklig, dokumenterad anledning; behåll dem som referenser. Gör alla ändringar på separat branch/PR.

## Motorer och begränsningar
- `app.mjs` importerar `../multidimension-life/engine.mjs` som ES-modul och `../life-beyond-2d/simulation.js` som globalt skript.
- `evolution.js` använder den globala `LifeLab`-simuleringsmotorn från föregående skript. `renderer.js` är projekteringsmotorn.
- Håll adaptergränssnittet sammanhållet. För egna B/S-regler kräver renderaren en binär, indexerbar vy av glesa celler. Rör inte simuleringens tillstånd när du renderar.
- Var noga med att markera att 4D/5D visas som projektioner och 3D-snitt, inte direkt fysisk 5D-rendering.
- Evolving-mutationer ska ske endast vid födsel och vara ärftliga; skriv matematik och begränsningar i README när den ändras.

## Bygg, kör, testa
- **Bygg:** ingen. **Kör:** `python3 -m http.server 8000` från repo-roten, besök `http://localhost:8000/life-lab/`. En kopia av enbart `life-lab/` kan inte köras utan de två importerade motorerna.
- **Test:** `node --test life-lab/tests/*.test.cjs`, `node --test life-beyond-2d/tests/*.test.cjs`, `node multidimension-life/engine.test.mjs`, `python3 docs/validate_catalog.py`.
- Kontrollera användarens styrning över paus, max 80 auto-steg, stopp när fliken döljs, val av dimension och regler, och ogiltiga egna B/S-värden.
- Inga dolda bakgrundsjobb, externa API:er, insamlad data, hemligheter eller okontrollerade kostnader.
- Dokumentera testutfall och begränsningar i PR, låt människan avgöra merge.

## Nästa steg
Eventuell WebGL-instansrendering och seedad RNG bör göras i separata PR:er med prestandatester, inte som tysta ändringar i de historiska motorerna.
