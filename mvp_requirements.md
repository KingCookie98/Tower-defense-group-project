
# MVP Requirements

## Must have

- 1 type tårn
  - Skal kunne skyde
  - Skal koste penge
- 1 type monster
  - HP
  - Gøre skade når de kommer igennem banen
- Map med en sti
- Brugeren
  - Health
  - Penge
- Forskellige waves
  - Bliver sværere

## Ikke-funktionelle krav

- Spillet skal hedde "FG Tower Defence".
- Spillet skal vare højst 5 minutter.
- Spillet skal både kunne spilles på PC og mobil.

## Funktionelle krav

**Spil:**

- Spillet skal have en startskærm, game over-skærm og en spilskærm.
- Spillet skal starte når spilleren klikker med musen når de er på startskærmen eller game over-skærmen.
- Spillet skal slutte når spilleren ikke har mere HP eller alle waves er klaret.
- Game over-skærmen skal vise om spilleren har tabt eller vundet.
- Spillet skal vise spillerens nuværende score og high-score.
- Scoren er hvor meget liv spilleren har tilbage.
- Spillet skal indeholde tre waves, hvor tredje wave er en boss-wave.
- Spillet skal have en timer på 3 sekunder til næste wave der starter når spillet starter eller en wave slutter.

**Waves:**

- En wave skal indeholde en eller flere monstre.
- Sværhedsgraden skal stige mellem waves.
- En wave skal afsluttes, når alle dens monstre er besejret eller har nået målet.

**Spiller:**

- Spilleren skal have en mængde HP.
- Spilleren skal have en mængde penge.
- Spillerens penge skal reduceres, når spilleren køber et tårn.
- Spilleren skal ikke kunne placere et tårn, hvis spilleren ikke har penge nok.
- Spilleren skal modtage penge, når et monster bliver besejret.

**Map:**

- Spillet skal indeholde et map med en sti, som monstrene skal følge fra start til mål.
- Spilleren skal kunne placere tårne uden for stien der hvor der ikke allerede er et tårn.

**Monster:**

- Monstrene er af to typer: Almindelige og en boss.
- Et monster skal have et antal HP, som kan reduceres, når monsteret tager skade.
- Et monster skal forsvinde fra spillet, når dets HP er mindre end eller lig 0.
- Et monster skal bevæge sig gennem stien med en konstant hastighed.
- Monsteret skal give skade til spilleren når det kommer igennem stien.
- Hvis bossen kommer igennem banen taber spilleren.

**Tårn:**

- Spillet skal indeholde én type tårn.
- Et tårn skal automatisk kunne skyde på monstre inden for dets rækkevidde.
- Et tårn kan maksimalt skyde et skud hvert sekund.

**Skud:**

- Alle skud skal ramme deres mål.
- Skuddets skade skal være en tredjedel af monsterets liv.
