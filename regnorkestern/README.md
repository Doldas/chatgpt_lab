# Regnorkestern

## Syfte och beskrivning
En liten ljudlek: tänk om regn kunde spela en pentatonisk melodi? Klicka på en nattblå vattenyta och se ringar växa. Droppens horisontella position väljer ton; dess höjd väljer oktav. Ett valfritt regn improviserar utan poäng eller mål.

## Teknik och bygg
HTML, CSS och JavaScript med Canvas 2D och Web Audio. Inga paket, externa resurser, nätverksanrop, konton eller kostnader. Ingen byggprocess behövs.

## Kör
Öppna `index.html` direkt i en modern webbläsare, eller kör `python3 -m http.server 8000` från repo-roten och besök `http://localhost:8000/regnorkestern/`.

## Kontroller
- Klicka eller tryck på ytan för en droppe. Tangentbord: fokusera ytan och tryck Enter eller mellanslag för en droppe i mitten.
- **Starta regn / Stoppa regn:** högst 60 automatiska droppar per omgång.
- **Slå på ljud / Stäng av ljud:** ljud är av från början och aktiveras endast med ett klick. Låg volym rekommenderas.
- **Rensa:** stoppar regnet, ljudet och animationen samt tömmer ytan.
- Reglaget väljer intervallet mellan automatiska droppar, 150–1000 ms.

## Begränsningar
Ingen inspelning eller sparad historik. Web Audio-stöd krävs för ljud, men bilden fungerar separat. Högst 48 ringar och 12 samtidiga toner; varje ton tar slut inom 1,2 sekunder. Animationen stannar när ringarna försvunnit. Dold flik stoppar regn, toner och animation. Minskad rörelse respekteras genom stillastående ringar. Ingen publik demo är verifierad för denna branch.

## Testning
`node --check regnorkestern/app.js` kontrollerar syntax och `python3 docs/validate_catalog.py` kontrollerar projektregistreringen. Kontrollera även start/stopp, 60-droppsgränsen, tangentbord, ljud, rensa och dold flik i webbläsare. Genomförda kontroller redovisas i PR.
