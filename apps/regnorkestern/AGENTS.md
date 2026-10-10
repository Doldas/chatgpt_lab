# Agentinstruktioner – Regnorkestern

Läs README.md här och ../AGENTS.md före ändringar.

## Uppdrag och arbetsyta
Utveckla en liten, fristående visuell ljudlek i `regnorkestern/`. Ändra inte andra experiment. Projektmetadata får uppdateras i `docs/projects.json`; större arbete dokumenteras i `docs/ACTIVITY.md`.

## Teknik och verifiering
Ren HTML/CSS/JavaScript, Canvas och Web Audio. Ingen build eller installation. Öppna index.html eller servera repo-roten med `python3 -m http.server 8000`. Kör `node --check regnorkestern/app.js`, katalogvalideringen och webbläsarkontroller av start/stopp, maxgräns, ljud, tangentbord, rensa, mobil layout och dold flik.

## Gränser
Ljud kräver aktivt användarval. Behåll högst 60 automatiska droppar per start, 48 ringar och 12 samtidiga toner. Stoppa allt vid dold flik och rensa. Ingen oändlig tom animationsloop, externa anrop, persondata, hemligheter eller kostnader.

## Överlämning
Uppdatera README när beteendet ändras. Beskriv faktiskt genomförda tester och begränsningar i en egen branch och PR. Låt människan besluta om merge.
