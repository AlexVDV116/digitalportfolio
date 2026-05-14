import { METRICS } from "../../scripts/shared/researchMetrics.js";
import { initHamburgerNav } from "../../scripts/shared/nav.js";
import { initStoryMode } from "../../scripts/shared/storyMode.js";

initHamburgerNav();
initStoryMode();
initTabs();
renderCoverCards();
renderCoverBars();
renderClassTable();
renderOcMatrix();
renderStride();
renderRiskTable();
renderGatQuestions();
loadGatData();

// ── Tabs ──────────────────────────────────────────────────────────────────

function initTabs() {
    document.querySelectorAll(".evalTab").forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.dataset.tab;
            document.querySelectorAll(".evalTab").forEach(b => {
                b.classList.toggle("is-active", b === btn);
                b.setAttribute("aria-selected", b === btn ? "true" : "false");
            });
            document.querySelectorAll(".evalPane").forEach(p => {
                const active = p.id === `pane-${key}`;
                p.classList.toggle("is-active", active);
                p.hidden = !active;
            });
        });
    });
}

// ── Coverage cards ────────────────────────────────────────────────────────

function renderCoverCards() {
    const t = METRICS.tests;
    const cards = [
        { num: t.total,         label: "MSTest-cases",          sub: `${t.classes} testklassen` },
        { num: `${t.projectLine}%`, label: "Project lijn-dekking", sub: `${t.coveredLines}/${t.totalLines} regels` },
        { num: `${t.projectBlock}%`, label: "Project block-dekking", sub: `${t.coveredBlocks}/${t.totalBlocks} blocks` },
        { num: `~${t.coreLine}%`,   label: "Core-scope lijn",    sub: `excl. View-laag` },
        { num: t.classesAt100,  label: "Klassen op 100% lijn",  sub: `van ${t.totalProductionClasses} totaal` },
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
        { label: "Project lijn-dekking",    pct: t.projectLine,  note: "VS2022 full solution" },
        { label: "Project block-dekking",   pct: t.projectBlock, note: "VS2022 full solution" },
        { label: "Core-scope lijn-dekking", pct: t.coreLine,     note: "excl. View-laag" },
        { label: "Core-scope block-dekking",pct: t.coreBlock,    note: "excl. View-laag" },
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

// ── Test class table ──────────────────────────────────────────────────────

function renderClassTable() {
    const rows = METRICS.tests.classCounts.map(c => `
        <tr>
            <td>${c.name}</td>
            <td class="num">${c.methods}</td>
            <td class="num">${c.dataRows > 0 ? `+${c.dataRows}` : "–"}</td>
            <td class="num"><strong>${c.total}</strong></td>
        </tr>`).join("");
    document.getElementById("classTable").innerHTML = `
        <table class="evalTable">
            <thead><tr>
                <th>Testklasse</th>
                <th class="num">Methoden</th>
                <th class="num">DataRows</th>
                <th class="num">Totaal</th>
            </tr></thead>
            <tbody>${rows}</tbody>
            <tfoot><tr>
                <td><strong>Totaal</strong></td>
                <td class="num"><strong>${METRICS.tests.classCounts.reduce((a,c)=>a+c.methods,0)}</strong></td>
                <td class="num"><strong>+${METRICS.tests.classCounts.reduce((a,c)=>a+c.dataRows,0)}</strong></td>
                <td class="num"><strong>${METRICS.tests.total}</strong></td>
            </tr></tfoot>
        </table>`;
}

// ── OC validation matrix ──────────────────────────────────────────────────

function renderOcMatrix() {
    const evalNotes = {
        "OC-1": "Geen auto-apply; dismissbare banner + SessionDisclaimer Info-bubble",
        "OC-2": "ContextMode-ceiling (Off/SelectionOnly/IncludeMethod/IncludeFile); default SelectionOnly",
        "OC-3": "AppDefaults: Temperature=0.2f, TopP=0.9f, NumPredict=2048; pinning-tests in CI",
        "OC-4": "LlmClientBase URL-syntaxvalidatie (IsValidHttpUrl); netwerklaag-segmentatie JIVC SO&I-LAN",
        "OC-5": "In-memory only; no-op LoadSettings/SaveSettings; grep: 0 hits File.Write* in productiecode",
        "OC-6": "LocalLLM.Core zonder VS-SDK refs; SettingsProxy als composition root; STRIDE EoP = Zeer laag",
        "OC-7": "Uitsluitend gedocumenteerde SDK-types; AllowsBackgroundLoading; KnownMonikers",
        "OC-8": "Typed exceptions; 120s + 5s timeouts; linked CTS; top-level catch in AsyncRelayCommand",
        "OC-9": "Context-strip; status-dot; model-label per bubble; Markdig 0.40.0 Markdown-rendering",
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

// ── GAT data loader (static CSV in codebase) ─────────────────────────────

async function loadGatData() {
    try {
        const res = await fetch("data/gat-results.csv");
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
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
        if (!line.trim()) continue;
        const cols = [];
        let cur = "", inQ = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') { inQ = !inQ; continue; }
            if (ch === "," && !inQ) { cols.push(cur); cur = ""; continue; }
            cur += ch;
        }
        cols.push(cur);
        rows.push(cols);
    }
    return rows;
}

function renderGatResults(rows) {
    document.getElementById("gatEmpty").hidden = true;
    document.getElementById("gatResults").hidden = false;

    const n = rows.length;
    const gat = METRICS.gat;

    // Summary cards
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

    // Likert bar chart
    renderGatBars(rows);

    // Open feedback
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
