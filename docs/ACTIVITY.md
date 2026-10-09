# Öppen arbetsjournal – chatgpt_lab

Den här filen innehåller **förklaringar av publicerat agentarbete**: vad som gjordes, varför, vad som testades och vad som återstår. Den är en granskningslogg, **inte** en logg över interna resonemang, varje enskilt klick eller pågående processer. Exakt kod och granskningshistorik finns i respektive GitHub-PR och commit.

Hjälpsajtens sektion **Se vad vi bygger** hämtar senaste PR:er och commits direkt från GitHubs publika API. Läs alltid aktuell GitHub-status: en status nedan kan ha ändrats sedan anteckningen skrevs.

## 2026-10-09 – Färgexperimentet

- **Varför:** Utforska kreativitet utan krav på ett förutbestämt resultat.
- **Vad:** Skapade `meningsloshetsmaskinen/` med en HTML Canvas-målarduk, stoppbar slump-loop, lekfulla tolkningar och PNG-export.
- **Granskning:** [PR #1](https://github.com/Doldas/chatgpt_lab/pull/1) – mergad 2026-10-09.
- **Begränsningar:** Lekfull slump, inte en autonom AI och inte en bildförstående modell. UI-browser-test dokumenterades inte som genomfört.

## 2026-10-09 – Dokumenterat experimentlabb och insyn

- **Varför:** Nya ChatGPT-sessioner och människor ska kunna förstå repot utan tidigare chattar. Repoägaren vill dessutom kunna **se vad AI-agenter gör**.
- **Vad:** Byggde ett statiskt dokumentationssubprojekt `docs/`, projektkatalog, README- och AGENTS-instruktioner per delprojekt, överlämning för nya agenter och automatiska katalogkontroller.
- **Insyn:** En publik aktivitetsvy i onlinehjälpen visar uppdaterade GitHub-PR:er och commits med direktlänkar till ändringarna. Ingen API-nyckel krävs. Den visar inte osparad kod eller privat modellresonemang.
- **Granskning:** [PR #2](https://github.com/Doldas/chatgpt_lab/pull/2) – status måste kontrolleras i GitHub innan publicering eller fortsättning.
- **Testning:** Katalog- och dokumentationskontroller har validerats; JavaScript syntaxgranskats. GitHub Actions validerade dokumentationsreglerna på PR:en. Browser-test och GitHub Pages-drift återstår.
- **Nästa steg:** Repoägaren granskar och mergar vid önskemål, aktiverar sedan GitHub Pages för `master /docs` eller hostar `docs/` på valfri statisk server.

## Så dokumenterar nästa agent sitt arbete

För varje ändring som föreslås via PR:

1. **Vad:** Kort beskrivning av idén eller problemet.
2. **Varför:** Vad agenten vill undersöka eller åstadkomma.
3. **Var:** Ändrade projekt/filer. Länka till PR och gärna relevanta commits.
4. **Verifiering:** Kommandon/kontroller som verkligen körts; nämn saknade tester.
5. **Status och gränser:** Utkast eller klar för granskning; risker, externa anrop, begränsningar och vad människan behöver besluta.
6. **Utfall:** När något har mergats, förklara hur man kör eller tittar på det.

Fyll i PR-mallen för **alla** PR:er. Lägg till en daterad post här för större arbete och alla nya experiment. Håll loggen kort och begriplig. Låt bara PR och commits visa faktisk GitHub-aktivitet; skriv aldrig att en agent arbetar i bakgrunden när den inte gör det.
