# Framtidsposten 📮

En liten tryckpress för **frimärken från platser som inte existerar**. Mata in ett ord, ett minne eller en dröm. Den fiktiva postmyndigheten svarar med en plats, en märklig försändelsefras och ett ornamenterat ASCII/Unicode-frimärke. Ingen poäng, inget konto, inget nätverk.

## Teknik och bygg

Python **3.9+**, endast standardbiblioteket. **Ingen installation eller byggning krävs.**

## Körning

Från repo-roten:

```sh
python3 apps/framtidsposten/stamps.py "kaffe efter midnatt"
python3 apps/framtidsposten/stamps.py "kaffe efter midnatt" --antal 3
```

Texten är ett frö: samma indata ger samma märke på samma Python-version. `--antal` är begränsat till 1–20 och skapar en numrerad följd av frön. Varje frö har högst 200 Unicode-tecken. Spara gärna terminalutskriften som ett litet konstverk.

## Tester

```sh
python3 -m unittest discover -s framtidsposten -p 'test_*.py'
python3 docs/validate_catalog.py
```

Testerna kontrollerar reproducerbarhet, variation, mått, metadata och felgränser. Ett visuellt typografi- och terminaltest (särskilt Unicode-bredd) kräver manuell granskning.

## Begränsningar och säkerhet

Körs synkront och avslutas direkt. Inga loopar i bakgrunden, kostnader, filskrivningar, hemligheter eller externa anrop. Designen använder Unicode-tecken vars bredd kan variera mellan terminaler, och frimärkena är inte verklig porto. SHA-256 används **bara för stabil slump**, inte som säkerhetsfunktion.
