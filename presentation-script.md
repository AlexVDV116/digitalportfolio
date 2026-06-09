# Presentatiescript — Verdediging Afstudeeronderzoek

## 0 · Opening

Toen ChatGPT eind 2022 doorbrak, werd softwareontwikkeling volgens sommige experts (met een aandeel in AI / videokaarten) een uitstervend beroep. Binnen een paar jaar zouden AI-agents onze code schrijven, onze bugs oplossen en waarschijnlijk ook onze sprintreviews bijwonen.

Inmiddels zijn we in 2026, en AI blijkt vooral een eigenaardige collega te zijn die extreem duur is, nooit slaapt (en daarom soms hallucineert?), altijd zelfverzekerd klinkt, je zelden tegenspreekt en met indrukwekkende snelheid documentatie kan verwerken. Dat gaat meestal goed. Tot het moment waarop hij met dezelfde overtuiging een compleet verkeerde oplossing aandraagt of besluit dat het verwijderen van je D:-schijf een prima manier is om wat schijfruimte vrij te maken.

Dat roept een interessante vraag op: als AI ontwikkelaars niet vervangt, hoe kunnen we het dan wél veilig en effectief inzetten? Dat is precies de vraag die centraal staat in mijn onderzoek.

---

## 1 · Context & probleemstelling

**Doel:** probleem laten landen vóór de oplossing.

-   Air-gapped Defensienetwerk → geen cloud-AI (Copilot, ChatGPT)
-   Broncode mag de omgeving niet verlaten
-   Ontwikkelaars willen wél AI bij uitleg, refactoring, tests
-   Spanning: productiviteit ↔ beveiligingskaders
-   _Nog geen oplossing noemen_

## 2 · Centrale onderzoeksvraag & deelvragen

**Doel:** structuur van het onderzoek tonen.

-   Hoofdvraag: **veilig** én **beheersbaar**, zonder kaders te schenden
-   Vijf deelvragen = bouw-en-evalueer-keten
-   Elke deelvraag → eigen, aantoonbare uitkomst

## 3 · DV1 — Beveiligings- & architectuureisen

**Doel:** het fundament onder "veilig".

-   Methode: documentanalyse (BIO, D/300)
-   Lokale hosting alléén = onvoldoende
-   → geen externe AI · geen opslag · contextbeperking · scheiding
-   Draagt OC-4 / OC-5 / OC-6

## 4 · DV2 — Functionele & niet-functionele eisen

**Doel:** gebruikersbehoefte → eisen.

-   Methode: interviews
-   Waarde = aansluiting op de VS-workflow
-   Regie over in- en output; geen auto-apply
-   → 8 FR · 5 NFR · 2 C · OC-1 / OC-2 / OC-9

## 5 · DV3 — Ontwerpprincipes

**Doel:** leren van bestaande tools.

-   Methode: vergelijkende analyse (Continue, BroPilot, LocalStudio)
-   Niet 1-op-1 overnemen → filteren op gesloten omgeving
-   Expliciete context · aparte clientlaag · output als voorstel

## 6 · DV4 — Communicatiearchitectuur

**Doel:** het fundament onder "beheersbaar".

-   Methode: ontwerp + proof-of-concept
-   Extensie = gecontroleerde client
-   Model krijgt géén toegang tot de codebase
-   Gescheiden: VSIX · core · client → leidt naar Realisatie

## 7 · DV5 — Evaluatie & validatie

**Doel:** brug naar de validatie — kort houden.

-   Methode: statisch + empirisch
-   MVP voldoet binnen scope
-   _Cijfers komen zo bij Validatie — hier niet uitweiden_

## 8 · Theoretisch kader

**Doel:** waar de inzichten ontstaan.

-   Drie domeinen: modelgedrag · beveiliging · IDE-integratie
-   De overlap levert de spanningsvelden
-   Context = kwaliteit én privacy
-   _Wijs op de overlap, som geen domeinen op_

## 9 · Synthese → 9 ontwerpcriteria

**Doel:** herleidbaarheid aantonen.

-   Literatuur → synthese-inzicht → ontwerpcriterium
-   Consolideert DV1–DV4 tot de 9 OC
-   _Niet elke lijn nalopen_

## 10 · Ontwerpcriteria — het ontwerpkompas

**Doel:** 9 OC + één volledige bewijs-keten.

-   OC-2 als voorbeeld: eis → ContextMode-ceiling → 26 tests → R8
-   Elk OC heeft zo'n keten (herkomst → code → test)
-   Alle negen voldaan

## 11 · Realisatie — architectuur & MVP

**Doel:** ontwerpcriteria zichtbaar in code.

-   Twee diagrammen: gelaagde componenten + trust boundaries
-   Core zonder VS-SDK · één egress-pad · model geen codebase-toegang
-   _Koppel elke module terug aan een OC_

## 12 · Validatie — technisch & beveiliging

**Doel:** de harde cijfers.

-   9/9 OC voldaan
-   499 tests / 0 failures · kernscope ~93,9% dekking
-   STRIDE / OWASP LLM: geen kritieke bevindingen
-   Restrisico's: prompt injection · overreliance

## 13 · Validatie — praktijkevaluatie (GAT)

**Doel:** oordeel van de doelgroep.

-   5 ontwikkelaars · MVP v0.3
-   Rapportcijfer 7,4 · aanbeveling 8,2 · human-in-the-loop 4,8
-   Zwakste punt: contexttransparantie — _eerlijk benoemen_
-   NFR-2 in productie gehaald: p95 4,27 s

## 14 · Dekking in één oogopslag — heatmap

**Doel:** dekkingscontrole.

-   Geen enkele OC met lege kolom = alles herleidbaar
-   Zwaarst onderbouwd: OC-2 en OC-4

## 15 · Roadmap — vooruitblik

**Doel:** van onderzoek naar overdracht.

-   DV5-evaluatie formeel uitgevoerd op **v0.4**; huidige stand is **v0.5**
-   v0.5 verwerkt de gebruikersfeedback uit de GAT (UX, contexttransparantie, Apply)
-   Stippellijn = scopegrens; v1.0 = afdelingsrelease na overdracht
-   Aanbevelingen A.1–A.11 uit het verslag geven richting aan verdere iteraties

## 16 · Roadmap — koppeling onderzoeksmethodiek

**Doel:** versies ↔ methodiek.

-   Design cycle van Wieringa
-   Haalbaarheid → validatie → verfijning & overdracht

## 17 · Beantwoording van de hoofdvraag

**Doel:** het antwoord.

-   Binnen scope: **veilig én beheersbaar** — mits context, opslag, communicatie en toepassing expliciet begrensd
-   9 OC · 499 tests · rapportcijfer 7,4
-   Traceability = de rode draad
-   _Afsluiten · uitnodigen tot vragen_
