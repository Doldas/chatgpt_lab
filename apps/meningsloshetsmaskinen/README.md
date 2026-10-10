# Meningslöshetsmaskinen 🎨

## Syfte

Undersöka mänsklig spontanitet och en AI-liknande, slumpstyrd loop genom en lekfull målarduk **utan prestationsmål**. Ett litet konstexperiment inspirerat av tanken att en färgfläck inte behöver ha någon nytta.

## Beskrivning

En fristående webbsida där du kan kasta färg på en vit Canvas, måla med mus/finger, låta en enkel slump-loop improvisera, läsa humoristiska **påhittade** tolkningar och spara resultatet som PNG. Det är **inte** en språkmodell eller bildtolkande AI; loopen väljer slumpmässiga färger och positioner.

## Teknik och beroenden

- Språk: HTML, CSS och JavaScript (utan ramverk).
- Filer: `index.html` (allt som behövs), `README.md` (denna guide), `AGENTS.md` (lokala agentinstruktioner).
- Kräver: modern webbläsare med Canvas 2D och JavaScript.
- Externa beroenden, konton, API-nycklar och nätverksanrop: **inga**.

## Bygg

**Ingen byggprocess behövs.** Projektet är en enda körklar HTML-fil.

## Kör lokalt

**Enklast:** dubbelklicka på `index.html` och öppna filen i en modern webbläsare.

**Alternativt**, från repo-roten:

```sh
python3 -m http.server 8000
```

Öppna sedan **http://localhost:8000/meningsloshetsmaskinen/**.

## Så använder du experimentet

- **Kasta färg:** lägg en slumpmässig färgfläck.
- **Måla själv:** klicka/dra på duken med mus eller finger. Tangentbord: fokusera duken och tryck `Enter` eller mellanslag.
- **Låt slumpen måla:** startar en loop med en gräns på **28 fläckar per omgång**. Klicka igen för att stoppa.
- **Tolka verket:** visar en lekfull text, **inte** faktisk bildanalys.
- **Börja om:** rensar duken och stoppar eventuell aktiv loop.
- **Spara PNG:** sparar duken som bild via webbläsaren.

## Begränsningar och säkerhet

Inget konto eller sparad historik. En omstart rensar duken om du inte sparat PNG. Loopen pausar när sidan är dold, går att stoppa och kör som längst 28 steg per omgång. Ingen data skickas till en server.

## Verifiering

Manuell kontroll rekommenderas i webbläsare: måla på Canvas, starta/stoppa loopen, rensa och exportera PNG. Inga automatiska testverktyg ingår ännu; detta dokument intygar inte att UI-test har körts.

## För AI-agenter

Läs [AGENTS.md](./AGENTS.md) innan ändringar. Håll projektet oberoende av andra miniprojekt och dokumentera det du bygger och kör.

> Allt som är vackert behöver inte vara användbart.
