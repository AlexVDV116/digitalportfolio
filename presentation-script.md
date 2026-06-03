# Presentatiescript — Verdediging Afstudeeronderzoek

**Onderwerp:** Veilige en beheersbare integratie van een lokaal gehost LLM in Visual Studio 2022 binnen een gesloten Defensieomgeving.

**Bron:** Eindverslag v5 · MVP v0.4 · 17 Tour-scènes · ±10–11 min inleiding.

Dit zijn **presentator-cues** — geen voorleestekst. Per scène: doel, 3–6 steekwoorden, geschatte spreektijd. De onderzoekslijn volgt het eindverslag:

> **Context → Hoofdvraag → DV1 → DV2 → DV3 → DV4 → DV5 → Theorie → Ontwerpcriteria → Realisatie → Validatie → Roadmap → Conclusie**

**Bediening:** klik **Proces** in de topbar → bladeren met `→` / spatie, terug met `←`, sluiten met `Esc`.

---

## 1 · Context & probleemstelling
`landing` · ⏱ ~45 s
**Doel:** probleem laten landen vóór de oplossing.
- Air-gapped Defensienetwerk → geen cloud-AI (Copilot, ChatGPT)
- Broncode mag de omgeving niet verlaten
- Ontwikkelaars willen wél AI bij uitleg, refactoring, tests
- Spanning: productiviteit ↔ beveiligingskaders
- *Nog geen oplossing noemen*

## 2 · Centrale onderzoeksvraag & deelvragen
`#glance` · ⏱ ~45 s
**Doel:** structuur van het onderzoek tonen.
- Hoofdvraag: **veilig** én **beheersbaar**, zonder kaders te schenden
- Vijf deelvragen = bouw-en-evalueer-keten
- Elke deelvraag → eigen, aantoonbare uitkomst

## 3 · DV1 — Beveiligings- & architectuureisen
`deelvragen/#dv1` · ⏱ ~25 s
**Doel:** het fundament onder "veilig".
- Methode: documentanalyse (BIO, D/300)
- Lokale hosting alléén = onvoldoende
- → geen externe AI · geen opslag · contextbeperking · scheiding
- Draagt OC-4 / OC-5 / OC-6

## 4 · DV2 — Functionele & niet-functionele eisen
`deelvragen/#dv2` · ⏱ ~25 s
**Doel:** gebruikersbehoefte → eisen.
- Methode: interviews
- Waarde = aansluiting op de VS-workflow
- Regie over in- en output; geen auto-apply
- → 8 FR · 5 NFR · 2 C · OC-1 / OC-2 / OC-9

## 5 · DV3 — Ontwerpprincipes
`deelvragen/#dv3` · ⏱ ~25 s
**Doel:** leren van bestaande tools.
- Methode: vergelijkende analyse (Continue, BroPilot, LocalStudio)
- Niet 1-op-1 overnemen → filteren op gesloten omgeving
- Expliciete context · aparte clientlaag · output als voorstel

## 6 · DV4 — Communicatiearchitectuur
`deelvragen/#dv4` · ⏱ ~25 s
**Doel:** het fundament onder "beheersbaar".
- Methode: ontwerp + proof-of-concept
- Extensie = gecontroleerde client
- Model krijgt géén toegang tot de codebase
- Gescheiden: VSIX · core · client → leidt naar Realisatie

## 7 · DV5 — Evaluatie & validatie
`deelvragen/#dv5` · ⏱ ~30 s
**Doel:** brug naar de validatie — kort houden.
- Methode: statisch + empirisch
- MVP voldoet binnen scope
- *Cijfers komen zo bij Validatie — hier niet uitweiden*

## 8 · Theoretisch kader
`theory/` · ⏱ ~50 s
**Doel:** waar de inzichten ontstaan.
- Drie domeinen: modelgedrag · beveiliging · IDE-integratie
- De overlap levert de spanningsvelden
- Context = kwaliteit én privacy
- *Wijs op de overlap, som geen domeinen op*

## 9 · Synthese → 9 ontwerpcriteria
`theory/#sankey` · ⏱ ~40 s
**Doel:** herleidbaarheid aantonen.
- Literatuur → synthese-inzicht → ontwerpcriterium
- Consolideert DV1–DV4 tot de 9 OC
- *Niet elke lijn nalopen*

## 10 · Ontwerpcriteria — het ontwerpkompas
`oc/?id=OC-2` · ⏱ ~55 s
**Doel:** 9 OC + één volledige bewijs-keten.
- OC-2 als voorbeeld: eis → ContextMode-ceiling → 26 tests → R8
- Elk OC heeft zo'n keten (herkomst → code → test)
- Alle negen voldaan

## 11 · Realisatie — architectuur & MVP
`realisatie/` · ⏱ ~55 s
**Doel:** ontwerpcriteria zichtbaar in code.
- Twee diagrammen: gelaagde componenten + trust boundaries
- Core zonder VS-SDK · één egress-pad · model geen codebase-toegang
- *Koppel elke module terug aan een OC*

## 12 · Validatie — technisch & beveiliging
`evaluation/?tab=technical` · ⏱ ~50 s
**Doel:** de harde cijfers.
- 9/9 OC voldaan
- 499 tests / 0 failures · kernscope ~93,9% dekking
- STRIDE / OWASP LLM: geen kritieke bevindingen
- Restrisico's: prompt injection · overreliance

## 13 · Validatie — praktijkevaluatie (GAT)
`evaluation/?tab=gat` · ⏱ ~45 s
**Doel:** oordeel van de doelgroep.
- 5 ontwikkelaars · MVP v0.3
- Rapportcijfer 7,4 · aanbeveling 8,2 · human-in-the-loop 4,8
- Zwakste punt: contexttransparantie — *eerlijk benoemen*
- NFR-2 in productie gehaald: p95 4,27 s

## 14 · Dekking in één oogopslag — heatmap
`traceability/?tab=heatmap` · ⏱ ~30 s
**Doel:** dekkingscontrole.
- Geen enkele OC met lege kolom = alles herleidbaar
- Zwaarst onderbouwd: OC-2 en OC-4

## 15 · Roadmap — vooruitblik
`roadmap/` · ⏱ ~40 s
**Doel:** van onderzoek naar overdracht.
- v0.1 → v0.4 → overdracht; scopegrens markeren
- Rechts = aanbevelingen uit het verslag (A.1–A.11)
- Contextmodel · releaseborging (SBOM) · langere praktijkevaluatie

## 16 · Roadmap — koppeling onderzoeksmethodiek
`roadmap/#methodSection` · ⏱ ~30 s
**Doel:** versies ↔ methodiek.
- Design cycle van Wieringa
- Haalbaarheid → validatie → verfijning & overdracht

## 17 · Beantwoording van de hoofdvraag
`#glance` · ⏱ ~50 s
**Doel:** het antwoord.
- Binnen scope: **veilig én beheersbaar** — mits context, opslag, communicatie en toepassing expliciet begrensd
- 9 OC · 499 tests · rapportcijfer 7,4
- Traceability = de rode draad
- *Afsluiten · uitnodigen tot vragen*

---

## Kerngetallen (Q&A-spiekbriefje)

| Metriek | Waarde |
|---|---|
| MVP-versie | v0.4 |
| Ontwerpcriteria | 9 (alle voldaan) |
| Requirements | 15 (8 FR · 5 NFR · 2 C) |
| MSTest-cases | 499 / 32 klassen · 0 failures |
| Kernscope lijn-dekking | ~93,9% |
| GAT | 5 respondenten (v0.3) · cijfer 7,4 · aanbeveling 8,2 · HITL 4,8/5 |
| NFR-2 productie | p95 4,27 s (≤ 5 s) · lokaal 24,25 s |
| Methoden | DV1 documentanalyse · DV2 interviews · DV3 vergelijkende analyse · DV4 ontwerp+PoC · DV5 evaluatief |

---

## Pre-flight checklist

- [ ] Portfolio in fullscreen openen
- [ ] Klik **Proces** in de topbar om de Tour te starten
- [ ] Test `→` / `←` / spatie en `Esc`
- [ ] Tweede scherm of print van dit script naast je
- [ ] Diagrammen op de Realisatie-pagina laden zichtbaar in
- [ ] Rustig ademen — de Tour bepaalt het ritme
