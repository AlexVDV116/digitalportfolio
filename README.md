# Digitaal Research Portfolio — Ontwerpgericht Onderzoek

> **Integratie van een lokaal Large Language Model (LLM) in Visual Studio 2022**

Live: <https://alexvdv116.github.io/digitalportfolio/>

---

## Inhoudsopgave

1. [Wat is dit?](#wat-is-dit)
2. [Pagina-overzicht](#pagina-overzicht)
3. [Technische opzet](#technische-opzet)
4. [Lokaal draaien](#lokaal-draaien)
5. [GitHub Pages hosting](#github-pages-hosting)
6. [Mapstructuur](#mapstructuur)
7. [Onderhoud & bijwerken](#onderhoud--bijwerken)
8. [CoverageReport bestanden](#coveragereport-bestanden)

---

## Wat is dit?

Een statisch (HTML / CSS / vanilla JS) interactief portfolio dat het volledige ontwerpgerichte onderzoek rond de **LocalLLM** VS2022-extensie documenteert. Het portfolio combineert:

- **Onderzoekslijn** — de vijf deelvragen, elk met methode, kernbevindingen en gevalideerde deelconclusie uit het eindverslag.
- **Traceability** — een interactieve force-directed graph die ontwerpcriteria, requirements, risico's, constraints en todo's aan elkaar koppelt.
- **Realisatie** — architectuur & MVP met componentdiagram en trust boundaries.
- **Evaluatie & validatie** — live coverage-statistieken, teststrategie, OC-naleving, STRIDE-analyse en heatmaps.
- **Conclusie** — antwoord op de hoofdvraag, de onderzoeksbijdrage (negen overdraagbare ontwerpprincipes) en de grenzen van het onderzoek.
- **Story Mode (Tour)** — een begeleide walkthrough van 19 scènes langs de volledige onderzoekslijn, bedienbaar met toetsenbord of presentatieklikker.
- **Roadmap** — data-driven ontwikkelroadmap van conceptarchitectuur tot afdelingsrelease, met interactieve versiekaarten en methodologiekoppeling.
- **Theorie, uitvoering, tijdlijn, metacognitie, PvA** — afzonderlijke secties voor elk onderzoeksonderdeel.

Er is geen backend, geen build-stap, en geen framework. Alle data wordt geladen uit CSV-bestanden, een JavaScript config-module (`researchMetrics.js`) en een ReportGenerator HTML-rapport.

---

## Pagina-overzicht

| Pagina | Pad | Beschrijving |
|---|---|---|
| **Landing** | `index.html` | Dashboard met KPI-tegels, OC-statusoverzicht, navigatie en Tour-knop. |
| **Deelvragen** | `deelvragen/index.html` | De vijf deelvragen, elk met onderzoeksvraag, methode, kernbevindingen en gevalideerde deelconclusie uit het eindverslag. Ankersecties `#dv1`–`#dv5`. |
| **OC Explorer** | `oc/index.html` | Bewijs-keten per ontwerpcriterium (OC-1 t/m OC-9). Per OC een kaart met status, beschrijving, implementatielocaties en bewijs. |
| **Realisatie** | `realisatie/index.html` | Architectuur & MVP — componentdiagram en trust-boundaries-diagram, belangrijkste ontwerpbeslissingen en OC→module-koppeling. |
| **Evaluatie & Validatie** | `evaluation/index.html` | Coverage-balk, coverkaarten, teststrategie met per-klasse tabel (auto-parsed uit CoverageReport), OC-evaluatiekaarten, STRIDE-heatmap, risico-heatmap. |
| **Traceability** | `traceability/index.html` | Interactieve force-directed graph (D3.js) met OC's, FR's, NFR's, constraints, risico's, beveiligingsnormen, todo's en changelog als nodes. CSV-tabbladen, zoekfunctie, filters. |
| **Theoretisch kader** | `theory/index.html` | Literatuur & synthese — theoretische onderbouwing van het onderzoek. |
| **Uitvoering** | `execution/index.html` | Interactief procesdiagram van de ontwikkelcyclus. |
| **Tijdlijn** | `timeline/index.html` | Planning en tijdlijn van het project. |
| **Metacognitie** | `metacognition/index.html` | Metacognitieve cyclus — reflectie op het onderzoeksproces. |
| **Roadmap** | `roadmap/index.html` | Interactieve ontwikkelroadmap (v0.1-v1.0) met fasebanden, versiekaarten, statusfilters, detail-paneel en methodologiekoppelingstabel. Huidige positie: v0.5. |
| **Conclusie** | `conclusie/index.html` | Afsluitende sectie: antwoord op de hoofdvraag (`#antwoord`), onderzoeksbijdrage als negen overdraagbare ontwerpprincipes (`#bijdrage`) en grenzen van het onderzoek (`#grenzen`). |
| **PvA** | `pva/index.html` | Plan van Aanpak — interactief procesdiagram. |

### Story Mode (Tour)

Elke pagina bevat in de topbar een **Proces**-knop die een begeleide walkthrough start. De Tour bestaat uit **19 scènes** en volgt de onderzoekslijn:

> Context → Hoofdvraag → DV1–DV5 → Theorie → Ontwerpcriteria → Realisatie → Validatie → Roadmap → Conclusie (antwoord · bijdrage · grenzen)

Story Mode:
- Navigeert automatisch naar de juiste pagina en het juiste anker per scène.
- Toont per scène een **neutrale inhoudssamenvatting** in de overlay — bewust geschikt om door beoordelaars meegelezen te worden (geen presentator-instructies).
- **Bediening:** `→` / spatie / `Enter` of de presentatieklikker (`PageDown`) vooruit; `←` of `PageUp` terug; `Esc` sluit. De klikker-toetsen onderdrukken de standaard pagina-scroll; muis en touch blijven gewoon scrollen.

De scènes staan in `scripts/shared/storyScenes.js`. De bijbehorende **gesproken oefen-spreektekst** staat in `presentation-script.md` — dat is een privé repetitiehulp en geen onderdeel van de gepubliceerde site.

---

## Technische opzet

- **Puur statisch** — HTML, CSS, vanilla JavaScript (ES modules). Geen bundler, geen npm, geen framework.
- **Data als CSV** — de Master Traceability Matrix (MTM) wordt als set CSV-bestanden in `traceability/data/` geladen en client-side geparsed.
- **Centrale config** — alle onderzoekscijfers staan in `scripts/shared/researchMetrics.js` (de `METRICS`-export). Pagina's importeren en gebruiken dit object.
- **Auto-parsed coverage** — de evaluatiepagina leest `evaluation/data/CoverageReport/index.htm` via `DOMParser` en overschrijft de fallback-waarden uit `researchMetrics.js`.
- **Thema** — light/dark mode toggle, opgeslagen in `localStorage`.
- **Geen externe dependencies** — D3.js wordt als lokaal script geladen voor de traceability-graph.

---

## Lokaal draaien

Omdat het portfolio ES modules (`import`/`export`) en `fetch()` gebruikt, is een lokale HTTP-server nodig (browsers blokkeren module-imports via `file://`).

### Optie 1: Python (aanbevolen)

```bash
cd digitalportfolio
python3 -m http.server 8000
# Open http://localhost:8000
```

### Optie 2: Node.js

```bash
npx serve .
# Open het getoonde adres (standaard http://localhost:3000)
```

### Optie 3: VS Code Live Server

1. Installeer de extensie **Live Server** (ritwickdey.LiveServer).
2. Open de portfolio-map in VS Code.
3. Klik rechts op `index.html` → **Open with Live Server**.

> **Let op:** de CoverageReport-parser doet een relatief `fetch("./data/CoverageReport/index.htm")` vanuit de evaluatiepagina. Dit werkt alleen als de server vanuit de portfolio-root wordt gestart.

---

## GitHub Pages hosting

Het portfolio wordt automatisch gehost via **GitHub Pages** op `https://alexvdv116.github.io/digitalportfolio/`.

- **Branch:** de branch die in GitHub Pages is geconfigureerd (meestal `main`).
- **Pad:** root (`/`) — er is geen subfolder-configuratie nodig.
- **Deployen:** push naar de geconfigureerde branch; GitHub Pages publiceert automatisch.
- **Geen build-stap:** GitHub Pages serveert de bestanden direct, er is geen GitHub Action of build-pipeline nodig.

---

## Mapstructuur

```
digitalportfolio/
├── index.html                          # Landing-pagina
├── README.md                           # Dit bestand
├── presentation-script.md              # Gesproken oefenscript voor de Tour (privé repetitiehulp)
├── assets/                             # Iconen, favicon, afbeeldingen
│   └── images/
│       ├── component_diagram_v0.4.png  # Componentdiagram (Realisatie-pagina)
│       └── trust_boundaries.png        # Trust-boundaries-diagram (Realisatie-pagina)
├── styles/
│   └── main.css                        # Enkele stylesheet voor alles
├── scripts/
│   └── shared/
│       ├── researchMetrics.js          # ★ Centrale config (METRICS)
│       ├── storyScenes.js              # Story Mode scenes
│       ├── storyMode.js                # Story Mode engine
│       ├── nav.js                      # Navigatie-component
│       ├── themeToggle.js              # Light/dark toggle
│       └── diagramPage.js              # Herbruikbaar diagram-component
├── evaluation/
│   ├── index.html                      # Evaluatie & Validatie pagina
│   ├── scripts/
│   │   ├── evaluation.js               # Evaluatiepagina-logica
│   │   └── coverageReportParser.js     # ★ Auto-parser voor CoverageReport
│   └── data/
│       └── CoverageReport/             # ★ ReportGenerator HTML-output
│           ├── index.htm               # Samenvattingsrapport (geparsed)
│           ├── index.html              # Idem (gelinkt vanuit klasse-pagina's)
│           ├── report.css              # Stijlen voor rapport
│           ├── main.js / class.js      # JS voor rapport-interactiviteit
│           └── LocalLLM_*.html (42x)   # Per-klasse coverage detail
├── oc/
│   ├── index.html                      # OC Explorer
│   ├── scripts/
│   └── data/
│       └── ocDetails.js                # Per-OC detaildata
├── traceability/
│   ├── index.html                      # Traceability-graph + tabbladen
│   ├── scripts/
│   └── data/
│       ├── graph.js                    # D3-graph nodes en links
│       ├── OC_Traceability.csv         # ★ MTM: OC-traceerbaarheid
│       ├── FR_Traceability.csv         # ★ MTM: Functionele requirements
│       ├── NFR_Traceability.csv        # ★ MTM: Niet-functionele requirements
│       ├── Constraints.csv             # ★ MTM: Constraints
│       ├── Risicoregister.csv          # ★ MTM: Risico's
│       ├── Beveiligingsnormen.csv      # ★ MTM: Beveiligingsnormen
│       ├── Todo.csv                    # ★ MTM: Aanbevelingen / todo's
│       ├── Changelog.csv              # ★ MTM: Changelog
│       └── Overzicht.csv              # ★ MTM: Overzichtstabblad
├── roadmap/
│   ├── index.html                      # Roadmap pagina
│   ├── scripts/
│   │   └── roadmap.js                  # Roadmap rendering logic
│   └── data/
│       └── roadmapData.js              # ★ Centrale roadmap configuratie
├── deelvragen/                         # Deelvragen DV1–DV5 (onderzoekslijn)
│   └── index.html
├── realisatie/                         # Architectuur & MVP (component + trust boundaries)
│   └── index.html
├── conclusie/                          # Antwoord, onderzoeksbijdrage & grenzen
│   └── index.html
├── theory/                             # Theoretisch kader
├── execution/                          # Uitvoering procesdiagram
├── timeline/                           # Tijdlijn & planning
├── metacognition/                      # Metacognitieve cyclus
└── pva/                                # Plan van Aanpak
```

Met ★ gemarkeerde bestanden worden regelmatig bijgewerkt bij een nieuwe MVP-versie.

---

## Onderhoud & bijwerken

Dit hoofdstuk beschrijft hoe het portfolio bijgewerkt moet worden bij een nieuwe MVP-versie, nieuw testreport of gewijzigde MTM.

### Centrale configuratie

Alle cijfers die op meerdere pagina's terugkomen staan op **een plek**:

```
scripts/shared/researchMetrics.js  →  export const METRICS = { ... }
```

De `METRICS`-export bevat:
- `mvp.*` — versienummer, STD-versie, evaluatiedatum, framework, coverage-tool.
- `research.*` — aantallen deelvragen, OC's, requirements, FR's, NFR's, constraints.
- `tests.*` — testaantallen, coverage-percentages, mutatiescore.
- `ocStatus[]` — OC-nalevingsstatus per OC.
- `stride[]` — STRIDE-dreigingsanalyse.
- `risks[]` — risicoregister.
- `gat.*` — configuratie voor de gebruikersacceptatietest (Google Form kolom-mapping).

### Welke waarden zijn automatisch vs. handmatig?

| Waarde | Bron | Type |
|---|---|---|
| `tests.projectLine`, `tests.projectBranch` | CoverageReport `index.htm` | **AUTOMATISCH** — geparsed bij laden |
| `tests.coveredLines`, `tests.coverableLines`, `tests.totalLines` | CoverageReport `index.htm` | **AUTOMATISCH** |
| `tests.coveredBranches`, `tests.totalBranches` | CoverageReport `index.htm` | **AUTOMATISCH** |
| `tests.totalProductionClasses` | CoverageReport `index.htm` | **AUTOMATISCH** |
| `tests.coverageDate`, `tests.coverageParser` | CoverageReport `index.htm` | **AUTOMATISCH** |
| Per-klasse coverage (tabel op evaluatiepagina) | CoverageReport `index.htm` | **AUTOMATISCH** |
| `mvp.version`, `mvp.stdVersion`, `mvp.stdDate` | STD document | **HANDMATIG** |
| `tests.total` (aantal test-methoden) | STD document | **HANDMATIG** |
| `tests.unitClasses`, `tests.integrationClasses`, `tests.totalTestClasses` | STD document | **HANDMATIG** |
| `tests.coreLine`, `tests.coreBranch` | STD (berekend na uitsluiting WPF) | **HANDMATIG** |
| `tests.mutationsKilled`, `tests.mutationsTotal` | STD document | **HANDMATIG** |
| `research.*` | Alleen bij scope-wijziging | **HANDMATIG** |
| `ocStatus[]`, `stride[]`, `risks[]` | Evaluatierapport | **HANDMATIG** |

> **Vuistregel:** als het in het CoverageReport staat, wordt het automatisch gelezen. Al het andere moet handmatig in `researchMetrics.js` worden aangepast.

### Stap-voor-stap checklist: nieuwe MVP-versie

#### 1. CoverageReport vervangen

```bash
# 1a. Genereer een nieuw rapport met ReportGenerator:
reportgenerator -reports:TestResults/coverage.cobertura.xml \
    -targetdir:CoverageReport -reporttypes:Html

# 1b. Verwijder de oude inhoud en kopieer de nieuwe:
rm -rf evaluation/data/CoverageReport/*
cp -r /pad/naar/nieuwe/CoverageReport/* evaluation/data/CoverageReport/

# 1c. (Optioneel) Verwijder SVG-bestanden — CSS bevat base64-fallbacks:
rm evaluation/data/CoverageReport/*.svg
```

De evaluatiepagina's `coverageReportParser.js` leest automatisch het nieuwe `index.htm` en toont de bijgewerkte statistieken. Geen code-aanpassing nodig.

#### 2. researchMetrics.js bijwerken

Open `scripts/shared/researchMetrics.js` en werk de **HANDMATIG**-velden bij:

```javascript
mvp: {
    version: "v0.5",           // ← nieuwe versie
    stdVersion: "STD v3",      // ← als er een nieuw STD is
    stdDate: "...",
    evalVersion: "v8",
    evalDate: "...",
},
tests: {
    total: ...,                // ← nieuw totaal uit STD
    unitClasses: ...,          // ← nieuw aantal unit-testklassen
    integrationClasses: ...,   // ← nieuw aantal integratieklassen
    totalTestClasses: ...,     // ← som van bovenstaande
    coreLine: ...,             // ← core-scope coverage uit STD
    coreBranch: ...,
    mutationsKilled: ...,
    mutationsTotal: ...,
},
```

Werk ook de **fallback-waarden** bij (de `projectLine`, `projectBranch`, etc.) zodat het portfolio nog steeds correcte cijfers toont als het CoverageReport niet geladen kan worden.

#### 3. MTM CSV-bestanden vervangen

Exporteer de nieuwe sheets uit de Master Traceability Matrix (Excel/Google Sheets) als **CSV met `;` als scheidingsteken** en kopieer naar `traceability/data/`:

```
OC_Traceability.csv
FR_Traceability.csv
NFR_Traceability.csv
Constraints.csv
Risicoregister.csv
Beveiligingsnormen.csv
Todo.csv
Changelog.csv
Overzicht.csv
```

> **Let op:** de CSV-bestanden gebruiken `;` (puntkomma) als delimiter, niet `,`. Het portfolio verwacht dit formaat.

#### 4. Landing-pagina KPI's controleren

De KPI-tegels op `index.html` gebruiken hardcoded waarden. Controleer en werk bij:
- Aantal testcases
- Aantal testklassen
- MVP-versie

#### 5. graph.js bijwerken (traceability)

Als er nieuwe OC's, requirements of risico's zijn toegevoegd, moeten de nodes en links in `traceability/data/graph.js` worden bijgewerkt. Dit bestand definieert de D3-graph.

#### 6. OC Explorer bijwerken

Als de OC-evaluatie is gewijzigd, werk `oc/data/ocDetails.js` bij met nieuwe bewijs-referenties en statussen.

#### 7. Story Mode scenes controleren

Controleer `scripts/shared/storyScenes.js` op hardcoded cijfers die mogelijk zijn gewijzigd (bijv. testaantallen, versienummers).

#### 8. Commit en push

```bash
git add -A
git commit -m "Portfolio bijgewerkt naar MVP vX.X"
git push
```

GitHub Pages publiceert automatisch.

### Onderhoud van individuele onderdelen

| Onderdeel | Bestand(en) | Actie |
|---|---|---|
| Coverage-cijfers (project-breed) | `evaluation/data/CoverageReport/` | Vervang de hele map door nieuwe ReportGenerator-output |
| Coverage-cijfers (core-scope) | `researchMetrics.js` → `tests.coreLine/coreBranch` | Handmatig berekenen na uitsluiting WPF/XAML |
| Testaantallen | `researchMetrics.js` → `tests.total/unitClasses/...` | Handmatig uit STD overnemen |
| OC-status | `researchMetrics.js` → `ocStatus[]` | Handmatig per OC bijwerken |
| STRIDE-analyse | `researchMetrics.js` → `stride[]` | Handmatig uit evaluatierapport |
| Risicoregister | `researchMetrics.js` → `risks[]` + `traceability/data/Risicoregister.csv` | Beide bijwerken |
| MTM-tabbladen | `traceability/data/*.csv` | CSV-export uit MTM-spreadsheet |
| Roadmap-versies | `roadmap/data/roadmapData.js` | Nieuwe versie: voeg object toe aan `VERSIONS[]`; verplaats `current: true` (nu v0.5) |
| Deelvragen-inhoud | `deelvragen/index.html` | Statische inhoud uit het eindverslag (vraag, methode, bevindingen, deelconclusie) |
| Realisatie-diagrammen | `realisatie/index.html` + `assets/images/` | Vervang de PNG's en/of de toelichtende tekst |
| Conclusie-inhoud | `conclusie/index.html` | Antwoord (§8.5), bijdrage (§8.6) en grenzen (§8.7) uit het eindverslag |
| Story Mode teksten | `scripts/shared/storyScenes.js` | Handmatig narration bijwerken (on-screen, neutraal) |
| Oefenscript | `presentation-script.md` | Gesproken tekst per scène — bijwerken bij scène-wijziging |
| Thema / styling | `styles/main.css` | Enkel CSS-bestand |

---

## CoverageReport bestanden

De map `evaluation/data/CoverageReport/` bevat de HTML-output van **ReportGenerator** (gegenereerd uit Coverlet/Cobertura XML). Dit is een kopie van het volledige rapport dat in het portfolio is opgenomen voor zowel automatische parsing als navigeerbare detail-pagina's.

### Bestandsoverzicht (47 bestanden, ~5 MB)

| Type | Aantal | Grootte | Doel |
|---|---|---|---|
| `index.htm` | 1 | ~37 KB | Samenvattingsrapport — **dit bestand wordt automatisch geparsed** |
| `index.html` | 1 | ~37 KB | Identiek aan `index.htm`; gelinkt vanuit klasse-pagina's |
| `LocalLLM_*.html` | 42 | ~4,4 MB | Per-klasse coverage detail (navigeerbaar rapport) |
| `report.css` | 1 | ~30 KB | Stijlen voor het rapport |
| `main.js`, `class.js` | 2 | ~15 KB | JavaScript voor rapport-interactiviteit |

### Wat is minimaal nodig?

- **Alleen statistieken** (auto-parsed): `index.htm` (~37 KB) is voldoende. De parser leest alleen dit bestand.
- **Volledig navigeerbaar rapport**: alle 47 bestanden zijn nodig.

Het portfolio is geconfigureerd voor het volledige rapport, zodat gebruikers door kunnen klikken naar individuele klassen.

### Verwijderde bestanden

Er zijn 25 SVG-bestanden verwijderd (`icon_*.svg`). Deze waren origineel onderdeel van de ReportGenerator-output, maar `report.css` bevat voor elk icoon een CSS-fallback met inline base64-data:

```css
background-image: url(icon_example.svg), url("data:image/svg+xml;base64,...");
```

Doordat de SVG ontbreekt, wordt automatisch de base64-variant geladen. Er is geen visueel verschil.

### Bij het vervangen van het CoverageReport

Bij een nieuw rapport kun je na het kopieren veilig alle `*.svg`-bestanden verwijderen:

```bash
rm evaluation/data/CoverageReport/*.svg
```

Dit bespaart ~25 bestanden zonder functioneel verlies.
