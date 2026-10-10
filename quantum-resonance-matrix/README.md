# Quantum Resonance Matrix

Ett audiovisuellt instrument inspirerat av matematiska resonansmönster: fyra klassiska tvådimensionella stående sinusvågor adderas och ritas som ett levande interferensfält. Dra med musen eller fingret för att skapa kortlivade ringpulser; aktivera ljud uttryckligen för en mjuk Web Audio-sinuston som ändras med pekpositionen.

**Viktigt:** Namnet är poetiskt. Detta är **inte** en kvantmekanisk simulering eller en lösare av Schrödingerekvationen. Funktionen är en dimensionslös superposition av sinusmoder med tidsberoende fas.

## Bygg och kör
Ren HTML5 Canvas, CSS och JavaScript ES Modules; inga paket och ingen byggprocess. Från repo-roten:

```sh
python3 -m http.server 8000
```

Öppna `http://localhost:8000/quantum-resonance-matrix/`. ES-moduler bör köras från HTTP i stället för `file://`.

## Kontroller
- **Starta/Pausa**: stoppbar animation, automatiskt stopp vid dold flik.
- **Frekvens, koppling, fas**: styr klassiska interferensmönster.
- **Aurora, Glöd, Monokrom**: byt färgkarta.
- **Peka/dra**: upp till åtta lokala ringpulser, var och en försvinner efter tre sekunder.
- **Ljud**: separat opt-in; avstängt som standard, tyst vid paus; stängs när fliken lämnas.
- **Spara PNG**: export av aktuell Canvas, bara efter klick.
- **Återställ**: standardvärden, töm pulser och pausa.

## Test
```sh
node --test quantum-resonance-matrix/test.mjs
python3 docs/validate_catalog.py
```

Node 18+ krävs bara för tester, inte för själva appen. Testerna kontrollerar gränsvärden, reproducerbarhet, amplitudgränser och frekvensområde. GitHub Actions kör dessutom ett verkligt Chromium-smoke-test av Canvas, reglage, start/paus, pekning, återställning och PNG-export. För att köra det lokalt med en tillfällig testinstallation i repo-roten: `npm install --no-save playwright@1.56.1`, `npx playwright install chromium`, starta HTTP-servern ovan och kör `node quantum-resonance-matrix/browser-test.cjs`. Playwright används enbart för testning och behövs inte när appen används.

## Begränsningar
Ingen realistisk kvantfysik, ingen rumslig akustik och ingen ljudexport. Ljud kan kräva användarinteraktion och stöd för Web Audio. En visuellt korrekt rendering, pekgester, mobilprestanda och ljudåtergivning måste också kontrolleras manuellt i webbläsare. Ingen extern data, telemetri, kostnad eller automatiserad nätverksaktivitet.
