# Oefenscript — Verdediging Afstudeeronderzoek

**Onderwerp:** Veilige en beheersbare integratie van een lokaal gehost LLM in Visual Studio 2022 binnen een gesloten Defensieomgeving.

**Bron:** Eindverslag v5 · MVP v0.5 (evaluatie uitgevoerd op v0.4) · 19 Tour-scènes · ±12 min inleiding.

> Dit script is een **oefenhulp**. Tijdens de verdediging gebruik je het niet — je presenteert uit het hoofd. De tekst hieronder is wat je ongeveer per scène vertelt, zodat je het ritme en de formuleringen kunt inoefenen. De korte tekst die in de Tour-overlay op het scherm staat is bewust neutraler; dít is jouw uitgesproken versie. Per scène staan het portfolio-pad en een indicatieve spreektijd.

**Bediening:** klik **Proces** in de topbar → bladeren met `→` / spatie of de presentatieklikker (`PageDown`/`PageUp`), terug met `←`, sluiten met `Esc`.

---

## Opening — vóór scène 1

> *Goedemiddag. Ik neem jullie mee door mijn afstudeeronderzoek aan de hand van dit digitale portfolio. Ik heb het zo opgebouwd dat de rode draad — van probleem tot conclusie — stap voor stap zichtbaar wordt. Ik loop er nu doorheen; onderbreek me gerust als jullie ergens dieper op in willen gaan.*

---

## 1 · Context en probleemstelling
`landing` · ~45 s

> *Softwareontwikkelaars binnen Defensie werken in een gesloten, air-gapped netwerk. Tools als GitHub Copilot of ChatGPT sturen code naar externe servers, en dat mag daar simpelweg niet. Tegelijk willen ontwikkelaars wél de voordelen van AI-ondersteuning — bij het uitleggen van code, refactoren, en het voorbereiden van tests. Daar zit de spanning: de techniek bestaat, maar je kunt 'm niet zomaar gebruiken zonder de beveiligingskaders te schenden. Dat is het probleem waar dit onderzoek over gaat.*

## 2 · Centrale onderzoeksvraag en deelvragen
`#glance` · ~45 s

> *Dat probleem heb ik vertaald naar één centrale vraag: hoe kan een lokaal gehost LLM veilig en beheersbaar worden geïntegreerd in Visual Studio, binnen zo'n gesloten omgeving, zónder de beveiligingskaders te schenden? Om die vraag systematisch te beantwoorden heb ik 'm opgesplitst in vijf deelvragen. Die volgen de logica van een ontwerpgericht onderzoek: eerst de kaders en de behoeften, dan de ontwerpprincipes en de architectuur, en tot slot de evaluatie. Ik loop ze kort langs.*

## 3 · DV1 — Beveiligings- en architectuureisen
`deelvragen/#dv1` · ~25 s

> *Deelvraag 1 ging over de beveiligings- en architectuureisen. Die heb ik via documentanalyse onderzocht — het Defensie Beveiligingsbeleid, de D/300-serie en de BIO. De belangrijkste conclusie was dat lokaal hosten alléén niet genoeg is. Je hebt óók dataminimalisatie nodig, geen opslag van gevoelige gegevens, expliciete contextbeperking en gescheiden verantwoordelijkheden. Dit legt het fundament onder het woord 'veilig'.*

## 4 · DV2 — Functionele en niet-functionele eisen
`deelvragen/#dv2` · ~25 s

> *In deelvraag 2 heb ik via interviews met ontwikkelaars de functionele en niet-functionele eisen opgehaald. Wat daaruit kwam: de extensie heeft pas echt waarde als ze aansluit op de Visual Studio-workflow. En: ontwikkelaars willen controle houden — ze willen zien welke context wordt meegestuurd, en ze willen de output zelf beoordelen voordat die wordt toegepast. Dat vertaalt zich direct naar de human-in-the-loop-eis.*

## 5 · DV3 — Ontwerpprincipes uit bestaande integraties
`deelvragen/#dv3` · ~25 s

> *Deelvraag 3 was een vergelijkende analyse van bestaande integraties — Continue, BroPilot en LocalStudio. Die zijn vaak heel breed opgezet, maar voor onze gesloten omgeving heb je juist beperkte, controleerbare varianten nodig. De principes die ik heb overgenomen: expliciete contextselectie, een aparte clientlaag voor de modelcommunicatie, en output altijd als voorstel.*

## 6 · DV4 — Communicatiearchitectuur
`deelvragen/#dv4` · ~25 s

> *In deelvraag 4 heb ik dat vertaald naar een communicatiearchitectuur. De kern is dat de extensie optreedt als een gecontroleerde client tussen de IDE en het interne model-endpoint. Het model krijgt geen directe toegang tot de codebase of de IDE — alleen tot wat de extensie bewust doorstuurt. Dit draagt het woord 'beheersbaar', en het is meteen de opmaat naar de architectuur die ik zo laat zien.*

## 7 · DV5 — Evaluatie en validatie
`deelvragen/#dv5` · ~30 s

> *Deelvraag 5 is de evaluatie zelf. Die heb ik op drie manieren aangepakt: statische code- en architectuuranalyse, een beveiligingsevaluatie met STRIDE en de OWASP LLM Top 10, en een praktijktest met gebruikers. De korte samenvatting: de MVP voldoet binnen de scope. De concrete cijfers laat ik zo zien bij de validatie.*

## 8 · Theoretisch kader — drie domeinen
`theory/` · ~50 s

> *Even terug naar de onderbouwing. Mijn theoretisch kader rust op drie domeinen: hoe LLM's zich gedragen en wat dat betekent voor de kwaliteit van de output, informatiebeveiliging in gesloten omgevingen, en IDE-integratie. Het interessante zit in de overlap. Neem bijvoorbeeld context: meer context verbetert het antwoord, maar vergroot tegelijk het risico dat gevoelige code wordt meegestuurd. Precies die spanningsvelden hebben mijn ontwerpkeuzes bepaald.*

## 9 · Van literatuur naar ontwerpcriteria
`theory/#sankey` · ~40 s

> *Vanuit die literatuur ben ik via synthese-inzichten tot negen ontwerpcriteria gekomen. Het punt dat ik hier wil maken is herleidbaarheid: elk criterium is terug te voeren op een theoretische of normatieve bron. Geen enkele ontwerpkeuze hangt los — en dat is precies wat een ontwerpgericht onderzoek vraagt.*

## 10 · Negen ontwerpcriteria
`oc/?id=OC-2` · ~55 s

> *Dit zijn de negen ontwerpcriteria. Ze vormen het kader waar zowel het ontwerp als de evaluatie op rusten. Ik gebruik OC-2, contextbeperking, even als voorbeeld, omdat die de hele keten laat zien: van de eis, via de implementatie — de ContextMode met vier niveaus — naar 26 tests die dat gedrag bewaken. Voor elk van de negen criteria kan ik zo'n keten laten zien.*

## 11 · Architectuur en MVP
`realisatie/` · ~55 s

> *Dan de realisatie. De MVP is een Visual Studio-extensie met een gelaagde architectuur: Core, VSIX en Tests. De Core-laag heeft bewust geen Visual Studio-afhankelijkheden, zodat de kernlogica los te testen is. Rechts zien jullie de trust boundaries: het model draait achter een grens en heeft geen toegang tot de codebase of de IDE — alleen tot de context die de extensie expliciet doorstuurt. Zo is elke ontwerpkeuze terug te zien in de code.*

## 12 · Technische validatie
`evaluation/?tab=technical` · ~50 s

> *De technische validatie heb ik uitgevoerd op versie 0.4. Alle negen ontwerpcriteria zijn gerealiseerd. De testsuite bevat 499 tests die allemaal slagen, en de kernscope haalt zo'n 94% dekking. De STRIDE- en OWASP-analyse leverde geen kritieke bevindingen op. Twee risico's blijven over: prompt injection en overreliance — die zijn inherent aan LLM-gebruik, en die heb ik expliciet benoemd in plaats van weggepoetst.*

## 13 · Praktijkevaluatie — gebruikersacceptatietest
`evaluation/?tab=gat` · ~45 s

> *Naast de techniek heb ik een gebruikersacceptatietest gedaan — vijf ontwikkelaars die de extensie twee weken in de praktijk hebben gebruikt. Het gemiddelde rapportcijfer was een 7,4, de aanbevelingsscore een 8,2. Het sterkste signaal was de human-in-the-loop-aanpak, met een 4,8 op 5. Het zwakste punt was de contexttransparantie — gebruikers wilden duidelijker zien welke context bij welke vraag hoort. Dat benoem ik eerlijk, want het is een concreet verbeterpunt. De responstijd haalde in de productieomgeving de eis: een p95 van 4,27 seconden.*

## 14 · Dekking in één oogopslag
`traceability/?tab=heatmap` · ~30 s

> *Deze heatmap is mijn dekkingscontrole. Hij laat per ontwerpcriterium zien vanuit welke deelvragen er onderbouwing is. Geen enkel criterium heeft een lege kolom — alles is dus herleidbaar. OC-2 en OC-4 zijn het zwaarst onderbouwd, en dat klopt: dat zijn de criteria die de kern van het probleem raken.*

## 15 · Ontwikkelroadmap
`roadmap/` · ~40 s

> *Even de ontwikkeling in perspectief. De extensie is iteratief gegroeid: van een conceptarchitectuur in v0.1, via v0.4 — de versie waarop ik formeel heb geëvalueerd — naar de huidige versie v0.5, waarin ik de feedback uit de gebruikerstest heb verwerkt. De stippellijn is de grens van mijn onderzoeksscope; versie 1.0 valt daarbuiten en is een eventuele afdelingsrelease na overdracht.*

## 16 · Koppeling aan de onderzoeksmethodiek
`roadmap/#methodSection` · ~35 s

> *En die versies staan niet los van de methode. Het onderzoek volgt de design cycle van Wieringa, die ik heb vertaald naar vier fasen: verkennen — dat is deelvraag 1 — ontwerpen in deelvraag 2 tot en met 4, daarna realiseren, en tot slot evalueren in deelvraag 5. De verkennings- en ontwerpfase zitten in de deelvragen; de versies die je hier ziet vormen de realisatie — v0.1 tot en met v0.3 — en de evaluatie, v0.4 en v0.5. De daadwerkelijke uitrol binnen de afdeling, v1.0, valt buiten mijn onderzoeksscope.*

> **Bij doorvragen (Wieringa):** mijn onderzoek dekt de design cycle — probleemonderzoek, treatment design en treatment validation. Mijn DV5-evaluatie is treatment validation: ik toets de MVP, ik rol 'm nog niet uit. De laatste twee stappen van de engineering cycle — treatment implementation en implementation evaluation in de praktijk — zijn de vervolgstappen, en die vallen samen met v1.0.

## 17 · Antwoord op de hoofdvraag
`conclusie/#antwoord` · ~50 s

> *Dat brengt me bij het antwoord op mijn hoofdvraag. Binnen de onderzochte scope kan een lokaal gehost LLM veilig en beheersbaar worden geïntegreerd in Visual Studio. De extensie werkt als een gecontroleerde client: begrensde context, verwerking via een intern endpoint, output als voorstel, en de toepassing blijft bij de ontwikkelaar. Het antwoord is dus positief — maar wel afgebakend: het geldt zolang context, opslag, communicatie en toepassing expliciet begrensd zijn.*

## 18 · Onderzoeksbijdrage
`conclusie/#bijdrage` · ~45 s

> *Maar ik denk dat de bijdrage van dit onderzoek verder reikt dan deze ene extensie. De negen ontwerpcriteria heb ik toegepast op één omgeving, maar de principes erachter zijn breder bruikbaar. Je kunt ze lezen als negen ontwerpprincipes voor veilige AI-integratie in elke gesloten of gereguleerde omgeving — denk aan de overheid, de zorg of de financiële sector. Ik wil daar wel eerlijk in zijn: ik claim niet dat ze universeel bewezen zijn. Ze zijn afgeleid uit de literatuur, toegepast en gevalideerd in déze casus, en plausibel overdraagbaar. De waarde zit in de afwegingen die ze zichtbaar maken.*

## 19 · Grenzen van het onderzoek
`conclusie/#grenzen` · ~40 s

> *En daarmee de grenzen van mijn onderzoek, want die wil ik niet onbenoemd laten. Ten eerste: mijn gebruikerstest had vijf respondenten — genoeg als praktijkindicatie, maar niet om statistisch te generaliseren. Ten tweede: de responstijd haalde de eis in de productieomgeving, maar niet op lokale hardware met een zwaarder model. En ten derde: ik heb binnen één organisatie onderzocht, dus de specifieke resultaten gelden voor die context. Deze beperkingen halen niets af van de waarde — ze geven juist aan wat de logische vervolgstappen zijn. Daarmee wil ik afsluiten; ik ben benieuwd naar jullie vragen.*

---

## Kerngetallen (om paraat te hebben)

| Metriek | Waarde |
|---|---|
| MVP-versie | v0.5 (evaluatie op v0.4) |
| Ontwerpcriteria | 9 (alle voldaan) |
| Requirements | 15 (8 FR · 5 NFR · 2 C) |
| MSTest-cases | 499 / 32 klassen · 0 failures |
| Kernscope lijn-dekking | ~93,9% |
| GAT | 5 respondenten (v0.3) · cijfer 7,4 · aanbeveling 8,2 · HITL 4,8/5 |
| NFR-2 productie | p95 4,27 s (≤ 5 s) · lokaal 24,25 s |
| Methoden | DV1 documentanalyse · DV2 interviews · DV3 vergelijkende analyse · DV4 ontwerp+PoC · DV5 evaluatief |
| Onderzoeksbijdrage | 9 OC → 9 overdraagbare ontwerpprincipes (overheid, zorg, financieel, industrie) |

---

## Oefentips

- Lees het script eerst een paar keer hardop; daarna alleen de scènetitels als geheugensteun.
- Houd per scène de spreektijd in de gaten — de hele inleiding is ~12 minuten.
- Oefen de overgangszinnen (bijv. "Dat brengt me bij…") los, want die houden het verhaal vloeiend.
- Oefen één keer mét de presentatieklikker zodat het bladeren automatisch gaat.
- Bereid je voor op onderbrekingen: je moet vanuit elke scène kunnen losbreken en terugkeren.
- De drie sterkste momenten om rustig te nemen: het antwoord (17), de bijdrage (18) en de grenzen (19).
