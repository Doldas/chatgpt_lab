# Appar i chatgpt_lab

Alla fem experiment ligger i egna mappar under `apps/`. Varje app har en lokal `README.md` med körning och begränsningar och en `AGENTS.md` med regler för framtida ändringar. `docs/` är ett separat dokumentationsprojekt, inte en app.

| App | Typ | Körning |
| --- | --- | --- |
| [Meningslöshetsmaskinen](./meningsloshetsmaskinen/) | Canvas-konst | [Öppna HTML](./meningsloshetsmaskinen/index.html) eller kör webbservern nedan |
| [Life Lab](./life-lab/) | Cellautomater i 2–5D | `/apps/life-lab/` via lokal webbserver |
| [Regnorkestern](./regnorkestern/) | Ringar och frivilligt ljud | [Öppna HTML](./regnorkestern/index.html) eller kör webbservern |
| [Framtidsposten](./framtidsposten/) | Generativ terminalkonst | `python3 apps/framtidsposten/stamps.py "hej"` |
| [Quantum Resonance Matrix](./quantum-resonance-matrix/) | Våginterferens och frivilligt ljud | `/apps/quantum-resonance-matrix/` via lokal webbserver |

## Kör webbapparna lokalt

Från **repo-roten**:

```sh
python3 -m http.server 8000
```

Öppna `http://localhost:8000/apps/<appnamn>/`. För Life Lab och Quantum Resonance Matrix behövs en HTTP-server på grund av ES-moduler. Alla appar är oberoende av externa tjänster under normal användning.

## Kontrollera före merge

Från repo-roten:

```sh
python3 docs/validate_catalog.py
python3 -m unittest discover -s apps/framtidsposten -p 'test_*.py'
node --test apps/life-lab/tests/*.test.cjs
node apps/life-lab/tests/engine.test.mjs
node --test apps/quantum-resonance-matrix/test.mjs
node --check apps/regnorkestern/app.js
```

Node behövs för JavaScript-testerna, inte för att köra webbapparna. Quantum Resonance Matrix har dessutom ett Chromium-smoke-test i GitHub Actions. För de övriga Canvas-apparna behövs manuella kontroller av bild, tangentbord och ljud.

## Publicering

Projektkatalogens `hasLiveDemo` är i nuläget `false` för alla fem. Adresser under `/apps/` ska inte märkas som verifierade publika demos innan de har kontrollerats efter publicering. GitHub Pages-inställningar och äldre URL:er kan påverka åtkomsten.

## Vid fortsatt arbete

Läs först [rotens regler](../AGENTS.md), sedan den berörda appens `README.md` och `AGENTS.md`. Använd egen branch och PR, dokumentera faktiskt genomförda tester och låt människan avgöra merge.
