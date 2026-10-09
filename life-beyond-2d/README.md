# Life Beyond 2D ✦

## Syfte och idé

Ett experiment med **cellulära automater i 2, 3, 4 och 5 dimensioner**. Vi jämför Conways ursprungliga regler i 2D med påhittade, dimensionsanpassade regler. Målet är att utforska **emergens**: vilka mönster kan skapas av små lokala regler, utan en styrande plan?

## Beskrivning

En interaktiv webbsida med en dimensionsslider från 2D till 5D och möjlighet att starta, pausa, stega, rita och slumpstarta en simulering. **Tre lägen:** ett klassiskt 2D-snitt för målning, ett observerande perspektiv utifrån med hyperkubens wireframe och samtliga levande celler, samt en inifrånvy där ett 3D-snitt av ett 4D/5D-universum visas. Välj läge via GUI.

**Viktigt:** simuleringen kör i den valda dimensionen på riktigt, men skärmen visar **ett tvådimensionellt snitt** med axlarna X och Y. När dimensionen är 3–5 kan du ändra Z-, W- och V-koordinater med separata sliders. Det klassiska 2D-läget är alltså inte en perspektivprojektion. De två nya lägena är däremot geometriska projektioner till 2D-canvas: **Utifrån** visar alla celler med en projicerad 2D–5D-hyperkub; **Inifrån** visar alla XYZ-celler vid vald W/V-koordinat och en 3D-kub. En 4D/5D-bild kan aldrig visa samtliga rumsdimensioner direkt, och projektionen innebär visuell överlappning.

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
- **Regeluniversum:** välj Conway (2D), Echo, Bloom, Crystal eller **Evolving**. I Evolving ärver nyfödda celler en levande grannes regelpaket. En mutationsslider styr hur ofta ett av tre ärftliga drag ändras vid födseln.
- **Visningsläge:** välj *Utifrån – hela hyperkuben*, *Inifrån – tredimensionellt snitt* eller *Klassiskt 2D-snitt*. I 2D-snitt kan du rita celler; i 3D/projektionslägena går det inte att rita, men hela simuleringen fortsätter.
- **Rotation och lutning:** styr rotation i XW/WV (när dimensionerna finns), samt kamerans 3D-lutning. Kanternas wireframe kan slås av och på.
- **Z/W/V:** i klassiskt 2D-läge väljer du vilka extra koordinater som visas. I 3D-snittläget bestämmer W/V vilket XYZ-lager som visas. I utifrånläge syns hela simuleringen oavsett aktuellt snitt.
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

`simulation.js` och `renderer.js` är oberoende av DOM och exporterar sina API:er även för Node.js. Kör:

```bash
node --test tests/*.test.cjs
```

Tester täcker dimensionsstorlekar, antal grannar, Conway-blinkern, genetikens arv/mutation och populationer i 2D–5D, indexering och binära populationer, samt 2D–5D-hyperkubers hörn och kanter, giltiga projektioner, rotationens längdbevarande, 3D-snitt och att renderingen inte ändrar simuleringsdata. Manuell webbläsartestning rekommenderas för sliderinteraktioner, mobil pekstyrning och pausering.

## Agentinstruktioner

Läs [AGENTS.md](./AGENTS.md) före kodändringar. Dokumentera alla nya regelverk matematiskt och håll loopen stoppbar.

## Hur renderingen fungerar

`renderer.js` bygger hyperkubens `2^D` hörn och `D·2^(D−1)` kanter, roterar koordinater i valda plan (t.ex. XW och WV), projicerar 5D/4D ned till 3D och sedan 3D till 2D på Canvas. Levande celler renderas som färgade punkter. W styr färgton och V transparens. Detta är en matematisk projektionsvisualisering, **inte** ett påstående om att 5D ryms i fysisk 3D. Vid många levande celler kan renderingen bli långsam; ingen WebGL/Web Worker används ännu.

## Evolving: regler som ärvs och muterar

Detta är en **experimentell genetisk cellulär automat**, inte en biologisk evolutionsteori och inte en lärande AI-agent. `evolution.js` är en separat klass `EvolvingUniverse` ovanpå `simulation.js`, utan att ändra Conways eller övriga regelvärldars matematik.

Varje levande cell bär ett regelpaket med tre gener:

1. **Familj**: Echo, Bloom eller Crystal (var och en har egna dimensionsanpassade födelse- och överlevnadsintervall).
2. **birthBias**: heltalsförskjutning mellan −3 och +3 som läggs till båda gränserna för födelseintervallet.
3. **surviveBias**: motsvarande förskjutning för överlevnadsintervallet.

Alla trösklar klipps till intervallet `0..(3^D−1)` och är inkluderande. En **levande** cells egen regel avgör om den överlever. För en **död** cell väljs en levande granne slumpmässigt som föräldrakandidat. **Kandidatens** födelseregel avgör om cellen föds. Avkomman ärver sedan kandidatens tre gener. Vid födseln kan en mutation ändra **en** av: familj, birthBias eller surviveBias. Mutationssannolikheten ställs från **0 till 30 %**, förval 4 %. Mutationerna händer bara vid **födelse**, inte när befintliga celler överlever.

Regelfamiljerna visas i 2D-/3D-/4D-/5D-renderingen med enhetliga färger: **Echo = cyan**, **Bloom = gult** och **Crystal = lila**. I Evolving-läge visar GUI:t antal levande celler per familj och summerat antal mutationshändelser. Om alla celler dör kan världen inte spontant starta om utan en ny slumpstart eller manuell inritning.

**Begränsningar:** val av föräldrakandidat sker slumpmässigt för varje död cell och beror på slumptalsgeneratorn. Slumpfrö exponeras ännu inte i GUI och samma körning kan därför ge olika resultat. Ingen explicit resurskonkurrens eller fitness-funktion finns; skillnader i populationer uppstår av lokala regler. Genotypens färg representerar familjen, inte finare mutationer i tröskelvärden. 5D kan vara CPU-krävande.

**Kör och testa:** ingen byggning behövs. Öppna `index.html`, välj **Evolving**, justera mutation och starta simuleringen. I projektmappen kör `node --test tests/*.test.cjs`, inklusive `tests/evolution.test.cjs`.
