import { METRICS } from "../../scripts/shared/researchMetrics.js";
import { parseCoverageReport } from "./coverageReportParser.js";
import { initHamburgerNav } from "../../scripts/shared/nav.js";
import { initStoryMode } from "../../scripts/shared/storyMode.js";
import { initThemeToggle } from "../../scripts/shared/themeToggle.js";

initHamburgerNav();
initThemeToggle();
initStoryMode();
initTabs();

// Coverage data wordt asynchroon geladen uit het CoverageReport.
// Bij succes worden de fallback-waarden in METRICS overschreven.
initCoverageData().then(() => {
    renderCoverCards();
    renderCoverBars();
    renderTestStrategy();
    renderOcMatrix();
    renderStride();
    renderRiskTable();
    renderGatQuestions();
    loadGatData();
});

// ── Coverage report auto-parse ───────────────────────────────────────────

/** @type {import("./coverageReportParser.js").CoverageData|null} */
let reportData = null;

async function initCoverageData() {
    reportData = await parseCoverageReport();
    if (!reportData) return; // fallback op METRICS

    const s = reportData.summary;
    const t = METRICS.tests;

    // Overschrijf project-totalen met actuele waarden uit het rapport
    t.projectLine = s.linePct;
    t.projectBranch = s.branchPct;
    t.coveredLines = s.coveredLines;
    t.coverableLines = s.coverableLines;
    t.totalLines = s.totalLines;
    t.coveredBranches = s.coveredBranches;
    t.totalBranches = s.totalBranches;
    t.totalProductionClasses = s.classCount;
    t.coverageDate = s.coverageDate;
    t.coverageParser = s.parser;
}

// ── Tabs ──────────────────────────────────────────────────────────────────

function initTabs() {
    function activateTab(key) {
        document.querySelectorAll(".evalTab").forEach(b => {
            b.classList.toggle("is-active", b.dataset.tab === key);
            b.setAttribute("aria-selected", b.dataset.tab === key ? "true" : "false");
        });
        document.querySelectorAll(".evalPane").forEach(p => {
            const active = p.id === `pane-${key}`;
            p.classList.toggle("is-active", active);
            p.hidden = !active;
        });
    }

    document.querySelectorAll(".evalTab").forEach(btn => {
        btn.addEventListener("click", () => activateTab(btn.dataset.tab));
    });

    const urlTab = new URLSearchParams(window.location.search).get("tab");
    if (urlTab) activateTab(urlTab);
}

// ── Coverage cards ────────────────────────────────────────────────────────

function renderCoverCards() {
    const t = METRICS.tests;
    const cards = [
        { num: t.total,             label: "MSTest-cases",            sub: `${t.totalTestClasses} testklassen (${t.unitClasses} unit · ${t.integrationClasses} integratie)` },
        { num: `${t.projectLine}%`, label: "Project lijn-dekking",    sub: `${t.coveredLines} / ${t.coverableLines} regels` },
        { num: `${t.projectBranch}%`, label: "Project branch-dekking", sub: `${t.coveredBranches} / ${t.totalBranches} branches` },
        { num: `~${t.coreLine}%`,   label: "Core-scope lijn",         sub: `excl. WPF/XAML View-laag` },
        { num: `${t.mutationsKilled}/${t.mutationsTotal}`, label: "Mutaties gevangen", sub: `handmatige mutatievalidatie` },
    ];
    document.getElementById("coverCards").innerHTML = cards.map(c => `
        <div class="coverCard">
            <div class="coverCard__num">${c.num}</div>
            <div class="coverCard__label">${c.label}</div>
            <div class="coverCard__sub">${c.sub}</div>
        </div>`).join("");
}

// ── Coverage bars ─────────────────────────────────────────────────────────

function renderCoverBars() {
    const t = METRICS.tests;
    const bars = [
        { label: "Project lijn-dekking",       pct: t.projectLine,   note: t.coverageParser || "Coverlet/Cobertura" },
        { label: "Project branch-dekking",     pct: t.projectBranch, note: t.coverageParser || "Coverlet/Cobertura" },
        { label: "Core-scope lijn-dekking",    pct: t.coreLine,      note: "excl. WPF/XAML View-laag" },
        { label: "Core-scope branch-dekking",  pct: t.coreBranch,    note: "excl. WPF/XAML View-laag" },
    ];
    document.getElementById("coverBars").innerHTML = bars.map(b => {
        const pct = parseFloat(b.pct);
        const cls = pct >= 70 ? "coverBar__fill--good" : pct >= 40 ? "coverBar__fill--mid" : "coverBar__fill--low";
        return `
        <div class="coverBar">
            <div class="coverBar__header">
                <span class="coverBar__label">${b.label}</span>
                <span class="coverBar__pct">${b.pct}%</span>
            </div>
            <div class="coverBar__track">
                <div class="coverBar__fill ${cls}" style="width:${Math.min(pct,100)}%" role="progressbar"
                     aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <div class="coverBar__note">${b.note}</div>
        </div>`;
    }).join("");
}

// ── Teststrategie (vervangt de vorige testklassen-tabel) ─────────────────

function renderTestStrategy() {
    const t = METRICS.tests;
    const m = METRICS.mvp;

    // Bereken per-klasse coverage samenvatting als het rapport beschikbaar is
    let classSummaryHtml = "";
    if (reportData?.classes?.length) {
        const sorted = [...reportData.classes].sort((a, b) => b.linePct - a.linePct);
        const full = sorted.filter(c => c.linePct === 100);
        const high = sorted.filter(c => c.linePct >= 80 && c.linePct < 100);
        const zero = sorted.filter(c => c.linePct === 0);
        const other = sorted.filter(c => c.linePct > 0 && c.linePct < 80);

        classSummaryHtml = `
            <div class="strategyDetail">
                <h4 class="evalSubtitle">Coverage per klasse (uit rapport)</h4>
                <div class="classSummaryGrid">
                    <div class="classSummaryItem classSummaryItem--good">
                        <span class="classSummaryItem__num">${full.length}</span>
                        <span class="classSummaryItem__label">klassen op 100%</span>
                    </div>
                    <div class="classSummaryItem classSummaryItem--mid">
                        <span class="classSummaryItem__num">${high.length}</span>
                        <span class="classSummaryItem__label">klassen 80–99%</span>
                    </div>
                    <div class="classSummaryItem classSummaryItem--low">
                        <span class="classSummaryItem__num">${zero.length}</span>
                        <span class="classSummaryItem__label">klassen 0% (WPF/XAML)</span>
                    </div>
                </div>
                <details class="strategyDetails">
                    <summary>Toon per-klasse dekking</summary>
                    <table class="evalTable evalTable--compact">
                        <thead><tr><th>Klasse</th><th class="num">Lijn</th><th class="num">Branch</th></tr></thead>
                        <tbody>${sorted.map(c => {
                            const cls = c.linePct === 100 ? "good" : c.linePct >= 80 ? "mid" : c.linePct > 0 ? "partial" : "zero";
                            return `<tr class="coverRow--${cls}">
                                <td>${esc(c.shortName)}</td>
                                <td class="num">${c.linePct}%</td>
                                <td class="num">${c.branchPct}%</td>
                            </tr>`;
                        }).join("")}</tbody>
                    </table>
                </details>
            </div>`;
    }

    document.getElementById("classTable").innerHTML = `
        <div class="testStrategy">
            <div class="testStrategy__intro">
                <p>De teststrategie volgt een <strong>testpiramide</strong>: unit tests vormen de kern,
                aangevuld met coverage-analyse, handmatige mutatievalidatie en exploratieve verificatie.
                De testsuite is <strong>hermetisch</strong> opgezet — alle externe afhankelijkheden
                (HTTP-backends, WPF-dispatcher, Visual Studio-host) zijn vervangen door testdoubles.</p>
            </div>

            <div class="strategyLayers">
                <div class="strategyLayer">
                    <div class="strategyLayer__icon">🧪</div>
                    <div class="strategyLayer__body">
                        <strong>Unit tests</strong> — ${t.total} tests over ${t.unitClasses} klassen
                        <p>Functionele kernlogica: promptopbouw, contextinjectie, LLM-communicatie, SSE-streaming, apply-pipeline, ViewModel-gedrag en command-objecten. Alle tests draaien deterministisch zonder live backend.</p>
                    </div>
                </div>
                <div class="strategyLayer">
                    <div class="strategyLayer__icon">📊</div>
                    <div class="strategyLayer__body">
                        <strong>Coverage-analyse</strong> — ${t.projectLine}% lijn · ${t.projectBranch}% branch (project)
                        <p>Gemeten met ${m.coverageTool}. De headline-dekking wordt gedrukt door WPF/XAML-klassen die structureel buiten de unit-testscope vallen. Na uitsluiting daarvan haalt de unit-testbare code ~${t.coreLine}% lijndekking.</p>
                    </div>
                </div>
                <div class="strategyLayer">
                    <div class="strategyLayer__icon">🧬</div>
                    <div class="strategyLayer__body">
                        <strong>Mutatievalidatie</strong> — ${t.mutationsKilled}/${t.mutationsTotal} mutaties gevangen
                        <p>Acht realistische codewijzigingen in kritieke productiepaden (protocol-omzeiling, SSE-sentinel, Apply-blokkering, history-wissing). Alle gevangen door bestaande tests.</p>
                    </div>
                </div>
                <div class="strategyLayer">
                    <div class="strategyLayer__icon">🔌</div>
                    <div class="strategyLayer__body">
                        <strong>Integratietests</strong> — ${t.integrationClasses} klassen (buiten CI)
                        <p>Live-verificatie tegen Ollama, LM Studio en reasoning-backends. Gemarkeerd met <code>[TestCategory("Integration")]</code>, niet standaard in CI.</p>
                    </div>
                </div>
                <div class="strategyLayer">
                    <div class="strategyLayer__icon">👁️</div>
                    <div class="strategyLayer__body">
                        <strong>Handmatige verificatie</strong>
                        <p>WPF-rendering, Markdown-weergave, DiffPreviewWindow en VS-hostintegratie. Deze onderdelen vereisen een draaiende Visual Studio Experimental Hive.</p>
                    </div>
                </div>
            </div>

            ${classSummaryHtml}

            <div class="strategyRefs">
                <p class="strategyRefs__note">
                    Detailinformatie over testarchitectuur, per-feature dekkingsmatrix, risicogebaseerde analyse en mutatievalidatie
                    is beschikbaar in het <strong>Software Test Document (${m.stdVersion})</strong> en het
                    <strong>Coverage Report</strong>.
                </p>
                <div class="strategyRefs__links">
                    <a href="./data/CoverageReport/index.htm" class="evalLink" target="_blank" rel="noopener">
                        Coverage Report openen ↗
                    </a>
                </div>
            </div>
        </div>`;
}

// ── OC validation matrix ──────────────────────────────────────────────────

function renderOcMatrix() {
    const evalNotes = {
        "OC-1": "Geen auto-apply; dismissbare banner + SessionDisclaimer Info-bubble; Apply disabled tijdens streaming",
        "OC-2": "ContextMode-ceiling (Off/SelectionOnly/IncludeMethod/IncludeFile); default SelectionOnly",
        "OC-3": "AppDefaults: Temperature=0.2f, TopP=0.9f, MaxTokensPreset (default Extended=4096); pinning-tests in CI",
        "OC-4": "LlmClientBase.CreateBaseUri URL-syntaxvalidatie; netwerklaag-segmentatie JIVC SO&I-LAN",
        "OC-5": "In-memory only; reasoning/cancelled/incomplete niet in history; DialogPage persistence config; geen interactie-inhoud naar disk",
        "OC-6": "LocalLLM.Core zonder VS-SDK refs; SettingsProxy als composition root; STRIDE EoP = Zeer laag",
        "OC-7": "Uitsluitend gedocumenteerde SDK-types; AllowsBackgroundLoading; KnownMonikers",
        "OC-8": "Typed exceptions; 120s + 5s timeouts; linked CTS; SSE-foutpaden; streaming cancellation; top-level catch",
        "OC-9": "Context-strip; status-dot; model-label per bubble; streaming statussen; reasoning-expander; history-clear melding",
    };
    const rows = METRICS.ocStatus.map(oc => `
        <tr>
            <td><span class="badge badge--id">${esc(oc.id)}</span></td>
            <td>${esc(oc.label)}</td>
            <td><span class="badge badge--ok">✓ ${esc(oc.status)}</span></td>
            <td class="evalNote">${esc(evalNotes[oc.id] ?? "")}</td>
            <td>
                <a href="../oc/?id=${encodeURIComponent(oc.id)}" class="evalLink" title="OC Explorer">Bewijs →</a>
            </td>
        </tr>`).join("");
    document.getElementById("ocMatrix").innerHTML = `
        <table class="evalTable evalTable--wide">
            <thead><tr>
                <th>OC</th><th>Criterium</th><th>Status</th><th>Voornaamste bewijs</th><th></th>
            </tr></thead>
            <tbody>${rows}</tbody>
        </table>`;
}

// ── STRIDE table ──────────────────────────────────────────────────────────

function renderStride() {
    const residualClass = {
        "Laag": "badge--partial",
        "Matig": "badge--partial",
        "Zeer laag": "badge--ok",
    };
    const rows = METRICS.stride.map(s => `
        <tr>
            <td><strong>${esc(s.threat)}</strong></td>
            <td class="evalNote">${esc(s.mitigation)}</td>
            <td><span class="badge ${residualClass[s.residual] ?? "badge--na"}">${esc(s.residual)}</span></td>
        </tr>`).join("");
    document.getElementById("strideTable").innerHTML = `
        <table class="evalTable">
            <thead><tr><th>Dreiging</th><th>Mitigatie</th><th>Restrisico</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>`;
}

// ── Risk register ─────────────────────────────────────────────────────────

function renderRiskTable() {
    const statusClass = {
        "Gemitigeerd": "badge--ok",
        "Open": "badge--no",
        "n.v.t.": "badge--na",
    };
    const rows = METRICS.risks.map(r => `
        <tr>
            <td><span class="badge badge--id">${esc(r.id)}</span></td>
            <td>${esc(r.label)}</td>
            <td><span class="badge badge--na">${esc(r.scope)}</span></td>
            <td><span class="badge ${statusClass[r.status] ?? "badge--na"}">${esc(r.status)}</span></td>
        </tr>`).join("");
    document.getElementById("riskTable").innerHTML = `
        <table class="evalTable">
            <thead><tr><th>ID</th><th>Risico</th><th>Scope</th><th>Status</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>`;
}

// ── GAT questions list ────────────────────────────────────────────────────

function renderGatQuestions() {
    const items = METRICS.gat.likert.map((q, i) => `
        <div class="gatQ">
            <span class="gatQ__num">${i + 1}</span>
            <span class="gatQ__text">${esc(q.label)}</span>
            <span class="gatQ__scale">1–5</span>
        </div>`).join("");
    document.getElementById("gatQuestions").innerHTML = `<div class="gatQList">${items}</div>`;
}

// ── GAT data loader (live Google Sheets CSV) ─────────────────────────────

async function loadGatData() {
    try {
        const res = await fetch(METRICS.gat.csvUrl);
        if (!res.ok) { showGatEmpty(); return; }
        const text = await res.text();
        const rows = parseCsv(text);
        if (rows.length < 2) { showGatEmpty(); return; }
        renderGatResults(rows.slice(1));
    } catch {
        showGatEmpty();
    }
}

function showGatEmpty() {
    document.getElementById("gatEmpty").hidden = false;
    document.getElementById("gatResults").hidden = true;
}

function parseCsv(text) {
    const rows = [];
    let row = [], cur = "", inQ = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '"') {
            if (inQ && text[i + 1] === '"') { cur += '"'; i++; }
            else inQ = !inQ;
        } else if (ch === "," && !inQ) {
            row.push(cur); cur = "";
        } else if (ch === "\r" && text[i + 1] === "\n" && !inQ) {
            i++;
            row.push(cur); cur = ""; rows.push(row); row = [];
        } else if (ch === "\n" && !inQ) {
            row.push(cur); cur = ""; rows.push(row); row = [];
        } else {
            cur += ch;
        }
    }
    if (row.length || cur) { row.push(cur); rows.push(row); }
    return rows.filter(r => r.some(v => v.trim()));
}

function renderGatResults(rows) {
    document.getElementById("gatEmpty").hidden = true;
    document.getElementById("gatResults").hidden = false;

    const n = rows.length;
    const gat = METRICS.gat;

    const grades = rows.map(r => parseFloat(r[gat.gradeCol])).filter(v => !isNaN(v));
    const npsScores = rows.map(r => parseFloat(r[gat.npsCol])).filter(v => !isNaN(v));
    const avgGrade = grades.length ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1) : "–";
    const avgNps = npsScores.length ? (npsScores.reduce((a, b) => a + b, 0) / npsScores.length).toFixed(1) : null;

    document.getElementById("gatSummaryCards").innerHTML = `
        <div class="coverCard">
            <div class="coverCard__num">${n}</div>
            <div class="coverCard__label">Respondenten</div>
            <div class="coverCard__sub">ingevulde vragenlijsten</div>
        </div>
        <div class="coverCard coverCard--stars">
            <div class="coverCard__num">${avgGrade}</div>
            <div class="starRating">${renderStars(parseFloat(avgGrade), 10)}</div>
            <div class="coverCard__label">Gemiddeld eindcijfer</div>
            <div class="coverCard__sub">schaal 1–10</div>
        </div>
        <div class="coverCard coverCard--stars">
            <div class="coverCard__num">${avgNps ?? "–"}</div>
            <div class="starRating">${avgNps ? renderStars(parseFloat(avgNps), 10) : ""}</div>
            <div class="coverCard__label">Aanbevelingsscore</div>
            <div class="coverCard__sub">gemiddeld · schaal 0–10</div>
        </div>`;

    renderGatBars(rows);
    renderGatFeedback(rows);
}

function renderGatBars(rows) {
    const gat = METRICS.gat;
    const bars = gat.likert.map(q => {
        const vals = rows.map(r => parseFloat(r[q.col])).filter(v => v >= 1 && v <= 5);
        const avg = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : null;
        const pct = avg ? ((avg - 1) / 4) * 100 : 0;
        const cls = avg >= 4 ? "coverBar__fill--good" : avg >= 3 ? "coverBar__fill--mid" : "coverBar__fill--low";
        return `
        <div class="coverBar">
            <div class="coverBar__header">
                <span class="coverBar__label">${esc(q.short)}</span>
                <span class="coverBar__pct">${avg ? avg.toFixed(2) : "–"} / 5</span>
            </div>
            <div class="coverBar__track">
                <div class="coverBar__fill ${cls}" style="width:${pct.toFixed(1)}%"
                     role="progressbar" aria-valuenow="${avg ?? 0}" aria-valuemin="1" aria-valuemax="5"></div>
            </div>
        </div>`;
    });
    document.getElementById("gatBarChart").innerHTML = bars.join("");
}

function renderGatFeedback(rows) {
    const gat = METRICS.gat;
    const groups = gat.openCols.map(q => {
        const answers = rows.map(r => (r[q.col] ?? "").trim()).filter(Boolean);
        if (!answers.length) return "";
        return `
        <div class="feedbackGroup">
            <div class="feedbackGroup__label">${esc(q.label)}</div>
            ${answers.map(a => `<blockquote class="feedbackQuote">${esc(a)}</blockquote>`).join("")}
        </div>`;
    });
    document.getElementById("gatFeedback").innerHTML = groups.join("") || "<p>Geen open antwoorden.</p>";
}

// ── Helpers ───────────────────────────────────────────────────────────────

function renderStars(score, max) {
    const filled = Math.round(score);
    let html = "";
    for (let i = 1; i <= max; i++) {
        html += `<span class="star ${i <= filled ? "star--filled" : "star--empty"}">★</span>`;
    }
    return html;
}

function esc(s) {
    return String(s ?? "").replace(/[&<>"']/g, m =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[m]
    );
}
