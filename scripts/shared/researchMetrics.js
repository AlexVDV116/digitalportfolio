/**
 * Centrale onderzoeksstatistieken — één plek voor alle cijfers.
 *
 * Bronnen (peildatum 11-05-2026):
 *   - Test Coverage Report v5 (Bijlage XI)
 *   - Evaluatierapport MVP v6 (Bijlage IX)
 *   - OC_Traceability.csv, FR/NFR/Constraints CSVs, Risicoregister.csv
 *
 * Gebruik:
 *   import { METRICS } from "../scripts/shared/researchMetrics.js";
 *   document.querySelector('[data-metric="tests.total"]').textContent = METRICS.tests.total;
 */
export const METRICS = {

    // ── MVP-versie ────────────────────────────────────────────────────────
    mvp: {
        version: "v0.3",
        evalVersion: "v6",
        evalDate: "11 mei 2026",
        framework: ".NET Framework 4.8 · C# 7.3 · MSTest 4.2.1",
    },

    // ── Onderzoeksomvang ──────────────────────────────────────────────────
    research: {
        deelvragen: 5,
        oc: 9,
        requirements: 15,
        fr: 8,
        nfr: 5,
        constraints: 2,
    },

    // ── Tests & coverage (VS2022 Enterprise, 11-05-2026) ──────────────────
    tests: {
        total: 247,
        classes: 20,
        // Project-totaal (volledige solution, incl. View-laag)
        projectLine: 38.91,
        projectBlock: 41.98,
        totalLines: 1663,
        coveredLines: 647,
        totalBlocks: 2382,
        coveredBlocks: 1000,
        // Core-scope (unit-testbare klassen, excl. View-laag / async state-machines)
        coreLine: 74,
        coreBlock: 77,
        coreLines: 879,
        // Klassenverdeling
        classesAt100: 18,
        classesAt0: 15,
        totalProductionClasses: 51,
        // Per-klasse telling (TestMethod-instances + DataRow-expansies)
        classCounts: [
            { name: "AppDefaultsTests",                   methods: 16, dataRows:  0, total: 16 },
            { name: "ApplyTargetTests",                   methods: 14, dataRows:  0, total: 14 },
            { name: "AsyncRelayCommandTests",             methods: 10, dataRows:  0, total: 10 },
            { name: "ChatMessageDisplayTests",            methods: 11, dataRows:  0, total: 11 },
            { name: "ChatMessageTests",                   methods:  6, dataRows:  0, total:  6 },
            { name: "ChatWindowViewModelApplyTests",      methods: 11, dataRows:  0, total: 11 },
            { name: "ChatWindowViewModelTests",           methods: 18, dataRows:  0, total: 18 },
            { name: "ContextSelectionTests",              methods: 10, dataRows:  0, total: 10 },
            { name: "EllipsisDetectorTests",              methods:  8, dataRows:  0, total:  8 },
            { name: "InMemoryContextSettingsTests",       methods: 16, dataRows:  0, total: 16 },
            { name: "IndentationAdjusterTests",           methods: 10, dataRows:  0, total: 10 },
            { name: "LanguageMatcherTests",               methods:  9, dataRows:  0, total:  9 },
            { name: "LineDiffTests",                      methods: 13, dataRows:  0, total: 13 },
            { name: "OllamaClientArgumentTests",          methods: 10, dataRows:  9, total: 19 },
            { name: "OllamaClientSendChatTests",          methods: 10, dataRows:  0, total: 10 },
            { name: "OllamaClientTests",                  methods:  8, dataRows: 10, total: 18 },
            { name: "OpenWebUIClientTests",               methods: 22, dataRows:  0, total: 22 },
            { name: "PromptOrchestratorTests",            methods: 12, dataRows:  0, total: 12 },
            { name: "PromptOrchestratorTruncationTests",  methods:  7, dataRows:  0, total:  7 },
            { name: "RelayCommandTests",                  methods:  7, dataRows:  0, total:  7 },
        ],
    },

    // ── OC-naleving (Evaluatierapport v6) ─────────────────────────────────
    ocStatus: [
        { id: "OC-1", label: "Human-in-the-loop",              status: "Ja" },
        { id: "OC-2", label: "Contextbeperking",               status: "Ja" },
        { id: "OC-3", label: "Modelstochasticiteit",           status: "Ja" },
        { id: "OC-4", label: "Offline verwerking",             status: "Ja" },
        { id: "OC-5", label: "Geen persistente opslag",        status: "Ja" },
        { id: "OC-6", label: "Scheiding verantwoordelijkheden",status: "Ja" },
        { id: "OC-7", label: "Ondersteunde extensiemechanismen",status: "Ja" },
        { id: "OC-8", label: "Foutbestendige communicatie",    status: "Ja" },
        { id: "OC-9", label: "Transparante interactie",        status: "Ja" },
    ],

    // ── STRIDE-analyse (Evaluatierapport v6 §5.2) ─────────────────────────
    stride: [
        { threat: "Spoofing",              mitigation: "URL-validatie; connection-status UI; auto-refresh",             residual: "Laag" },
        { threat: "Tampering",             mitigation: "In-memory; typed JSON; SettingsProxy; read-only UI",             residual: "Zeer laag" },
        { threat: "Repudiation",           mitigation: "ExtensionLogger logt tijd + lengte (geen content); rol + tijdstip in bubble", residual: "Matig" },
        { threat: "Information Disclosure",mitigation: "URL-validatie; geen persistence; ContextMode-ceiling; 500-regel cap; context-strip; no-op storage", residual: "Laag" },
        { threat: "Denial of Service",     mitigation: "120s ChatRequestTimeout; 5s AvailabilityProbeTimeout; linked CTS; async UI; top-level catch", residual: "Zeer laag" },
        { threat: "Elevation of Privilege",mitigation: "Ollama als apart OS-proces; geen FS-toegang; geen reflection/dynamic compilation", residual: "Zeer laag" },
    ],

    // ── Risicoregister (Risicoregister.csv) ───────────────────────────────
    risks: [
        { id: "R1", label: "Vertraging toegang air-gapped omgeving", scope: "Planning",        status: "n.v.t." },
        { id: "R2", label: "Kwaliteit literatuursynthese",           scope: "Wetenschap",      status: "n.v.t." },
        { id: "R3", label: "OC onvoldoende toetsbaar",               scope: "Evaluatie",       status: "Gemitigeerd" },
        { id: "R4", label: "Beperkingen VS SDK",                     scope: "Technisch",       status: "Gemitigeerd" },
        { id: "R5", label: "Beschikbaarheid testers",                scope: "Planning",        status: "n.v.t." },
        { id: "R6", label: "Hardware-performance",                   scope: "Gebruikservaring",status: "Open" },
        { id: "R7", label: "Onkritisch overnemen van AI-output",     scope: "Kwaliteit",       status: "Gemitigeerd" },
        { id: "R8", label: "Onbedoelde verwerking gevoelige info",   scope: "Vertrouwelijkheid",status: "Gemitigeerd" },
        { id: "R9", label: "Theorie–artefact koppeling niet traceerbaar", scope: "Wetenschap", status: "Gemitigeerd" },
    ],

    // ── Gebruikersacceptatietest — vragenstructuur (Google Form) ──────────
    gat: {
        // Live CSV-export van het gepubliceerde Google Forms-spreadsheet
        csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_28qxuxu4ebus-99ggUEGbhcEByZfhsuJdlQGhBxt-W2CyW6BHKLf6YTnYDFe0Nh7mQFk1-jzkQnD/pub?output=csv",
        // Kolom-indices in de CSV-export (0-gebaseerd)
        nameCol: 1,
        functionCol: 2,
        experienceCol: 3,
        frequencyCol: 4,
        usageTypesCol: 5,
        npsCol: 28,
        gradeCol: 29,
        // Likert-vragen (schaal 1–5), kolom 6–16
        likert: [
            { col: 6,  short: "Stabiliteit",      label: "De extensie voelt stabiel tijdens gebruik." },
            { col: 7,  short: "Workflow-fit",      label: "De extensie past goed binnen mijn normale ontwikkelworkflow." },
            { col: 8,  short: "Model-kwaliteit",   label: "De antwoorden van het model zijn meestal bruikbaar." },
            { col: 9,  short: "Context-UX",        label: "De contextwerking (selection / method / full file) werkt begrijpelijk." },
            { col: 10, short: "Transparantie",     label: "Het is duidelijk welke informatie naar het model wordt verzonden." },
            { col: 11, short: "Apply-controle",    label: "De Apply-functionaliteit geeft voldoende controle over wijzigingen." },
            { col: 12, short: "Diff-preview",      label: "De inline diff-preview maakt het beoordelen van wijzigingen makkelijker." },
            { col: 13, short: "Human-in-the-loop", label: "De human-in-the-loop aanpak voelt veilig en beheersbaar." },
            { col: 14, short: "Performance",       label: "De performance/reactiesnelheid is voldoende voor praktisch gebruik." },
            { col: 15, short: "Defensie-potentie", label: "Ik zie potentie voor deze vorm van AI-ondersteuning binnen Defensie." },
            { col: 16, short: "Hergebruik",        label: "Ik zou deze extensie opnieuw gebruiken indien verder doorontwikkeld." },
        ],
        // Open vragen
        openCols: [
            { col: 17, label: "Meest nuttige toepassingen" },
            { col: 18, label: "Situaties minder goed" },
            { col: 19, label: "Incorrect / onduidelijk model-output" },
            { col: 20, label: "Ontbrekende functionaliteit" },
            { col: 21, label: "Balans gebruiksgemak vs. controle" },
            { col: 22, label: "Verwarrende onderdelen" },
            { col: 23, label: "Suggesties voor v1.0" },
            { col: 26, label: "Grootste meerwaarde" },
            { col: 27, label: "Grootste risico / aandachtspunt" },
            { col: 30, label: "Overige opmerkingen" },
        ],
        // Ja/nee vragen
        yesNoCols: [
            { col: 24, label: "Blijven gebruiken in huidige vorm?" },
            { col: 25, label: "Lokale AI haalbaar en waardevol binnen Defensie?" },
        ],
    },
};
