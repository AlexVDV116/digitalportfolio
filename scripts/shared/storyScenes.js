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
            "Vijf deelvragen operationaliseren de centrale vraag: van beveiligingsanalyse tot evaluatie van de MVP.",
        path: "#glance",
    },
    {
        id: "theorie-domeinen",
        chapter: "Theorie",
        title: "Drie theoretische domeinen — spanningsvelden",
        narration:
            "LLM-gedrag, beveiliging en IDE-integratie raken elkaar; juist de overlap leverde de ontwerpprincipes.",
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
            "OC-1 t/m OC-9 vormen het toetsbare kader. Hieronder de afleiding vanuit de deelvragen.",
        path: "traceability/?preset=dv-oc",
    },
    {
        id: "oc-detail",
        chapter: "Ontwerpcriteria",
        title: "Bewijs-keten OC-4 (Volledig offline)",
        narration:
            "Vanuit DV1 + BIO 13.1 + OWASP LLM06 → C-1/C-2/NFR-1 → LlmClientBase.IsValidHttpUrl + netwerklaag-segmentatie → 47 URL-tests → mitigeert R8.",
        path: "oc/?id=OC-4",
    },
    {
        id: "requirements",
        chapter: "Requirements",
        title: "OC vertaald naar requirements",
        narration:
            "Elke OC produceert een set FR/NFR/Constraints. Klik een node om de keten zichtbaar te maken.",
        path: "traceability/?preset=must",
    },
    {
        id: "architectuur",
        chapter: "Architectuur & MVP",
        title: "Realisatie — OC's gerealiseerd in code",
        narration:
            "Zeven kernmodules dragen de OC's. AppDefaults centraliseert constants; OllamaClient is de enige uitgaande netwerkactor.",
        path: "traceability/?preset=oc-mvp",
    },
    {
        id: "evaluatie-validatie",
        chapter: "Evaluatie & Validatie",
        title: "Systematische validatie van de MVP",
        narration:
            `${METRICS.tests.total} MSTest-cases over ${METRICS.tests.classes} testklassen · Core-scope ${METRICS.tests.coreLine}% lijn-dekking · alle 9 OC's aantoonbaar voldaan · STRIDE zonder kritieke bevindingen.`,
        path: "evaluation/",
    },
    {
        id: "evaluatie-heatmap",
        chapter: "Evaluatie & Validatie",
        title: "Dekking in één oogopslag — heatmap",
        narration:
            "Elke OC heeft empirische dekking vanuit ten minste één deelvraag; de zwaarst gedekte criteria (OC-2, OC-4) weerspiegelen de kern van het probleem.",
        path: "traceability/?tab=heatmap",
    },
    {
        id: "validatie",
        chapter: "Validatie",
        title: "Risico's afgedekt door ontwerpcriteria",
        narration:
            "OC-1 t/m OC-9 mitigeren R3, R4, R7, R8 en R9. R6 blijft open (hardwaremeting in doelomgeving).",
        path: "traceability/?preset=oc-risk",
    },
    {
        id: "afsluiting",
        chapter: "Conclusie",
        title: "Resultaat in cijfers",
        narration:
            `${METRICS.research.oc} ontwerpcriteria · ${METRICS.research.requirements} requirements · ${METRICS.tests.total} MSTest-cases · alle OC's voldoen aan hun acceptatievoorwaarden.`,
        path: "#glance",
    },
];
