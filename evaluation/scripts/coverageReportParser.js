/**
 * coverageReportParser.js — Parst de ReportGenerator index.htm automatisch.
 *
 * Leest het Cobertura/ReportGenerator HTML-rapport (index.htm) uit
 * evaluation/data/CoverageReport/ en extraheert:
 *   - Samenvattingsstatistieken (lines, branches, classes, dates)
 *   - Per-klasse coverage (line%, branch%, covered/coverable/total)
 *
 * HOE TE UPDATEN:
 *   1. Genereer een nieuw ReportGenerator HTML-rapport.
 *   2. Vervang de inhoud van evaluation/data/CoverageReport/ door de nieuwe output.
 *   3. Het portfolio leest de nieuwe cijfers automatisch bij laden.
 *
 * Fallback: als het rapport niet geladen kan worden, retourneert parseCoverageReport()
 * null, zodat de aanroepende code kan terugvallen op de handmatige config in researchMetrics.js.
 */

const REPORT_PATH = "./data/CoverageReport/index.htm";

/**
 * Fetcht en parst het coverage rapport.
 * @returns {Promise<CoverageData|null>} Geparsede data of null bij fout.
 *
 * @typedef {Object} CoverageData
 * @property {CoverageSummary} summary
 * @property {CoverageClass[]} classes
 *
 * @typedef {Object} CoverageSummary
 * @property {string} parser         - bijv. "MultiReport (4x Cobertura)"
 * @property {number} assemblyCount
 * @property {number} classCount
 * @property {number} fileCount
 * @property {string} coverageDate
 * @property {number} coveredLines
 * @property {number} uncoveredLines
 * @property {number} coverableLines
 * @property {number} totalLines
 * @property {number} linePct        - bijv. 62.7
 * @property {number} coveredBranches
 * @property {number} totalBranches
 * @property {number} branchPct      - bijv. 71.3
 *
 * @typedef {Object} CoverageClass
 * @property {string} fullName       - bijv. "LocalLLM.Services.PromptOrchestrator"
 * @property {string} shortName      - bijv. "PromptOrchestrator"
 * @property {number} coveredLines
 * @property {number} uncoveredLines
 * @property {number} coverableLines
 * @property {number} totalLines
 * @property {number} linePct
 * @property {number} coveredBranches
 * @property {number} totalBranches
 * @property {number} branchPct
 */
export async function parseCoverageReport() {
    try {
        const res = await fetch(REPORT_PATH);
        if (!res.ok) return null;
        const html = await res.text();
        return parseHtml(html);
    } catch {
        return null;
    }
}

/* ── Interne parsing ──────────────────────────────────────────────────── */

function parseHtml(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");

    const summary = parseSummary(doc);
    const classes = parseClassTable(doc);

    if (!summary) return null;
    return { summary, classes };
}

/**
 * Parst de samenvattingskaarten (Information, Line coverage, Branch coverage).
 */
function parseSummary(doc) {
    // Alle key-value paren uit de samenvattingstabellen
    const kv = {};
    doc.querySelectorAll(".card .table table tr").forEach(tr => {
        const th = tr.querySelector("th");
        const td = tr.querySelector("td");
        if (th && td) {
            kv[th.textContent.trim().replace(/:$/, "")] = td.getAttribute("title") || td.textContent.trim();
        }
    });

    const coveredLines = parseInt(kv["Covered lines"]) || 0;
    const uncoveredLines = parseInt(kv["Uncovered lines"]) || 0;
    const coverableLines = parseInt(kv["Coverable lines"]) || 0;
    const totalLines = parseInt(kv["Total lines"]) || 0;
    const coveredBranches = parseInt(kv["Covered branches"]) || 0;
    const totalBranches = parseInt(kv["Total branches"]) || 0;

    return {
        parser: kv["Parser"] || "",
        assemblyCount: parseInt(kv["Assemblies"]) || 0,
        classCount: parseInt(kv["Classes"]) || 0,
        fileCount: parseInt(kv["Files"]) || 0,
        coverageDate: kv["Coverage date"] || "",
        coveredLines,
        uncoveredLines,
        coverableLines,
        totalLines,
        linePct: coverableLines ? round1(coveredLines / coverableLines * 100) : 0,
        coveredBranches,
        totalBranches,
        branchPct: totalBranches ? round1(coveredBranches / totalBranches * 100) : 0,
    };
}

/**
 * Parst de coverage-tabel met per-klasse gegevens.
 * Verwacht de tabel met headers: Name | Covered | Uncovered | Coverable | Total | Line% | ... | Branch covered | Branch total | Branch%
 */
function parseClassTable(doc) {
    const classes = [];

    // De klasse-rijen staan in de "overview" tabel onderaan index.htm.
    // Elke rij bevat een <a> met href="LocalLLM_ClassName.html" en 8+ <td> cellen.
    const rows = doc.querySelectorAll("table tr");

    for (const tr of rows) {
        const link = tr.querySelector('a[href^="LocalLLM_"]');
        if (!link) continue;

        // Verzamel alle <td> cellen met title-attributen (bevatten de ruwe cijfers)
        const tds = [...tr.querySelectorAll("td")];
        if (tds.length < 8) continue;

        const fullName = link.textContent.trim();
        const shortName = fullName.split(".").pop();

        // Celstructuur: Name | Covered | Uncovered | Coverable | Total | Line% | [bar] | BranchCovered | BranchTotal | Branch%
        // We lezen de cijfers uit de title-attributen of textContent
        const nums = tds.map(td => {
            const title = td.getAttribute("title");
            // Title kan "x/y" zijn bij percentages, of een getal
            if (title && /^\d+$/.test(title)) return parseInt(title);
            if (title && /^\d+\/\d+$/.test(title)) return title; // "934/1309" etc.
            const text = td.textContent.trim();
            if (/^\d+$/.test(text)) return parseInt(text);
            if (/^\d+(\.\d+)?%$/.test(text)) return parseFloat(text);
            return text;
        });

        // Zoek de cijfers: covered lines, uncovered, coverable, total, line%, ...branch-covered, branch-total, branch%
        const numericTds = tds.filter(td => {
            const t = td.textContent.trim();
            return /^\d+$/.test(t) || /^\d+(\.\d+)?%$/.test(t);
        });

        if (numericTds.length < 7) continue;

        const coveredLines = parseInt(numericTds[0]?.textContent) || 0;
        const uncoveredLines = parseInt(numericTds[1]?.textContent) || 0;
        const coverableLines = parseInt(numericTds[2]?.textContent) || 0;
        const totalLines = parseInt(numericTds[3]?.textContent) || 0;
        // numericTds[4] = line% (e.g. "100%")
        const linePctStr = numericTds[4]?.textContent?.trim() || "0%";
        const linePct = parseFloat(linePctStr);

        // Branch data: zoek de laatste 3 numerieke cellen
        const coveredBranches = parseInt(numericTds[5]?.textContent) || 0;
        const totalBranches = parseInt(numericTds[6]?.textContent) || 0;
        // Branch% zit in de laatste td met title="x/y"
        const branchPctTd = [...tds].reverse().find(td =>
            td.getAttribute("title")?.includes("/") && td.textContent.includes("%")
        );
        const branchPct = branchPctTd ? parseFloat(branchPctTd.textContent) : 0;

        classes.push({
            fullName,
            shortName,
            coveredLines,
            uncoveredLines,
            coverableLines,
            totalLines,
            linePct,
            coveredBranches,
            totalBranches,
            branchPct,
        });
    }

    return classes;
}

function round1(n) {
    return Math.round(n * 10) / 10;
}
