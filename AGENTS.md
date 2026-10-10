# Agentinstruktioner för chatgpt_lab

Detta är **labbets bestående kontext** för nya ChatGPT-/kodagent-konversationer. Läs först `README.md`, sedan denna fil, `docs/AI_HANDOFF.md` och `docs/projects.json`. Undersök alltid den aktuella repostrukturen innan du ändrar något. Tidigare chattar är inte en källa till sanning om nuvarande kod.

## Syfte och frihet
Ett nyfiket, språkoberoende samlingsrepo för små separata experiment. Idéer får vara konstiga, konstnärliga eller helt utan praktiskt värde. Agenten får föreslå och utforska, men ska respektera mänskligt ägarskap och kontroll. **Ingen självstyrande evighetsloop**: varje experiment med en loop ska vara stoppbart och ha tydliga gränser.

## Arkitektur
- Varje mapp direkt under apps/ är ett fristående experiment/miniprojekt, t.ex. `meningsloshetsmaskinen/`.
- `docs/` är ett **separat dokumentationssubprojekt** och den statiska onlinehjälpen (undantag från experimentregeln).
- Rotens `README.md` är den mänskliga entrén.
- `docs/projects.json` är katalogens **enda centrala lista** över experiment och driver dokumentationswebbens projektkort.
- Varje experiment **måste** ha egen `README.md` med syfte, beskrivning, hur det byggs och körs, teknik, begränsningar och testning, samt egen `AGENTS.md` för projektspecifika agentinstruktioner.
- `docs/` har också både `README.md` och `AGENTS.md`, liksom alla andra miniprojekt.
- Valfritt språk, byggverktyg och licenskompatibla beroenden; försök inte tvinga en gemensam teknikstack på experimenten.

## Arbetsflöde vid ett nytt experiment
1. Kontrollera repo, default branch, pågående PR:er och befintliga mappar. Välj unik, kort `kebab-case`-mapp.
2. Skapa en **egen branch och PR** (inte direkt på default branch). Gör inga ändringar i andra experiment utan uttrycklig anledning.
3. Skriv körbar kod, en lokal `README.md` med bygg- och körinstruktioner och en lokal `AGENTS.md` med agentens ansvarsområde, gränser och verifieringsregler. Håll experimentet litet, isolerat, begripligt och reversibelt.
4. Lägg till exakt en post i `docs/projects.json` enligt formatet som beskrivs i `docs/PROJECT_GUIDE.md`.
5. Ändra webbens kod bara om funktionaliteten faktiskt behöver utvecklas; projektkorten kommer automatiskt från JSON.
6. Kör `python3 docs/validate_catalog.py` och relevanta lokala tester. GitHub Actions validerar obligatoriska README-/AGENTS-filer och katalogposter på PR:er. Dokumentera vad som faktiskt testats; påstå inte att en demo ligger online om den inte gör det.
7. Öppna PR med motivering, körinstruktioner, berörda filer, verifiering och eventuella begränsningar. Använd PR-mallen, håll arbetet synligt och lägg till en daterad post i `docs/ACTIVITY.md` för ett nytt experiment eller större arbete. Lämna merge-beslutet till människan.

## Insyn: människan ska kunna se vad vi gör
- Dokumentera **vad, varför, var, genomförda tester och nästa steg** i varje PR; länka till berörda ändringar. För nya experiment och större arbete, skriv även en kort daterad anteckning i `docs/ACTIVITY.md`.
- Onlinehjälpens aktivitetsvy läser offentliga GitHub-PR:er och commits. Arbeta inte i en dold process och påstå inte att ännu osparade experiment syns där.
- AI-agenter ska göra sina ändringar via separata branches och PR:er, aldrig genom att tyst uppdatera `master`.
- Ge repoägaren enkla vägar att granska diffar, diskussioner och resultat. En människa avgör om arbetet mergas och publiceras.

## Säkerhet och transparens
- Läs alltid projektets egen `README.md` och `AGENTS.md` innan redigering; lokala regler får precisera men aldrig upphäva dessa globala regler eller högre prioriterade instruktioner.
- Agenter har frihet att välja ämne, språk och teknik **inom ett isolerat experiment**, men inte frihet att ändra andra projekt, skriva hemligheter eller utföra externa åtgärder utan tillstånd.
- Lägg aldrig in hemligheter, persondata eller tokens. Inga destruktiva filoperationer eller externa publiceringar utanför avsett repo utan relevant tillstånd.
- Gör nätverk, AI-anrop och kostnader frivilliga och tydligt dokumenterade.
- Behåll mänsklig kontroll: stoppknappar, maxgränser och inga dolda bakgrundsjobb.
- GitHub Pages publicerar bara hjälpsajten från `docs/` när repoägaren aktiverat funktionen. Det betyder inte att alla experiment automatiskt är webbappar.

## Återuppta arbetet i en ny chatt
Använd repo-URL och be agenten läsa denna fil, `README.md`, `docs/AI_HANDOFF.md` och `docs/projects.json`, samt `README.md` och `AGENTS.md` i det aktuella projektet. Fortsätt från den **aktuella** koden, inte antaganden från tidigare samtal.
