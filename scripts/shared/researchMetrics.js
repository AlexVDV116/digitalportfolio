/**
 * Centrale onderzoeksstatistieken — één plek voor alle cijfers.
 *
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  HOE TE UPDATEN BIJ EEN NIEUWE MVP-VERSIE OF NIEUW TESTREPORT     ║
 * ║                                                                    ║
 * ║  1. Coverage: vervang evaluation/data/CoverageReport/ door de      ║
 * ║     nieuwe ReportGenerator HTML-output. De evaluatiepagina parst   ║
 * ║     index.htm automatisch voor project-totalen en per-klasse data. ║
 * ║                                                                    ║
 * ║  2. Update ALLEEN de waarden hieronder die NIET uit het coverage   ║
 * ║     rapport gelezen kunnen worden (gemarkeerd met "HANDMATIG").    ║
 * ║     Dat zijn: mvp.*, tests.total, tests.unitClasses,              ║
 * ║     tests.integrationClasses, tests.coreLine, tests.coreBranch,   ║
 * ║     tests.mutationsKilled, tests.mutationsTotal.                   ║
 * ║                                                                    ║
 * ║  3. Pas research.* alleen aan als OC's, requirements of           ║
 * ║     constraints wijzigen.                                          ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Bronnen (peildatum 18-05-2026):
 *   - Software Test Document v2 (STD v2)
 *   - Cobertura/ReportGenerator Coverage Report (16-17 mei 2026)
 *   - Evaluatierapport MVP v7
 *   - OC_Traceability.csv, FR/NFR/Constraints CSVs, Risicoregister.csv
 *
 * Gebruik:
 *   import { METRICS } from "../scripts/shared/researchMetrics.js";
 *   document.querySelector('[data-metric="tests.total"]').textContent = METRICS.tests.total;
 */
export const METRICS = {

    // ── MVP-versie (HANDMATIG) ────────────────────────────────────────────
    mvp: {
        version: "v0.4",
        stdVersion: "STD v2",
        stdDate: "18 mei 2026",
        evalVersion: "v7",
        evalDate: "16 mei 2026",
        framework: ".NET Framework 4.8 · C# 7.3 · MSTest v2",
        coverageTool: "Coverlet (Cobertura XML) + ReportGenerator",
    },

    // ── Onderzoeksomvang (HANDMATIG — alleen wijzigen bij scope-aanpassing) ──
    research: {
        deelvragen: 5,
        oc: 9,
        requirements: 15,
        fr: 8,
        nfr: 5,
        constraints: 2,
    },

    // ── Tests & coverage ──────────────────────────────────────────────────
    // HANDMATIG: tests die niet uit het coverage report gelezen kunnen worden
    // (het report toont coverage, niet het aantal test-methoden of testklassen)
    tests: {
        total: 499,                    // HANDMATIG — STD v2 §1.3
        unitClasses: 29,               // HANDMATIG — STD v2 §4.1 (unit-testklassen)
        integrationClasses: 3,         // HANDMATIG — STD v2 §8.2
        totalTestClasses: 32,          // HANDMATIG — unitClasses + integrationClasses

        // Core-scope (HANDMATIG — berekend na uitsluiting WPF/XAML-code)
        // Bron: STD v2 §4.1 — unit-testbare code na uitsluiting View-laag
        coreLine: 93.9,
        coreBranch: 85,

        // Mutatievalidatie (HANDMATIG — STD v2 §7)
        mutationsKilled: 8,
        mutationsTotal: 8,

        // ── Project-totalen (AUTOMATISCH uit CoverageReport index.htm) ──
        // Onderstaande waarden dienen als fallback wanneer het coverage report
        // niet geladen kan worden. Bij een succesvol parse worden ze overschreven.
        // Bron fallback: ReportGenerator rapport 16-17 mei 2026
        projectLine: 62.7,
        projectBranch: 71.3,
        coveredLines: 1771,
        coverableLines: 2822,
        totalLines: 5869,
        coveredBranches: 934,
        totalBranches: 1309,
        totalProductionClasses: 42,
        coverageDate: "16-5-2026 – 17-5-2026",
        coverageParser: "MultiReport (4x Cobertura)",
    },

    // ── OC-naleving (Evaluatierapport v7) ─────────────────────────────────
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

    // ── STRIDE-analyse (Evaluatierapport v7 §8.2) ─────────────────────────
    stride: [
        { threat: "Spoofing",              mitigation: "URL-validatie; connection-status UI; auto-refresh",             residual: "Zeer laag" },
        { threat: "Tampering",             mitigation: "In-memory; typed JSON (Newtonsoft); SettingsProxy; read-only UI", residual: "Laag" },
        { threat: "Repudiation",           mitigation: "ExtensionLogger logt tijd + lengte (geen content); rol + tijdstip in bubble", residual: "Gedeeltelijk" },
        { threat: "Information Disclosure",mitigation: "URL-validatie; geen persistentie interactie-inhoud; ContextMode-ceiling; 500-regel cap; context-strip; reasoning niet in history", residual: "Laag" },
        { threat: "Denial of Service",     mitigation: "120s ChatRequestTimeout; 5s AvailabilityProbeTimeout; streaming cancellation; per-request CTS; async UI; top-level catch", residual: "Laag" },
        { threat: "Elevation of Privilege",mitigation: "LLM-server als apart OS-proces; geen FS-toegang; geen reflection/dynamic compilation", residual: "Zeer laag" },
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
        csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ_28qxuxu4ebus-99ggUEGbhcEByZfhsuJdlQGhBxt-W2CyW6BHKLf6YTnYDFe0Nh7mQFk1-jzkQnD/pub?output=csv",
        nameCol: 1,
        functionCol: 2,
        experienceCol: 3,
        frequencyCol: 4,
        usageTypesCol: 5,
        npsCol: 28,
        gradeCol: 29,
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
        yesNoCols: [
            { col: 24, label: "Blijven gebruiken in huidige vorm?" },
            { col: 25, label: "Lokale AI haalbaar en waardevol binnen Defensie?" },
        ],
    },
};
