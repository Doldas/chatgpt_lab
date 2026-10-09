# Onlinehjälpen – dokumentation som eget miniprojekt

## Syfte och beskrivning

Denna mapp är en **fristående, hostbar statisk webbplats** för både människor och kodagenter. Den visar en sökbar katalog över experiment, offentliga GitHub-PR:er och commits så att repoägaren kan följa utvecklingen, instruktioner för att komma igång, bidragsguider och en startprompt för en ny ChatGPT-session. Den är repo-rotens avsiktliga undantag från regeln att varje undermapp är ett experiment.

## Teknik och bygg

Språk: HTML, CSS, JavaScript och JSON. **Ingen byggprocess behövs**. Det finns inga externa paket, API-nycklar eller databaser. En vanlig statisk HTTP-webbserver räcker. Aktivitetsvyn gör publika läsanrop till `api.github.com` direkt från webbläsaren för PR:er och commits; GitHub kan begränsa anropsfrekvensen. Övriga delar fungerar utan GitHub API.

## Starta dokumentationen lokalt

Kör från repo-roten:

```sh
python3 -m http.server 8000
```

Öppna sedan `http://localhost:8000/docs/`. En lokal HTTP-server behövs eftersom webbsidan läser `projects.json` med `fetch`, vilket ofta blockeras via `file://`.

## Publicerade adresser via GitHub Pages

Repoägaren har aktiverat GitHub Pages. När webbplatsen publiceras från **master / (root)** nås resurserna på följande adresser:

- [Meningslöshetsmaskinen](https://doldas.github.io/chatgpt_lab/meningsloshetsmaskinen/) – bekräftad av repoägaren.
- [Life Lab](https://doldas.github.io/chatgpt_lab/life-lab/) – motsvarande appadress enligt samma rotstruktur.
- [Dokumentation och projektkatalog](https://doldas.github.io/chatgpt_lab/docs/) – onlinehjälpen ligger i `docs/`.

GitHub Pages-konfigurationen ska vara **Deploy from a branch → master → /(root)** om både appmappar och dokumentationen ska kunna nås direkt. Använd **inte /docs** som Pages-publiceringsrot i detta läge, eftersom länkar till apparna annars inte publiceras via samma plats.

Länkarna är adresserna för denna Pages-struktur. I den här uppdateringen kunde GitHub Pages-HTTP-svaren inte verifieras automatiskt; kontrollera särskilt Life Lab och dokumentationen manuellt.

## Hosta på valfri webbserver

Kopiera **hela innehållet** i `docs/` (inklusive `index.html`, `styles.css`, `app.js` och `projects.json`) till den katalog som ska vara webbplatsens rot, eller en önskad underkatalog. Servern ska leverera statiska filer över HTTP(S) och JSON som läsbar text. Webbplatsen använder relativa filvägar och fungerar därmed också bakom en underkatalog. Efter publicering behöver du kontrollera att projektkatalogen laddas och att länkarna till GitHub fungerar.

## Verifiering och begränsningar

Testa att `projects.json` laddas, att projektkorten visas och kan sökas, att aktivitetssektionen läser offentliga GitHub PR:er/commits och visar ett felmeddelande om GitHub API inte svarar, att kopieringsknappen fungerar i HTTPS eller ger instruktion vid nekad clipboardåtkomst och att layouten fungerar på mobil. Projektkorten är länkar till repot; de hostar inte automatiskt alla program i sina mappar. Det finns inga automatiska browser-tester ännu.

## Filöversikt

- `index.html`: tillgänglig onlinehjälp och katalogvyer
- `styles.css`: hjälpsajtens utseende
- `app.js`: sökning, rendering av projektkatalogen och kopieringshjälp
- `activity.js`: läsning och presentation av offentliga PR:er och commits utan token
- `ACTIVITY.md`: datumstämplade, mänskliga sammanfattningar av större agentinsatser
- `projects.json`: den centrala maskinläsbara projektkatalogen
- `AGENTS.md`: agentregler för dokumentationssubprojektet
- `AI_HANDOFF.md`: kontext för nya ChatGPT-sessioner
- `PROJECT_GUIDE.md`: skapande och dokumentation av experiment
- `validate_catalog.py`: lokal/CI-kontroll av katalogen och obligatoriska README-/AGENTS-filer

Dokumentationswebben har inga externa beroenden eller API-nycklar.

## Underhåll

Uppdatera `projects.json` när ett nytt experiment läggs till. Kontrollera katalog och projektdokumentation från repo-roten med `python3 docs/validate_catalog.py`. GitHub Actions kör samma kontroll på PR:er och pushar till `master`. Skapa inte hårdkodade projektkort i `index.html`. Om `projects.json` inte laddas visas ett tydligt felmeddelande.
