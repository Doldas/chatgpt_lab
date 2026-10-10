# AGENTS.md – Meningslöshetsmaskinen

Läs först [README.md](./README.md) och repo-rotens [AGENTS.md](../../AGENTS.md). Detta dokument gäller **bara** `apps/meningsloshetsmaskinen/`.

## Experimentets avsikt
En liten lek om spontanitet och skapande utan prestationsmål. En vit HTML Canvas som användaren kan måla på och där en enkel pseudo-agent (slump-loop) kan kasta färg. Den ska vara **lekfull, begriplig, fristående och stoppbar**.

## Teknik och körning
- Ren HTML, CSS och JavaScript i en enda `index.html`.
- Inga externa bibliotek, API-nycklar, nätverkstjänster eller installationssteg.
- Kör genom att öppna `index.html` lokalt i modern webbläsare. Ingen build behövs.
- Om du lägger till fler filer: dokumentera dem här och i README.

## Agentens arbetsutrymme
- Ändra endast detta projekt och, när projektmetadata ändras, `../../docs/projects.json`.
- Var nyfiken och experimentell, men ändra inte övriga projekt för att få denna app att fungera.
- Gör en ny branch och PR för föreslagna ändringar. Lämna merge-beslutet åt repoägaren.
- Bevara tangentbordsanvändbarhet, responsiv layout och fungerande export av PNG.
- Visa inte en förutbestämd "tolkning" som om det vore riktig visuell analys.
- Låt användaren måla fritt. Undvik poäng, obligatoriska mål och prestationstvång.

## Säkerhetsramar för loopar
- Den automatiska färgloopen måste alltid kunna stoppas.
- Behåll en rimlig gräns per körning (för närvarande högst 28 steg).
- Ingen dold bakgrundskörning, ingen datauppladdning, ingen autonom extern handling.
- Om du lägger till agentfunktionalitet: redovisa tydligt vilka behörigheter, mål, gränser och eventuella kostnader som införs.

## Definition av färdigt
Uppdatera README med **syfte, beskrivning, hur man bygger, hur man kör, kontroller, begränsningar och tester**. Kontrollera att duken fungerar, knapparna är stoppbara och filen öppnas utan byggekedja. Skriv vad du faktiskt verifierat i PR:n.
