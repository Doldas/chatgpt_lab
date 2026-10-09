# Onlinehjälpen – dokumentation som eget miniprojekt

## Syfte och beskrivning

Denna mapp är en **fristående, hostbar statisk webbplats** för både människor och kodagenter. Den visar en sökbar katalog över experiment, instruktioner för att komma igång, bidragsguider och en startprompt för en ny ChatGPT-session. Den är repo-rotens avsiktliga undantag från regeln att varje undermapp är ett experiment.

## Teknik och bygg

Språk: HTML, CSS, JavaScript och JSON. **Ingen byggprocess behövs**. Det finns inga externa paket, API-nycklar eller databaser. En vanlig statisk HTTP-webbserver räcker.

## Starta dokumentationen lokalt

Kör från repo-roten:

```sh
python3 -m http.server 8000
```

Öppna sedan `http://localhost:8000/docs/`. En lokal HTTP-server behövs eftersom webbsidan läser `projects.json` med `fetch`, vilket ofta blockeras via `file://`.

## Publicera hjälpen online på GitHub Pages

Efter att ändringarna mergats till `master`:
1. Öppna **Settings → Pages** i GitHub-repot.
2. Välj **Build and deployment → Deploy from a branch**.
3. Välj branch **master** och folder **/docs**, spara.
4. När GitHub Pages har publicerat bör hjälpen gå att besöka på **https://doldas.github.io/chatgpt_lab/**.

Detta är en **förväntad adress, inte en verifierad driftsatt sida**. Publicering och första byggning kan behöva aktiveras av repoägaren. Hjälpsajten är då publik. Själva experimentens källkod ligger fortfarande i sina egna rotmappar och blir inte automatiskt körbara på Pages.

## Hosta på valfri webbserver

Kopiera **hela innehållet** i `docs/` (inklusive `index.html`, `styles.css`, `app.js` och `projects.json`) till den katalog som ska vara webbplatsens rot, eller en önskad underkatalog. Servern ska leverera statiska filer över HTTP(S) och JSON som läsbar text. Webbplatsen använder relativa filvägar och fungerar därmed också bakom en underkatalog. Efter publicering behöver du kontrollera att projektkatalogen laddas och att länkarna till GitHub fungerar.

## Verifiering och begränsningar

Testa att `projects.json` laddas, att projektkorten visas och kan sökas, att kopieringsknappen fungerar i HTTPS eller ger instruktion vid nekad clipboardåtkomst och att layouten fungerar på mobil. Projektkorten är länkar till repot; de hostar inte automatiskt alla program i sina mappar. Det finns inga automatiska browser-tester ännu.

## Filöversikt

- `index.html`: tillgänglig onlinehjälp och katalogvyer
- `styles.css`: hjälpsajtens utseende
- `app.js`: sökning, rendering av projektkatalogen och kopieringshjälp
- `projects.json`: den centrala maskinläsbara projektkatalogen
- `AGENTS.md`: agentregler för dokumentationssubprojektet
- `AI_HANDOFF.md`: kontext för nya ChatGPT-sessioner
- `PROJECT_GUIDE.md`: skapande och dokumentation av experiment
- `validate_catalog.py`: lokal/CI-kontroll av katalogen och obligatoriska README-/AGENTS-filer

Dokumentationswebben har inga externa beroenden eller API-nycklar.

## Underhåll

Uppdatera `projects.json` när ett nytt experiment läggs till. Kontrollera katalog och projektdokumentation från repo-roten med `python3 docs/validate_catalog.py`. GitHub Actions kör samma kontroll på PR:er och pushar till `master`. Skapa inte hårdkodade projektkort i `index.html`. Om `projects.json` inte laddas visas ett tydligt felmeddelande.
