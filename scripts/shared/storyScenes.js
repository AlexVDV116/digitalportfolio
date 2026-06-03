import { METRICS } from "./researchMetrics.js";

/**
 * Geleide verdedigings-flow door het portfolio (herontwerp o.b.v. eindverslag v5).
 *
 * Onderzoekslijn: Context → Hoofdvraag → DV1 … DV5 → Theorie → Ontwerpcriteria
 *   → Realisatie → Validatie → Roadmap → Beantwoording hoofdvraag.
 *
 * De `narration` is een PRESENTATOR-CUE, geen beschrijving van het scherm:
 * korte spreekpunten die de verteller begeleiden.
 *
 * Paden zijn relatief aan de portfolio-root.
 * Productie (GitHub Pages): `/digitalportfolio/<path>` · Lokaal: `/<path>`.
 */
export const STORY_SCENES = [
    {
        id: "context",
        chapter: "Probleem",
        title: "Context & probleemstelling",
        narration:
            "Open met het dilemma: Defensie ontwikkelt in een air-gapped netwerk, dus geen cloud-AI zoals Copilot. Schets de spanning tussen productiviteitswinst en beveiligingskaders — nog niet de oplossing.",
        path: "",
    },
    {
        id: "onderzoeksvraag",
        chapter: "Onderzoeksvraag",
        title: "Centrale onderzoeksvraag & deelvragen",
        narration:
            "Lees de centrale vraag voor: veilig én beheersbaar. Benoem dat vijf deelvragen de vraag stap voor stap uitwerken en dat elke deelvraag een eigen, aantoonbare uitkomst heeft.",
        path: "#glance",
    },
    {
        id: "dv1",
        chapter: "Deelvragen",
        title: "DV1 — Beveiligings- & architectuureisen",
        narration:
            "Documentanalyse (BIO, D/300). Kernpunt: lokale hosting alléén is niet genoeg — veilig vraagt óók contextbeperking, geen persistente opslag en gescheiden rollen. Dit draagt het woord ‘veilig’.",
        path: "deelvragen/#dv1",
    },
    {
        id: "dv2",
        chapter: "Deelvragen",
        title: "DV2 — Functionele & niet-functionele eisen",
        narration:
            "Interviews met ontwikkelaars. Kernpunt: waarde komt van aansluiting op de Visual Studio-workflow; de gebruiker houdt regie over in- en output. Hieruit volgen FR, NFR en de human-in-the-loop-eis.",
        path: "deelvragen/#dv2",
    },
    {
        id: "dv3",
        chapter: "Deelvragen",
        title: "DV3 — Ontwerpprincipes uit bestaande integraties",
        narration:
            "Vergelijkende analyse (Continue, BroPilot, LocalStudio). Kernpunt: principes niet één-op-één overnemen, maar filteren op de gesloten omgeving — expliciete context, aparte clientlaag, output als voorstel.",
        path: "deelvragen/#dv3",
    },
    {
        id: "dv4",
        chapter: "Deelvragen",
        title: "DV4 — Communicatiearchitectuur",
        narration:
            "Ontwerp + proof-of-concept. Kernpunt: de extensie is een gecontroleerde client; het model krijgt geen toegang tot de codebase. Dit draagt het woord ‘beheersbaar’ en leidt naar de architectuur.",
        path: "deelvragen/#dv4",
    },
    {
        id: "dv5",
        chapter: "Deelvragen",
        title: "DV5 — Evaluatie & validatie",
        narration:
            "Houd kort: de MVP is statisch én empirisch getoetst en voldoet binnen scope. De harde cijfers volgen zo bij de validatie — hier alleen de brug leggen.",
        path: "deelvragen/#dv5",
    },
    {
        id: "theorie",
        chapter: "Theorie",
        title: "Theoretisch kader — drie domeinen",
        narration:
            "Leg uit dat modelgedrag, beveiliging en IDE-integratie samenkomen; de overlap levert de spanningsvelden. Maak het punt: context is tegelijk een kwaliteits- én een privacykwestie.",
        path: "theory/",
    },
    {
        id: "synthese",
        chapter: "Theorie",
        title: "Synthese — van literatuur naar 9 ontwerpcriteria",
        narration:
            "Loop niet elke lijn na. Maak het punt: elk ontwerpcriterium is herleidbaar van literatuur via een synthese-inzicht. Dit consolideert DV1–DV4 tot de negen ontwerpcriteria.",
        path: "theory/#sankey",
    },
    {
        id: "ontwerpcriteria",
        chapter: "Ontwerpcriteria",
        title: "Ontwerpcriteria — het ontwerpkompas",
        narration:
            "Benadruk: negen OC vormen het toetsbare kompas. Gebruik OC-2 als voorbeeld van een volledige bewijs-keten — van eis via implementatie naar test. Elk OC heeft zo'n keten.",
        path: "oc/?id=OC-2",
    },
    {
        id: "realisatie",
        chapter: "Realisatie",
        title: "Realisatie — architectuur & MVP",
        narration:
            "Wijs op de twee diagrammen: gelaagde componenten en trust boundaries. Kernpunt: Core zonder VS-SDK, één gecontroleerd egress-pad, model geen toegang tot de codebase. Koppel modules terug aan OC's.",
        path: "realisatie/",
    },
    {
        id: "validatie-technisch",
        chapter: "Validatie",
        title: "Validatie — technisch & beveiliging",
        narration: `Noem de harde cijfers: alle 9 OC voldaan, ${METRICS.tests.total} tests / 0 failures, kernscope ~${METRICS.tests.coreLine}% dekking. Geen kritieke STRIDE/OWASP-bevindingen; restrisico's: prompt injection en overreliance.`,
        path: "evaluation/?tab=technical",
    },
    {
        id: "validatie-gat",
        chapter: "Validatie",
        title: "Validatie — praktijkevaluatie (GAT)",
        narration:
            "Praktijk: 5 ontwikkelaars, v0.3. Rapportcijfer 7,4 · aanbeveling 8,2 · human-in-the-loop 4,8. Benoem eerlijk het zwakste punt — contexttransparantie. NFR-2 in productie gehaald: p95 4,27 s.",
        path: "evaluation/?tab=gat",
    },
    {
        id: "heatmap",
        chapter: "Validatie",
        title: "Dekking in één oogopslag — heatmap",
        narration:
            "Kort: geen enkel ontwerpcriterium heeft een lege kolom — alles is herleidbaar naar de deelvragen. Wijs op de zwaarst onderbouwde criteria.",
        path: "traceability/?tab=heatmap",
    },
    {
        id: "roadmap",
        chapter: "Toekomst",
        title: "Roadmap — vooruitblik",
        narration:
            "Vooruitblik: v0.1 → v0.4 → overdracht. Huidige staat is v0.4; rechts van de scopegrens staan de aanbevelingen uit het verslag: contextmodel, releaseborging en langere praktijkevaluatie.",
        path: "roadmap/",
    },
    {
        id: "roadmap-methodologie",
        chapter: "Toekomst",
        title: "Roadmap — koppeling onderzoeksmethodiek",
        narration:
            "Kort: koppel de versies aan de design cycle van Wieringa — vroege versies op haalbaarheid, midden op validatie, later op verfijning en overdracht.",
        path: "roadmap/#methodSection",
    },
    {
        id: "conclusie",
        chapter: "Conclusie",
        title: "Beantwoording van de hoofdvraag",
        narration:
            "Sluit af op het antwoord: binnen scope kan een lokaal gehost LLM veilig én beheersbaar, mits context, opslag, communicatie en toepassing expliciet begrensd zijn. Rapportcijfer 7,4. Traceability is de rode draad.",
        path: "#glance",
    },
];
