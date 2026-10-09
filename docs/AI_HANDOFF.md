# Överlämning: ny ChatGPT-konversation

Den här filen är avsedd att fungera utan att den nya ChatGPT-sessionen har tillgång till gamla konversationer.

## Vad är chatgpt_lab?

`https://github.com/Doldas/chatgpt_lab` är ett personligt, öppet laboratorium för små, fristående experiment i valfria programmeringsspråk. Experiment kan vara nyttiga, lekfulla, konstnärliga eller meningslösa. Tanken är att AI kan hjälpa till att utforska, men människan behåller kontrollen.

Ett tidigt samtal handlade om Skynet, alignment, värdet av mänsklig spontanitet och en färgfläck utan mål. Därför skapades det första projektet `meningsloshetsmaskinen/`. Den historien är **inspiration, inte ett krav** för framtida projekt.

## Repo-regler

- `AGENTS.md` i repo-roten är agentens arbetsinstruktion.
- `README.md` i roten beskriver för människor vad repot är.
- `docs/` är dokumentationssubprojektet, inklusive en statisk hjälpwebb.
- Varje **annan** toppnivåmapp är i princip ett fristående experiment. Egna språk, beroenden och byggprocesser är tillåtna.
- `docs/projects.json` är projektkatalogens källa till sanning. Namn och antal projekt ska läsas där och verifieras mot den faktiska katalogstrukturen.
- Varje projekt, även `docs/`, har en `README.md` med syfte, beskrivning, bygge och körning samt en egen `AGENTS.md` som förklarar hur agenter får arbeta lokalt.

## Hur du återupptar

1. Anslut GitHub om det behövs. Öppna det aktuella repot och dess default branch.
2. Läs `AGENTS.md`, `README.md`, `docs/projects.json` och detta dokument.
3. Kontrollera aktuella branches och PR:er innan du antar något om status. Säg till om något saknas eller har förändrats.
4. Om användaren vill skapa något: välj **ett** rimligt fristående experiment, använd ny branch/PR, skapa lokal `README.md` och `AGENTS.md`, och registrera projektet.
5. Om användaren vill vidareutveckla ett experiment: läs dess `README.md`, `AGENTS.md` och kod först. Ändra inte andra experiment i onödan.
6. Testa det du kan, redovisa det du inte kan testa, logga större arbete i `docs/ACTIVITY.md` och ge länkar till ändringarna.

## Viktiga designbeslut

- Ingen monorepo-byggprocess som tvingar alla experiment att ha samma teknikstack.
- Ingen central runtime som måste köra all kod.
- Onlinehjälpen ska vara enkel att publicera via GitHub Pages från `/docs`.
- Projekten är oberoende av hjälpwebben och kan vara CLI-, terminal-, desktop-, spel-, webb- eller dataexperiment.
- Enkla, stoppbara AI-/agentloopar är välkomna, men aldrig dolda oändliga processer.
- Repoägaren vill se arbetet: använd PR-mallen, länka kodändringar och registrera nya experiment/större arbeten i `docs/ACTIVITY.md`. Den hostbara onlinehjälpen visar PR- och commitaktivitet från offentliga GitHub-API:t.

## Kopiera till nästa chatt

> Fortsätt med mitt GitHub-labb: https://github.com/Doldas/chatgpt_lab. Läs först AGENTS.md, README.md, docs/AI_HANDOFF.md och docs/projects.json på aktuell default branch. Inspektera relevanta projekt och öppna PR:er innan du ändrar något. Följ labbets projektstruktur, läs projektets README.md och AGENTS.md, håll experiment isolerade, dokumentera syfte/bygge/körning och uppdatera projektkatalogen om du lägger till ett experiment. Arbeta i egen branch och PR; dokumentera syfte, verifiering och ändringar i PR och större arbete i docs/ACTIVITY.md; merge inte automatiskt.

## Tekniska fakta

Dokumentationswebben kan **inte** läsa gamla ChatGPT-chattar eller göra att en ny modell automatiskt känner till repot. Kontexten blir tillgänglig när en användare pekar modellen mot repot och den har tillgång till filerna. Detta dokument ska därför vara självförklarande och uppdateras när labbets praxis ändras.
