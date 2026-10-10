# Skapa ett nytt experiment

Det här är en gemensam guide för människor och framtida AI-agenter. Inga obligatoriska språk eller ramverk.

## Struktur

```text
chatgpt_lab/
├── README.md
├── AGENTS.md
├── docs/
│   ├── projects.json
│   ├── README.md
│   └── AGENTS.md
└── apps/
    ├── meningsloshetsmaskinen/
    │   ├── README.md
    │   ├── AGENTS.md
    │   └── index.html
    └── mitt-nya-experiment/
        ├── README.md
        ├── AGENTS.md
        └── ...
```

## Krav per miniprojekt

Varje ny mapp under apps/ för ett experiment ska ha **både `README.md` och `AGENTS.md`**. Dokumentationssubprojektet `docs/` följer samma krav.

`README.md` måste förklara:

1. **Vad:** idé, syfte eller lekfull frågeställning. Det får sakna nyttomål.
2. **Teknik och bygg:** språk, versioner, beroenden och **exakta byggsteg** eller tydligt besked att ingen byggning behövs.
3. **Kör så här:** exakta kommandon eller steg, även om det bara är att öppna en HTML-fil.
4. **Interaktion:** kontroller, indata/utdata och eventuella exempel.
5. **Begränsningar:** vad som inte fungerar ännu, eventuell nätverks- eller kostnadspåverkan.
6. **Verifiering:** tester/kontroller eller vad som ännu inte testats.

`AGENTS.md` måste ange:

1. **Uppdrag:** projektets syfte och vilken sorts experiment som är tillåtet.
2. **Arbetsyta:** vilka filer agenten får ändra och vilka andra projekt den inte ska röra.
3. **Teknik:** hur agenten bygger, kör och testar projektet.
4. **Självständighet:** gränser, kostnader, externa anrop och stoppbara loopar.
5. **Överlämning:** dokumentationskrav, vad agenten ska verifiera och hur den lämnar en PR för mänsklig granskning.

Håll instruktionerna lokala till respektive projekt. Repo-rotens `AGENTS.md` gäller alltid som gemensam policy.

## Registrera i hjälpkatalogen

Uppdatera `docs/projects.json`, som innehåller `schemaVersion`, `repository` och `projects` (en array). Varje projektpost har:

| Fält | Typ | Beskrivning |
|---|---|---|
| `id` | sträng | Unikt, t.ex. `mitt-nya-experiment` |
| `title` | sträng | Projektets namn |
| `subtitle` | sträng | Kort rubrik |
| `description` | sträng | Vad det gör |
| `path` | sträng | Mapp under apps/, t.ex. `apps/mitt-nya-experiment` |
| `language` | sträng | Språk eller stack |
| `kind` | sträng | T.ex. `Webb`, `CLI`, `Spel`, `Konst` |
| `status` | sträng | T.ex. `experiment`, `prototyp`, `stabil` |
| `howToRun` | sträng | Kort körbeskrivning |
| `hasLiveDemo` | boolean | `true` **endast när en verifierad, publik demo finns** |

Lägg till `liveUrl` (https-länk) **endast** om `hasLiveDemo` är sant. Lägg aldrig in gissade länkar. Hjälpwebben visar projekt från denna katalog; dess HTML behöver inte redigeras när ett projekt tillkommer.

## Arbetsflöde

1. Läs aktuella instruktioner och projektkatalogen.
2. Skapa en unik ny mapp under `apps/`. Ändra inte andra experiment i onödan.
3. Implementera litet och verifierbart, utan hemligheter eller tvingande beroenden för övriga projekt.
4. Skriv **både projektets `README.md` och `AGENTS.md`**, och uppdatera `docs/projects.json`.
5. Kör `python3 docs/validate_catalog.py` från repo-roten; kontrollera även övriga tester, länkar och dokumentation. CI validerar samma krav automatiskt på PR:er.
6. Skicka PR på separat branch. Fyll i `.github/pull_request_template.md` med vad som byggts, varför, filer, tester och nästa steg. För nya experiment eller större förändringar, lägg till en daterad post i `docs/ACTIVITY.md`. Merga inte automatiskt.

## Insyn i agenternas arbete

Repoägaren ska enkelt kunna se vad AI-assisterat arbete har resulterat i: den hostbara hjälpwebben har en aktivitetssektion som hämtar **offentliga PR:er och commits** från GitHub och länkar till diffar. `docs/ACTIVITY.md` kompletterar med en kort och mänskligt läsbar arbetsjournal. Den beskriver konkreta handlingar och verifierade resultat – inte privata modellresonemang eller osparat arbete.

## Specifikt för AI-loopar

Sätt en stoppknapp, säker maxgräns för varje körning och tydlig information om externa anrop och kostnader. En agent ska inte fortsätta i en dold oändlig loop. Människan ska kunna avbryta.

## GitHub Pages

Onlinehjälpen är ett eget statiskt subprojekt i `docs/` och kan serveras från repo-inställningarna (branch `master`, folder `/docs`). Att lägga till experiment under apps/ betyder **inte** automatiskt att deras appar hostas på GitHub Pages.
