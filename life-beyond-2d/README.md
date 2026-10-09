# Life Beyond 2D ✦

## Syfte och idé

Ett experiment med **cellulära automater i 2, 3, 4 och 5 dimensioner**. Vi jämför Conways ursprungliga regler i 2D med påhittade, dimensionsanpassade regler. Målet är att utforska **emergens**: vilka mönster kan skapas av små lokala regler, utan en styrande plan?

## Beskrivning

En interaktiv webbsida med en dimensionsslider från 2D till 5D och möjlighet att starta, pausa, stega, rita och slumpstarta en simulering.

**Viktigt:** simuleringen kör i den valda dimensionen på riktigt, men skärmen visar **ett tvådimensionellt snitt** med axlarna X och Y. När dimensionen är 3–5 kan du ändra Z-, W- och V-koordinater med separata sliders. Det är alltså varken en perspektivprojektion eller en bild av alla celler samtidigt.

Varje cell har `3^D - 1` närmaste grannar (inklusive diagonaler i alla dimensioner). Kantsystemet är periodiskt: universum är en D-dimensionell torus. Tillståndet är binärt (levande/död). Samtidiga generationsuppdateringar använder två buffertar.

## Regelvärldar

Alla intervall är **inklusive**, `B[a,b]` betyder att en död cell föds med mellan `a` och `b` levande grannar och `S[c,d]` betyder att en levande cell överlever med mellan `c` och `d` grannar.

| Regel | Födelseintervall | Överlevnadsintervall |
| --- | --- | --- |
| **Conway** (endast 2D) | 3 | 2–3 |
| **Echo** | `ceil(0.32 N)`–`ceil(0.40 N)` | `ceil(0.22 N)`–`ceil(0.43 N)` |
| **Bloom** | `ceil(0.14 N)`–`ceil(0.24 N)` | `ceil(0.12 N)`–`ceil(0.23 N)` |
| **Crystal** | `ceil(0.25 N)`–`ceil(0.29 N)` | `ceil(0.18 N)`–`ceil(0.34 N)` |

Här är `N = 3^D - 1`. Dessa nya regelverk är **experimentella**, inte etablerade biologiska modeller, och kan leda till både utrotning och homogen tillväxt. Vid övergång från 2D till högre dimensioner byts Conway automatiskt till Echo.

## Teknik, bygga och köra

- Språk: **HTML, CSS och JavaScript**, inga bibliotek, inga nätverksanrop, ingen backend.
- **Bygg:** ingenting behöver kompileras eller installeras.
- **Kör:** öppna `index.html` direkt i en modern webbläsare, alternativt kör från repots rot:

```bash
python3 -m http.server 8000
```

Öppna då `http://localhost:8000/life-beyond-2d/`.

## Användning

- **Dimensioner:** dra 2D–5D-slidern. Dimensionsbyte genererar ett nytt slumpuniversum (tidigare tillstånd sparas inte).
- **Regeluniversum:** välj Conway (2D), Echo, Bloom eller Crystal.
- **Z/W/V:** välj vilket 2D-snitt som visas i högre dimensioner.
- **Starta/Pausa, Ett steg, Slumpstart, Rensa:** kontrollerar simuleringen.
- **Täthet / Hastighet:** reglerar slumpstartens sannolikhet och generationshastighet.
- **Rita:** tryck/dra i canvas för att tända eller släcka celler på aktuellt 2D-snitt.

## Storlek och begränsningar

För att hålla beräkningen rimlig lokalt används en sidlängd per dimension:

| Dimension | Sidlängd | Totalt antal celler | Grannar/cell |
| --- | --- | --- | --- |
| 2D | 32 | 1 024 | 8 |
| 3D | 16 | 4 096 | 26 |
| 4D | 9 | 6 561 | 80 |
| 5D | 6 | 7 776 | 242 |

Detta är **diskreta topologiska dimensioner**, inte fysikens kontinuerliga dimensioner. 5D kräver många fler grannberäkningar och kan gå långsamt på mobila enheter. UI:t kör beräkningarna på huvudtråden och har ännu ingen Web Worker. Slumpstart är icke-reproducerbar mellan körningar eftersom ingen seed väljs.

## Testning

`simulation.js` är oberoende av DOM och exporterar `LifeLab` även för Node.js. Kör:

```bash
node --test tests/life.test.cjs
```

Tester täcker dimensionsstorlekar, antal grannar, Conway-blinkern, isolation mellan dimensioner vid indexering och binära populationer. Manuell webbläsartestning rekommenderas för sliderinteraktioner, mobil pekstyrning och pausering.

## Agentinstruktioner

Läs [AGENTS.md](./AGENTS.md) före kodändringar. Dokumentera alla nya regelverk matematiskt och håll loopen stoppbar.
