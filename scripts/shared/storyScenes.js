import { METRICS } from "./researchMetrics.js";

/**
 * Geleide verdedigings-flow door het portfolio.
 *
 * Volgorde: probleem → theorie → synthese → ontwerpcriteria → requirements
 *   → architectuur → evaluatie & validatie → heatmap → risico's → conclusie.
 *
 * Paden zijn relatief aan de portfolio-root.
 * Op productie (GitHub Pages): `/digitalportfolio/<path>`.
 * Lokaal (python -m http.server): `/<path>`.
 */
export const STORY_SCENES = [
    {
        id: "intro",
        chapter: "Probleem",
        title: "Welkom — centrale onderzoeksvraag",
        narration:
            "Lokaal LLM-gebruik in een gesloten Defensieomgeving — veilig en beheersbaar maken zonder verlies aan ontwikkelaars-productiviteit.",
        path: "",
    },
    {
        id: "deelvragen",
        chapter: "Probleem",
        title: "Deelvragen & omvang van het onderzoek",
        narration:
            "De vijf deelvragen werken de centrale vraag stap voor stap uit: van beveiliging en contextgebruik tot ontwerp, bouw en evaluatie van de MVP.",
        path: "#glance",
    },
    {
        id: "theorie-domeinen",
        chapter: "Theorie",
        title: "Drie theoretische domeinen — spanningsvelden",
        narration:
            "De theorie laat zien waar LLM-gedrag, beveiliging en IDE-integratie elkaar raken. Uit die overlap zijn de ontwerpprincipes afgeleid.",
        path: "theory/",
    },
    {
        id: "synthese",
        chapter: "Synthese",
        title: "Van literatuur naar ontwerpcriterium",
        narration:
            "Methodische herleidbaarheid: elk OC volgt uit een synthese-inzicht, dat volgt uit een cluster, dat volgt uit literatuur.",
        path: "theory/#sankey",
    },
    {
        id: "oc-overzicht",
        chapter: "Ontwerpcriteria",
        title: "9 ontwerpcriteria — overkoepelend",
        narration:
            "OC-1 t/m OC-9 vormen het kader waarop het ontwerp en de evaluatie zijn gebaseerd.",
        path: "traceability/?preset=dv-oc",
    },
    {
        id: "oc-detail",
        chapter: "Ontwerpcriteria",
        title: "Bewijs-keten OC-2 (Contextbeperking)",
        narration:
            "Vanuit DV2 + BIO 10.1 (need-to-know) → FR-4/FR-7/FR-8 → ContextMode-ceiling (Off/SelectionOnly/IncludeMethod/IncludeFile) + 500-regelcap → 26 tests → mitigeert R8.",
        path: "oc/?id=OC-2",
    },
    {
        id: "requirements",
        chapter: "Requirements",
        title: "OC vertaald naar requirements",
        narration: "Elke OC produceert een set FR/NFR/Constraints.",
        path: "traceability/?preset=must",
    },
    {
        id: "architectuur",
        chapter: "Architectuur & MVP",
        title: "Realisatie — OC's gerealiseerd in code",
        narration:
            "In de architectuur is te zien hoe de ontwerpcriteria terugkomen in de belangrijkste modules van de extensie.",
        path: "traceability/?preset=oc-mvp",
    },
    {
        id: "evaluatie-validatie",
        chapter: "Evaluatie & Validatie",
        title: "Systematische validatie van de MVP",
        narration: `${METRICS.tests.total} MSTest-cases over ${METRICS.tests.totalTestClasses} testklassen · Core-scope ~${METRICS.tests.coreLine}% lijn-dekking · ${METRICS.tests.mutationsKilled}/${METRICS.tests.mutationsTotal} mutaties gevangen · alle 9 OC's aantoonbaar voldaan.`,
        path: "evaluation/?tab=technical",
    },
    {
        id: "evaluatie-gat",
        chapter: "Evaluatie & Validatie",
        title: "Praktijkevaluatie — gebruikersacceptatietest",
        narration:
            `7 JIVC SO&I-ontwikkelaars testen de MVP gedurende 2 weken in vrij gebruik. Meetpunten: NFR-2 responstijd · OC-3 herhaalbaarheid · OC-1/R7 overreliance · OC-4 packet capture.`,
        path: "evaluation/?tab=gat",
    },
    {
        id: "evaluatie-heatmap",
        chapter: "Evaluatie & Validatie",
        title: "Dekking in één oogopslag — heatmap",
        narration:
            "De heatmap laat per ontwerpcriterium zien vanuit welke deelvragen en evaluaties er dekking is.",
        path: "traceability/?tab=heatmap",
    },
    {
        id: "validatie",
        chapter: "Validatie",
        title: "Risico's afgedekt door ontwerpcriteria",
        narration: "De ontwerpcriteria beperken de belangrijkste risico's.",
        path: "traceability/?preset=oc-risk",
    },
    {
        id: "roadmap-overzicht",
        chapter: "Toekomstvisie",
        title: "Ontwikkelroadmap — van onderzoek naar overdracht",
        narration:
            "De roadmap laat zien hoe de MVP zich ontwikkeld heeft van conceptarchitectuur (v0.1) via evaluatie (v0.4) naar overdracht. Elke versie beantwoordt een andere validatievraag uit de design cycle van Wieringa.",
        path: "roadmap/",
    },
    {
        id: "roadmap-methodologie",
        chapter: "Toekomstvisie",
        title: "Koppeling onderzoeksmethodiek — iteratief groeimodel",
        narration:
            "Het iteratieve groeimodel maakt de relatie tussen versies en onderzoeksfasen expliciet: vroege versies richten zich op haalbaarheid, middenversies op validatie, en latere versies op verfijning en overdracht.",
        path: "roadmap/#methodSection",
    },
    {
        id: "afsluiting",
        chapter: "Conclusie",
        title: "Resultaat in cijfers",
        narration: `${METRICS.research.oc} ontwerpcriteria · ${METRICS.research.requirements} requirements · ${METRICS.tests.total} MSTest-cases · alle OC's voldoen aan hun acceptatievoorwaarden.`,
        path: "#glance",
    },
];
