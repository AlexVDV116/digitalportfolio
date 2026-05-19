/**
 * Curated traceability graph.
 *
 * Source: Master Traceability Matrix v4 (CSV's in ./data/).
 * Node and edge structure is hand-curated because the CSV fields use
 * free-text references (e.g. "FR-5, NFR-4") that don't survive automatic
 * parsing, and because the graph benefits from typed semantic edges
 * ("mitigates", "complies", "tested by") that the tables don't encode.
 */

export const NODE_TYPES = {
    dv: {
        id: "dv",
        label: "Deelvraag",
        color: "#3730a3",
        fill: "#eef2ff",
    },
    oc: {
        id: "oc",
        label: "Ontwerpcriterium",
        color: "#6d28d9",
        fill: "#f3e8ff",
    },
    fr: {
        id: "fr",
        label: "Functioneel req.",
        color: "#0369a1",
        fill: "#e0f2fe",
    },
    nfr: {
        id: "nfr",
        label: "Niet-functioneel",
        color: "#0d9488",
        fill: "#ccfbf1",
    },
    c: {
        id: "c",
        label: "Constraint",
        color: "#a16207",
        fill: "#fef9c3",
    },
    r: {
        id: "r",
        label: "Risico",
        color: "#b91c1c",
        fill: "#fee2e2",
    },
    norm: {
        id: "norm",
        label: "Norm",
        color: "#475569",
        fill: "#e2e8f0",
    },
    mvp: {
        id: "mvp",
        label: "MVP-module",
        color: "#1b7f3a",
        fill: "#eafff2",
    },
};

export const EDGE_TYPES = {
    derived: { label: "afgeleid van", color: "#94a3b8" },
    requires: { label: "vereist", color: "#94a3b8" },
    implements: { label: "gerealiseerd in", color: "#94a3b8" },
    complies: { label: "voldoet aan", color: "#94a3b8" },
    mitigates: { label: "mitigeert", color: "#dc2626" },
    tests: { label: "getest door", color: "#0ea5e9" },
};

/**
 * Status badge per node:
 *  ok       — volledig aangetoond
 *  partial  — gedeeltelijk / open
 *  no       — niet gerealiseerd
 *  todo     — geplande activiteit
 *  na       — niet van toepassing / contextueel
 */
export const NODES = [
    // ===== Deelvragen =====
    {
        id: "DV1",
        type: "dv",
        label: "DV1",
        name: "DV1 — Beveiligings- & architectuureisen",
        desc: "Documentanalyse van D/300, BIO, DBB en OWASP LLM Top 10. Levert OC-4, OC-5, OC-6.",
        status: "ok",
    },
    {
        id: "DV2",
        type: "dv",
        label: "DV2",
        name: "DV2 — Requirements (FR/NFR) via stakeholderinterviews",
        desc: "Functionele en niet-functionele eisen vanuit ontwikkelaars en opdrachtgever. Levert FR-1..8 en NFR-1..5.",
        status: "ok",
    },
    {
        id: "DV3",
        type: "dv",
        label: "DV3",
        name: "DV3 — Ontwerpprincipes & vergelijkende analyse LLM-integraties",
        desc: "Analyse bestaande IDE-LLM-integraties. Levert ontwerpprincipes voor context, stochasticiteit en grounding.",
        status: "ok",
    },
    {
        id: "DV4",
        type: "dv",
        label: "DV4",
        name: "DV4 — Communicatiearchitectuur IDE ↔ LLM",
        desc: "API-contracten, contextopbouw, isolatie en supported extensibility. Levert OC-6, OC-7, OC-8.",
        status: "ok",
    },
    {
        id: "DV5",
        type: "dv",
        label: "DV5",
        name: "DV5 — Evaluatie & validatie van de MVP",
        desc: "Functionele tests, gebruikersevaluatie, security-inspectie en empirische beantwoording centrale vraag.",
        status: "ok",
    },

    // ===== Ontwerpcriteria =====
    {
        id: "OC-1",
        type: "oc",
        label: "OC-1",
        name: "Human-in-the-loop — geen auto-apply",
        desc: "LLM-output is altijd suggestie/preview; nooit automatisch toegepast op de codebase.",
        status: "ok",
    },
    {
        id: "OC-2",
        type: "oc",
        label: "OC-2",
        name: "Contextbeperking en expliciete selectie",
        desc: "ContextMode-ceiling (Off/SelectionOnly/IncludeMethod/IncludeFile); default SelectionOnly.",
        status: "ok",
    },
    {
        id: "OC-3",
        type: "oc",
        label: "OC-3",
        name: "Beheersing van modelstochasticiteit",
        desc: "Temperature=0.2, TopP=0.9, MaxTokensPreset (default Extended=4096) vastgezet; pinning-tests bewaken drift.",
        status: "ok",
    },
    {
        id: "OC-4",
        type: "oc",
        label: "OC-4",
        name: "Volledig offline verwerking",
        desc: "LlmClientBase URL-syntaxvalidatie (IsValidHttpUrl); geen externe HTTP-calls; air-gap als architectuurprincipe.",
        status: "ok",
    },
    {
        id: "OC-5",
        type: "oc",
        label: "OC-5",
        name: "Geen persistente opslag van gevoelige data",
        desc: "In-memory history; reasoning/cancelled/incomplete niet in history; logger zonder content; config via DialogPage.",
        status: "ok",
    },
    {
        id: "OC-6",
        type: "oc",
        label: "OC-6",
        name: "Gescheiden verantwoordelijkheden / taakscheiding",
        desc: "Core zonder VS-SDK refs, LLM-server als apart OS-proces, SettingsProxy als trust-grens.",
        status: "ok",
    },
    {
        id: "OC-7",
        type: "oc",
        label: "OC-7",
        name: "Ondersteunde extensiemechanismen",
        desc: "AsyncPackage + ToolWindow + DialogPage + .vsct; geen private API's.",
        status: "ok",
    },
    {
        id: "OC-8",
        type: "oc",
        label: "OC-8",
        name: "Foutbestendige communicatie",
        desc: "Typed exceptions, timeouts, linked CTS, SSE-foutpaden, streaming cancellation, graceful UI; geen freeze of crash bij faalpad.",
        status: "ok",
    },
    {
        id: "OC-9",
        type: "oc",
        label: "OC-9",
        name: "Transparante interactie",
        desc: "Context-strip, status-dot, Markdown-rendering, read-only settings-mirror, streaming-statussen, reasoning-expander.",
        status: "ok",
    },

    // ===== Functionele requirements =====
    {
        id: "FR-1",
        type: "fr",
        label: "FR-1",
        name: "Code genereren op basis van prompt",
        priority: "MUST",
        status: "ok",
    },
    {
        id: "FR-2",
        type: "fr",
        label: "FR-2",
        name: "Code uitleggen",
        priority: "MUST",
        status: "ok",
    },
    {
        id: "FR-3",
        type: "fr",
        label: "FR-3",
        name: "Refactorsuggesties",
        priority: "MUST",
        status: "ok",
    },
    {
        id: "FR-4",
        type: "fr",
        label: "FR-4",
        name: "Contextgebonden interactie",
        priority: "MUST",
        status: "ok",
    },
    {
        id: "FR-5",
        type: "fr",
        label: "FR-5",
        name: "Output als voorstel (geen auto-apply)",
        priority: "MUST",
        status: "ok",
    },
    {
        id: "FR-6",
        type: "fr",
        label: "FR-6",
        name: "Interactieve dialoog (multi-turn)",
        priority: "SHOULD",
        status: "ok",
    },
    {
        id: "FR-7",
        type: "fr",
        label: "FR-7",
        name: "Inzicht in context (context-strip)",
        priority: "SHOULD",
        status: "ok",
    },
    {
        id: "FR-8",
        type: "fr",
        label: "FR-8",
        name: "Configuratie contextgebruik (UI-keuze)",
        priority: "SHOULD",
        status: "ok",
    },

    // ===== Niet-functionele requirements =====
    {
        id: "NFR-1",
        type: "nfr",
        label: "NFR-1",
        name: "Stabiliteit IDE",
        priority: "MUST",
        status: "ok",
    },
    {
        id: "NFR-2",
        type: "nfr",
        label: "NFR-2",
        name: "Responstijd <1s feedback / <5s output",
        priority: "MUST",
        status: "partial",
        desc: "Feedback <1s via typing-indicator. Output-meting (p50/p95) gepland in DV5-D5.",
    },
    {
        id: "NFR-3",
        type: "nfr",
        label: "NFR-3",
        name: "Streaming / tussenstatus",
        priority: "SHOULD",
        status: "ok",
        desc: "Gerealiseerd in v0.4: SSE-streaming via StreamChatAsync; progressieve tokenweergave; statuslabels; legacy non-streaming blijft default.",
    },
    {
        id: "NFR-4",
        type: "nfr",
        label: "NFR-4",
        name: "Robuuste foutafhandeling",
        priority: "MUST",
        status: "ok",
    },
    {
        id: "NFR-5",
        type: "nfr",
        label: "NFR-5",
        name: "Inzicht in interactiegeschiedenis",
        priority: "COULD",
        status: "ok",
    },

    // ===== Constraints =====
    {
        id: "C-1",
        type: "c",
        label: "C-1",
        name: "Volledig lokale verwerking",
        priority: "MUST",
        status: "ok",
    },
    {
        id: "C-2",
        type: "c",
        label: "C-2",
        name: "Air-gapped omgeving",
        priority: "MUST",
        status: "ok",
    },

    // ===== Risico's =====
    {
        id: "R1",
        type: "r",
        label: "R1",
        name: "Vertraging toegang air-gapped omgeving",
        status: "na",
        desc: "Planning: ontwikkeling op unclassified replica; integratietest op target.",
    },
    {
        id: "R2",
        type: "r",
        label: "R2",
        name: "Kwaliteit literatuursynthese",
        status: "na",
    },
    {
        id: "R3",
        type: "r",
        label: "R3",
        name: "OC onvoldoende toetsbaar",
        status: "ok",
        desc: "Gemitigeerd: AppDefaults + pinning-tests; 499 MSTest-cases over 32 testklassen borgen OC-3.",
    },
    {
        id: "R4",
        type: "r",
        label: "R4",
        name: "Beperkingen VS SDK",
        status: "ok",
        desc: "Gemitigeerd: alleen standaard AsyncPackage + ToolWindowPane + DialogPage.",
    },
    {
        id: "R5",
        type: "r",
        label: "R5",
        name: "Beschikbaarheid testers",
        status: "na",
    },
    {
        id: "R6",
        type: "r",
        label: "R6",
        name: "Hardware-performance",
        status: "partial",
        desc: "Open: vereist meting op klantenhardware (P2 in DV5-D5).",
    },
    {
        id: "R7",
        type: "r",
        label: "R7",
        name: "Onkritisch overnemen van AI-output",
        status: "ok",
        desc: "Gemitigeerd via OC-1 + banner + SessionDisclaimer (B3).",
    },
    {
        id: "R8",
        type: "r",
        label: "R8",
        name: "Onbedoelde verwerking gevoelige info",
        status: "ok",
        desc: "Gemitigeerd via OC-2/4/5: ContextMode-ceiling, URL-syntaxvalidatie, netwerksegmentatie, geen persistentie interactie-inhoud.",
    },
    {
        id: "R9",
        type: "r",
        label: "R9",
        name: "Theorie–artefact koppeling niet traceerbaar",
        status: "ok",
        desc: "Gemitigeerd via Master Traceability Matrix v4 (deze visualisatie).",
    },

    // ===== Normatieve kaders (cluster-niveau) =====
    {
        id: "N-D300",
        type: "norm",
        label: "D/300",
        name: "Defensie D/300-serie (D/301 BIO, D/302 toetsbaarheid, D/303 transparantie, D/304 netwerkscheiding)",
        status: "ok",
    },
    {
        id: "N-BIO",
        type: "norm",
        label: "BIO",
        name: "Baseline Informatiebeveiliging Overheid (6.1.2, 9.4, 10.1, 12.4, 13.1)",
        status: "ok",
    },
    {
        id: "N-OWASP",
        type: "norm",
        label: "OWASP LLM",
        name: "OWASP Top 10 for LLM Applications (LLM01-LLM10)",
        status: "ok",
    },
    {
        id: "N-DBB",
        type: "norm",
        label: "DBB",
        name: "Defensie Beleid Beveiliging (BB-V)",
        status: "ok",
    },

    // ===== MVP-modules (kerncomponenten) =====
    {
        id: "M-LlmBase",
        type: "mvp",
        label: "LlmClientBase",
        name: "LlmClientBase.cs — abstracte basisklasse met URL-validatie (IsValidHttpUrl) en foutcontract",
        status: "ok",
        desc: "ILlmClient → LlmClientBase: definieert CreateBaseUri, SendChatAsync/StreamChatAsync-contract. Gedeeld door OpenAICompatibleClient en OpenWebUIClient.",
    },
    {
        id: "M-OpenAI",
        type: "mvp",
        label: "OpenAICompatibleClient",
        name: "OpenAICompatibleClient.cs — OpenAI-compatible backend via /v1/chat/completions met typed exceptions",
        status: "ok",
        desc: "Implementeert ILlmClient via LlmClientBase; 18 + 19 + 10 + 33 = 80 tests valideren URL, timeout, error-mapping, SSE-streaming.",
    },
    {
        id: "M-OpenWebUI",
        type: "mvp",
        label: "OpenWebUIClient",
        name: "OpenWebUIClient.cs — Open WebUI-backend via OpenAI-compatible chat-completions",
        status: "ok",
        desc: "Implementeert ILlmClient via LlmClientBase; 22 OpenWebUIClientTests valideren URL-validatie en response-mapping.",
    },
    {
        id: "M-LlmSelector",
        type: "mvp",
        label: "LlmClientSelector",
        name: "LlmClientSelector.cs — runtime backend-selectie op basis van ConnectionType",
        status: "ok",
        desc: "Factory die op basis van geconfigureerde ConnectionType de juiste ILlmClient-implementatie retourneert.",
    },
    {
        id: "M-Prompt",
        type: "mvp",
        label: "PromptOrchestrator",
        name: "PromptOrchestrator.cs — message-building, in-memory _history, label-injectie",
        status: "ok",
    },
    {
        id: "M-Chat",
        type: "mvp",
        label: "ChatWindowViewModel",
        name: "ChatWindowViewModel.cs — MVVM, banner, ClearHistory, async commands",
        status: "ok",
    },
    {
        id: "M-Ctx",
        type: "mvp",
        label: "ContextProvider",
        name: "ContextProvider.cs — ContextMode-ceiling, 500-regel cap, methode-detectie",
        status: "ok",
    },
    {
        id: "M-Opts",
        type: "mvp",
        label: "LocalLLMOptionsPage",
        name: "LocalLLMOptionsPage.cs — DialogPage met Mode/URL/Model/ConnectionType/ApiToken/Streaming/Reasoning/MaxTokensPreset",
        status: "ok",
    },
    {
        id: "M-Defaults",
        type: "mvp",
        label: "AppDefaults",
        name: "AppDefaults.cs — single source of truth voor URL, model, timeouts, parameters",
        status: "ok",
    },
    {
        id: "M-Pkg",
        type: "mvp",
        label: "LocalLLMPackage",
        name: "LocalLLMPackage.cs + .vsct — AsyncPackage, ProvideMenuResource, ProvideToolWindow",
        status: "ok",
    },
];

/**
 * Edges are tuples: [source, target, edgeType].
 * Direction expresses semantic flow (DV → OC → FR → MVP, OC → Risico = "mitigates").
 */
export const EDGES = [
    // ===== DV → OC (theorie/methode → criterium) =====
    ["DV1", "OC-4", "derived"],
    ["DV1", "OC-5", "derived"],
    ["DV1", "OC-6", "derived"],
    ["DV2", "OC-2", "derived"],
    ["DV3", "OC-2", "derived"],
    ["DV3", "OC-3", "derived"],
    ["DV4", "OC-6", "derived"],
    ["DV4", "OC-7", "derived"],
    ["DV4", "OC-8", "derived"],
    ["DV5", "OC-1", "derived"],
    ["DV5", "OC-9", "derived"],

    // ===== DV2 levert FR/NFR =====
    ["DV2", "FR-1", "derived"],
    ["DV2", "FR-2", "derived"],
    ["DV2", "FR-3", "derived"],
    ["DV2", "FR-4", "derived"],
    ["DV2", "FR-5", "derived"],
    ["DV2", "FR-6", "derived"],
    ["DV2", "FR-7", "derived"],
    ["DV2", "FR-8", "derived"],
    ["DV2", "NFR-1", "derived"],
    ["DV2", "NFR-2", "derived"],
    ["DV2", "NFR-3", "derived"],
    ["DV2", "NFR-4", "derived"],
    ["DV2", "NFR-5", "derived"],

    // ===== OC → FR (criterium vereist requirement) =====
    ["OC-1", "FR-5", "requires"],
    ["OC-1", "FR-1", "requires"],
    ["OC-1", "FR-3", "requires"],
    ["OC-2", "FR-4", "requires"],
    ["OC-2", "FR-7", "requires"],
    ["OC-2", "FR-8", "requires"],
    ["OC-2", "FR-2", "requires"],
    ["OC-2", "FR-3", "requires"],
    ["OC-8", "FR-1", "requires"],
    ["OC-9", "FR-2", "requires"],
    ["OC-9", "FR-4", "requires"],
    ["OC-9", "FR-6", "requires"],
    ["OC-9", "FR-7", "requires"],

    // ===== OC → NFR =====
    ["OC-1", "NFR-4", "requires"],
    ["OC-3", "NFR-2", "requires"],
    ["OC-4", "NFR-1", "requires"],
    ["OC-5", "NFR-5", "requires"],
    ["OC-6", "NFR-1", "requires"],
    ["OC-7", "NFR-1", "requires"],
    ["OC-8", "NFR-4", "requires"],
    ["OC-9", "NFR-3", "requires"],
    ["OC-9", "NFR-5", "requires"],

    // ===== OC → Constraint =====
    ["OC-4", "C-1", "requires"],
    ["OC-4", "C-2", "requires"],
    ["OC-6", "C-1", "requires"],

    // ===== OC → Norm (voldoet aan) =====
    ["OC-1", "N-D300", "complies"],
    ["OC-2", "N-BIO", "complies"],
    ["OC-3", "N-D300", "complies"],
    ["OC-4", "N-D300", "complies"],
    ["OC-4", "N-BIO", "complies"],
    ["OC-5", "N-BIO", "complies"],
    ["OC-6", "N-BIO", "complies"],
    ["OC-7", "N-DBB", "complies"],
    ["OC-8", "N-BIO", "complies"],
    ["OC-9", "N-D300", "complies"],

    // OWASP LLM Top 10 dekking
    ["OC-1", "N-OWASP", "complies"],
    ["OC-2", "N-OWASP", "complies"],
    ["OC-4", "N-OWASP", "complies"],
    ["OC-5", "N-OWASP", "complies"],
    ["OC-8", "N-OWASP", "complies"],

    // ===== OC → Risico (mitigeert) =====
    ["OC-1", "R7", "mitigates"],
    ["OC-2", "R8", "mitigates"],
    ["OC-3", "R3", "mitigates"],
    ["OC-4", "R8", "mitigates"],
    ["OC-5", "R8", "mitigates"],
    ["OC-7", "R4", "mitigates"],

    // R9 (theorie–artefact koppeling) wordt gemitigeerd door alle OCs via traceability matrix
    ["OC-1", "R9", "mitigates"],
    ["OC-9", "R9", "mitigates"],

    // ===== OC / requirements → MVP-modules (gerealiseerd in) =====
    ["OC-1", "M-Chat", "implements"],
    ["OC-2", "M-Ctx", "implements"],
    ["OC-2", "M-Opts", "implements"],
    ["OC-3", "M-Defaults", "implements"],
    ["OC-3", "M-OpenAI", "implements"],
    ["OC-4", "M-LlmBase", "implements"],
    ["OC-4", "M-OpenAI", "implements"],
    ["OC-4", "M-OpenWebUI", "implements"],
    ["OC-4", "M-Defaults", "implements"],
    ["OC-5", "M-Prompt", "implements"],
    ["OC-5", "M-Opts", "implements"],
    ["OC-6", "M-Ctx", "implements"],
    ["OC-6", "M-Pkg", "implements"],
    ["OC-6", "M-LlmSelector", "implements"],
    ["OC-7", "M-Pkg", "implements"],
    ["OC-8", "M-LlmBase", "implements"],
    ["OC-8", "M-OpenAI", "implements"],
    ["OC-8", "M-OpenWebUI", "implements"],
    ["OC-8", "M-Chat", "implements"],
    ["OC-9", "M-Chat", "implements"],

    // FR / NFR → MVP-modules (getest door)
    ["FR-1", "M-Prompt", "tests"],
    ["FR-1", "M-LlmBase", "tests"],
    ["FR-1", "M-OpenAI", "tests"],
    ["FR-1", "M-OpenWebUI", "tests"],
    ["FR-2", "M-Prompt", "tests"],
    ["FR-3", "M-Prompt", "tests"],
    ["FR-4", "M-Ctx", "tests"],
    ["FR-5", "M-Chat", "tests"],
    ["FR-6", "M-Prompt", "tests"],
    ["FR-6", "M-Chat", "tests"],
    ["FR-7", "M-Ctx", "tests"],
    ["FR-8", "M-Opts", "tests"],
    ["NFR-1", "M-Pkg", "tests"],
    ["NFR-1", "M-Chat", "tests"],
    ["NFR-4", "M-LlmBase", "tests"],
    ["NFR-4", "M-OpenAI", "tests"],
    ["NFR-4", "M-OpenWebUI", "tests"],
    ["NFR-5", "M-Chat", "tests"],

    // ===== Constraint → Norm =====
    ["C-1", "N-BIO", "complies"],
    ["C-2", "N-D300", "complies"],
];

/**
 * Saved camera presets for the defense.
 * Each preset:
 *  - focus  : node id to anchor + zoom on (optional)
 *  - types  : set of node types to keep visible (others dimmed)
 *  - title  : short label on the button
 *  - desc   : short tooltip / what story does this tell
 */
export const PRESETS = [
    {
        id: "all",
        title: "Volledig",
        desc: "Toon de complete traceability — alle nodes en relaties.",
        types: ["dv", "oc", "fr", "nfr", "c", "r", "norm", "mvp"],
    },
    {
        id: "dv-oc",
        title: "DV → OC",
        desc: "Theoretische herleidbaarheid: van deelvragen naar ontwerpcriteria.",
        types: ["dv", "oc"],
    },
    {
        id: "oc-mvp",
        title: "OC → MVP",
        desc: "Realisatie: hoe elke OC in concrete code is gerealiseerd.",
        types: ["oc", "mvp"],
    },
    {
        id: "oc-risk",
        title: "OC mitigeert risico",
        desc: "Welke OC welk risico afdekt (mitigates-edges, R7/R8/R3/R4).",
        types: ["oc", "r"],
    },
    {
        id: "must",
        title: "MUST coverage",
        desc: "Alleen MUST-prioriteit FR/NFR/Constraints met hun OC's en modules.",
        types: ["oc", "fr", "nfr", "c", "mvp"],
        priorityFilter: ["MUST"],
    },
    {
        id: "norms",
        title: "Normatief kader",
        desc: "Welke OC's voldoen aan D/300, BIO, OWASP LLM, DBB.",
        types: ["oc", "norm"],
    },
];
