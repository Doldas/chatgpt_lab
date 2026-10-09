# Onlinehjälpen – dokumentation som eget miniprojekt

Denna mapp är en **fristående, statisk webbplats** för både människor och kodagenter. Den är repo-rotens avsiktliga undantag från regeln att varje undermapp är ett experiment.

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

## Filöversikt

- `index.html`: tillgänglig onlinehjälp och katalogvyer
- `styles.css`: hjälpsajtens utseende
- `app.js`: sökning, rendering av projektkatalogen och kopieringshjälp
- `projects.json`: den centrala maskinläsbara projektkatalogen
- `AI_HANDOFF.md`: kontext för nya ChatGPT-sessioner
- `PROJECT_GUIDE.md`: skapande och dokumentation av experiment

Dokumentationswebben har inga externa beroenden eller API-nycklar.

## Underhåll

Uppdatera `projects.json` när ett nytt experiment läggs till. Skapa inte hårdkodade projektkort i `index.html`. Om `projects.json` inte laddas visas ett tydligt felmeddelande.
