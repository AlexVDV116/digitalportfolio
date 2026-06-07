/**
 * roadmapData.js — Centrale configuratie voor de ontwikkelroadmap.
 *
 * HOE TE UPDATEN:
 *   1. Nieuwe versie toevoegen: voeg een object toe aan VERSIONS[].
 *   2. Huidige versie wijzigen: pas `current: true` aan naar de juiste versie.
 *   3. Fase toevoegen: voeg een object toe aan PHASES[].
 *   4. Toekomstige items: voeg entries toe met status "future".
 *
 * Statussen: "done" | "current" | "next" | "future"
 */

export const PHASES = [
    {
        id: "research",
        label: "Realiseren",
        tag: "Design cycle — realisatie van de MVP",
        color: "phase1",
        description:
            "Het bouwen van de LocalLLM-MVP conform de geconsolideerde ontwerpset. Volgt op de verkennings- en ontwerpfase (DV1–DV4) en levert een werkend, toetsbaar artefact.",
    },
    {
        id: "evaluation",
        label: "Evalueren",
        tag: "Design cycle — evaluatie (DV5)",
        color: "phase2",
        description:
            "Statische analyse, beveiligingstoetsing en gebruikersfeedback. De MVP wordt getoetst aan de ontwerpcriteria, requirements en het praktijkgebruik (DV5).",
    },
    {
        id: "transfer",
        label: "Overdracht",
        tag: "Buiten onderzoeksscope",
        color: "phase3",
        description:
            "Uitrol en veldevaluatie binnen de afdeling. Valt buiten de design cycle van dit onderzoek en vormt de basis voor doorontwikkeling.",
    },
];

export const VERSIONS = [
    {
        id: "v01",
        version: "v0.1",
        phase: "research",
        period: "apr 2026",
        week: "week 0",
        status: "done",
        focus: "Conceptarchitectuur",
        validationGoal: "Haalbaarheid VSIX + lokale LLM-communicatie",
        researchQuestion: "Is VSIX + lokale LLM-communicatie technisch haalbaar?",
        researchPhase: "Realiseren — conceptarchitectuur",
        highlights: [
            "VSIX-opzet, OllamaClient, DialogPage",
            "ContextMode, Options-integratie",
            "Eerste unittest-suite, coverage",
        ],
        detail:
            "Ontstaan tijdens Deelvraag 4. Doel: vaststellen van de technische haalbaarheid van een VSIX-extensie die communiceert met een lokaal of intern gehost LLM via HTTP. De eerste OllamaClient, het ContextMode-plafondmodel en de Options-integratie via DialogPage zijn in deze versie opgezet. Validatie van MVVM + gelaagde scheiding Core/VSIX.",
        ocLinks: ["OC-4", "OC-7", "OC-8"],
        testCount: null,
    },
    {
        id: "v02",
        version: "v0.2",
        phase: "research",
        period: "mei 2026",
        week: "week 1",
        status: "done",
        focus: "Functionele MVP",
        validationGoal: "FR-1 t/m FR-8 realiseerbaar binnen OC-kader",
        researchQuestion: "Zijn de use cases realiseerbaar binnen het OC-kader?",
        researchPhase: "Realiseren — functionele MVP",
        highlights: [
            "LlmClientBase, OpenWebUI-backend",
            "Inline Apply (Suggestions API)",
            "Dynamic theming, scrollfixes",
        ],
        detail:
            "FR-1 t/m FR-8 voor het eerst volledig geadresseerd. Extractie van LlmClientBase en introductie van OpenWebUIClient met Bearer-tokenauthenticatie realiseerden OC-4 en OC-8 op een provider-neutraal niveau. De Apply-pipeline evolueerde van een modaal DiffPreviewWindow naar een inline diff-preview met undo-ondersteuning.",
        ocLinks: ["OC-1", "OC-2", "OC-4", "OC-5", "OC-8"],
        testCount: null,
    },
    {
        id: "v03",
        version: "v0.3",
        phase: "research",
        period: "mei 2026",
        week: "week 2",
        status: "done",
        focus: "Praktijkvalidatie",
        validationGoal: "Eerste praktijktoets in LITON-omgeving",
        researchQuestion: "Werkt de MVP in de doelomgeving en welke OC's moeten worden aangescherpt?",
        researchPhase: "Realiseren — eerste praktijktoets",
        highlights: [
            "DPAPI-fix, tokenpersistentie",
            "Documentatieaudit, README/licentie",
            "Gebruikersacceptatietest",
        ],
        detail:
            "Eerste versie die binnen de LITON-omgeving in de praktijk is getest. De DPAPI-encryptie voor het API-token werd verwijderd nadat deze drie bugs veroorzaakte. XML-documentatie geaudit en opgeschoond. De praktijktest leverde feedback op die de ontwerpcriteria verder aanscherpte en input gaf voor de DV5-evaluatiecriteria.",
        ocLinks: ["OC-4", "OC-5", "OC-6", "OC-7"],
        testCount: null,
    },
    {
        id: "v04",
        version: "v0.4",
        phase: "evaluation",
        period: "mei 2026",
        week: "week 3",
        status: "done",
        focus: "Evaluatiebasis DV5",
        validationGoal: "Statische analyse, STRIDE, OWASP LLM Top 10",
        researchQuestion: "Voldoet de MVP aan de ontwerpcriteria, beveiligingsnormen en gebruikersverwachtingen?",
        researchPhase: "Evalueren — evaluatiebasis (DV5)",
        highlights: [
            "SSE-streaming, reasoning mode",
            "FixedProtocolPrompt + AdditionalInstruction",
            "Testsuite 419 → 499 tests",
        ],
        detail:
            "Functionele en niet-functionele eisen uitgebreid met streaming responses (NFR-3), reasoning mode en configureerbare max-tokenpresets. Vaste protocolprompt gescheiden van configureerbare AdditionalInstruction (C14). Testsuite groeide van 419 naar 499 tests over 32 testklassen. Deze versie vormt de evaluatiebasis voor DV5.",
        ocLinks: ["OC-1", "OC-3", "OC-6", "OC-7", "OC-8", "OC-9"],
        testCount: 499,
    },
    {
        id: "v05",
        version: "v0.5",
        phase: "evaluation",
        period: "mei 2026",
        week: "week 4-5",
        status: "current",
        current: true,
        focus: "Feedbackverwerking",
        validationGoal: "Laatste onderzoeksiteratie voor overdracht",
        researchQuestion: "Houden de OC's stand na verwerking van praktijkfeedback?",
        researchPhase: "Evalueren — feedbackverwerking (DV5)",
        highlights: [
            "UX-verfijning, contexttransparantie",
            "Apply-volwassenheid",
            "Stabiliteitsverbeteringen OC-1...OC-9",
        ],
        detail:
            "Verwerkt de gebruikersfeedback uit de DV5-praktijkvalidatie. Focus op UX-verfijning (contexttransparantie, Apply-volwassenheid) en het aantonen dat OC-1 t/m OC-9 standhouden na iteratieve doorontwikkeling. Laatste versie die binnen het onderzoekstraject wordt opgeleverd.",
        ocLinks: ["OC-1", "OC-2", "OC-5", "OC-9"],
        testCount: null,
    },
    {
        id: "v10",
        version: "v1.0",
        phase: "transfer",
        period: "na onderzoek",
        week: null,
        status: "future",
        focus: "Afdelingsrelease",
        validationGoal: "Stabiele interne release na overdracht",
        researchQuestion: "Kan de MVP beheerbaar en onderhoudbaar worden overgedragen aan de afdeling?",
        researchPhase: "Overdracht — buiten onderzoeksscope",
        highlights: [
            "Beheerbaarheid, onderhoudbaarheid",
            "Security-hardening",
            "Doorontwikkeling MTM C1-C15",
        ],
        detail:
            "Buiten onderzoeksscope. Focus verschuift van validatie naar beheerbaarheid, onderhoudbaarheid, beveiligingshardening en schaalbaarheid. Open referentiearchitectuur-items uit de MTM (C1-C15) dienen als input voor de doorontwikkelplanning. SDD, MTM en ADR's vormen de overdrachtsdocumentatie.",
        ocLinks: [],
        testCount: null,
    },
];

/**
 * Scope boundary — between which two versions does the research scope end?
 * Used by the renderer to draw the dashed boundary line.
 */
export const SCOPE_BOUNDARY = { afterVersion: "v05", beforeVersion: "v10" };

/**
 * Research-methodology mapping table.
 * Displayed as a reference below the timeline.
 */
export const METHODOLOGY_TABLE = [
    { version: "v0.1", phase: "Realiseren",                question: "Is VSIX + lokale LLM-communicatie technisch haalbaar?" },
    { version: "v0.2", phase: "Realiseren",                question: "Zijn de use cases realiseerbaar binnen het OC-kader?" },
    { version: "v0.3", phase: "Realiseren",                question: "Werkt de MVP in de doelomgeving?" },
    { version: "v0.4", phase: "Evalueren (DV5)",           question: "Voldoet de MVP aan OC's, beveiligingsnormen en gebruikersverwachtingen?" },
    { version: "v0.5", phase: "Evalueren (DV5)",           question: "Houden de OC's stand na verwerking van praktijkfeedback?" },
    { version: "v1.0", phase: "Overdracht (buiten scope)", question: "Kan de MVP beheerbaar worden overgedragen aan de afdeling?" },
];
