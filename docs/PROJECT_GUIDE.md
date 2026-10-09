# Skapa ett nytt experiment

Det här är en gemensam guide för människor och framtida AI-agenter. Inga obligatoriska språk eller ramverk.

## Struktur

```text
chatgpt_lab/
├── README.md                 # Startpunkt för människor
├── AGENTS.md                 # Startpunkt för AI-agenter
├── docs/                     # Dokumentationssubprojekt, onlinehjälp
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   ├── projects.json         # En gemensam projektkatalog
│   ├── README.md
│   ├── AI_HANDOFF.md
│   └── PROJECT_GUIDE.md
├── meningsloshetsmaskinen/    # Experiment 001
│   ├── README.md
│   └── index.html
└── mitt-nya-experiment/       # Nästa oberoende miniprojekt
    ├── README.md
    └── ...                   # Valfria språk/filer
```

## Krav per miniprojekt

Varje ny toppnivåmapp för ett experiment ska ha `README.md` med:

1. **Vad:** idé, syfte eller lekfull frågeställning. Det får sakna nyttomål.
2. **Teknik:** språk, versioner och eventuella beroenden.
3. **Kör så här:** exakta kommandon eller steg, även om det bara är att öppna en HTML-fil.
4. **Interaktion:** kontroller, indata/utdata och eventuella exempel.
5. **Begränsningar:** vad som inte fungerar ännu, eventuell nätverks- eller kostnadspåverkan.
6. **Verifiering:** tester/kontroller eller vad som ännu inte testats.

## Registrera i hjälpkatalogen

Uppdatera `docs/projects.json`, som innehåller `schemaVersion`, `repository` och `projects` (en array). Varje projektpost har:

| Fält | Typ | Beskrivning |
|---|---|---|
| `id` | sträng | Unikt, t.ex. `mitt-nya-experiment` |
| `title` | sträng | Projektets namn |
| `subtitle` | sträng | Kort rubrik |
| `description` | sträng | Vad det gör |
| `path` | sträng | Toppnivåmappen, t.ex. `mitt-nya-experiment` |
| `language` | sträng | Språk eller stack |
| `kind` | sträng | T.ex. `Webb`, `CLI`, `Spel`, `Konst` |
| `status` | sträng | T.ex. `experiment`, `prototyp`, `stabil` |
| `howToRun` | sträng | Kort körbeskrivning |
| `hasLiveDemo` | boolean | `true` **endast när en verifierad, publik demo finns** |

Lägg till `liveUrl` (https-länk) **endast** om `hasLiveDemo` är sant. Lägg aldrig in gissade länkar. Hjälpwebben visar projekt från denna katalog; dess HTML behöver inte redigeras när ett projekt tillkommer.

## Arbetsflöde

1. Läs aktuella instruktioner och projektkatalogen.
2. Skapa en unik ny mapp. Ändra inte andra experiment i onödan.
3. Implementera litet och verifierbart, utan hemligheter eller tvingande beroenden för övriga projekt.
4. Skriv projektets README och uppdatera `docs/projects.json`.
5. Kontrollera t.ex. JSON-syntax, länkar, tester och dokumentation.
6. Skicka PR på separat branch. Ange vad som är testat och inte testat.

## Specifikt för AI-loopar

Sätt en stoppknapp, säker maxgräns för varje körning och tydlig information om externa anrop och kostnader. En agent ska inte fortsätta i en dold oändlig loop. Människan ska kunna avbryta.

## GitHub Pages

Onlinehjälpen är ett eget statiskt subprojekt i `docs/` och kan serveras från repo-inställningarna (branch `master`, folder `/docs`). Att lägga till experiment på rotnivå betyder **inte** automatiskt att deras appar hostas på GitHub Pages.
