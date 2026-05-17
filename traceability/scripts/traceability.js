import { initHamburgerNav } from "../../scripts/shared/nav.js";
import { initStoryMode } from "../../scripts/shared/storyMode.js";
import { initThemeToggle } from "../../scripts/shared/themeToggle.js";
import { mountGraph } from "./graph.js";
import { mountHeatmap } from "./heatmap.js";

const TAB_CONFIG = {
    overzicht: { kind: "table", title: "Overzicht", file: "./data/Overzicht.csv" },
    oc: { kind: "table", title: "OC Traceability", file: "./data/OC_Traceability.csv" },
    fr: { kind: "table", title: "FR Traceability", file: "./data/FR_Traceability.csv" },
    nfr: { kind: "table", title: "NFR Traceability", file: "./data/NFR_Traceability.csv" },
    constraints: { kind: "table", title: "Constraints", file: "./data/Constraints.csv" },
    normen: { kind: "table", title: "Beveiligingsnormen", file: "./data/Beveiligingsnormen.csv" },
    risico: { kind: "table", title: "Risicoregister", file: "./data/Risicoregister.csv" },
    todo: { kind: "table", title: "To-do", file: "./data/Todo.csv" },
    changelog: { kind: "table", title: "Changelog", file: "./data/Changelog.csv" },
    graph: { kind: "graph", title: "Traceability graph" },
    heatmap: { kind: "heatmap", title: "OC × DV coverage" },
};

const elTableWrap = document.getElementById("tableWrap");
const elGraphHost = document.getElementById("graphHost");
const elHeatmapHost = document.getElementById("heatmapHost");
const elMeta = document.getElementById("meta");
const elQ = document.getElementById("q");
const elSearchWrap = document.getElementById("tableSearchWrap");
const elSide = document.getElementById("sideEl");
const tabButtons = [...document.querySelectorAll(".tab[data-tab]")];

let currentTabKey = "graph";
let currentRows = [];
let currentHeaders = [];
let graphApi = null;
let heatmapApi = null;

tabButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
        await switchTab(btn.dataset.tab);
    });
});

elQ.addEventListener("input", () => renderTable());

(async () => {
    // Honour initial ?tab=, default to Graph
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("tab");
    const initialTab = requested && TAB_CONFIG[requested] ? requested : "graph";
    await switchTab(initialTab);
})();

async function switchTab(key) {
    if (!TAB_CONFIG[key]) return;
    currentTabKey = key;

    tabButtons.forEach((b) => {
        const active = b.dataset.tab === key;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
    });

    const cfg = TAB_CONFIG[key];
    elMeta.textContent = "";

    // hide all hosts first
    elTableWrap.hidden = true;
    elGraphHost.hidden = true;
    elHeatmapHost.hidden = true;
    elSearchWrap.style.display = cfg.kind === "table" ? "" : "none";

    if (cfg.kind === "graph") {
        elGraphHost.hidden = false;
        // mount once, reuse
        if (!graphApi) {
            graphApi = mountGraph({ host: elGraphHost, sideEl: elSide });
        }
        writeTabParam(key);
        return;
    }

    if (cfg.kind === "heatmap") {
        elHeatmapHost.hidden = false;
        // re-mount on each entry so it always picks up correct sizing
        if (heatmapApi) heatmapApi.destroy();
        heatmapApi = mountHeatmap({
            host: elHeatmapHost,
            sideEl: elSide,
            onSelect: (dvId, ocId) => {
                // jump to graph with focus on the OC and DV+OC visible
                switchTab("graph").then(() => {
                    graphApi?.setFilter?.(["dv", "oc"]);
                    graphApi?.focus?.(ocId);
                });
            },
        });
        writeTabParam(key);
        return;
    }

    // table tabs
    elTableWrap.hidden = false;
    elQ.value = "";
    await loadAndRender(cfg);
    writeTabParam(key);
}

function writeTabParam(key) {
    const params = new URLSearchParams(window.location.search);
    if (key === "graph") params.delete("tab");
    else params.set("tab", key);
    const q = params.toString();
    history.replaceState(
        null,
        "",
        window.location.pathname + (q ? `?${q}` : "") + window.location.hash
    );
}

async function loadAndRender(cfg) {
    elMeta.textContent = `Laden: ${cfg.title}...`;
    elTableWrap.innerHTML = "";

    const csvText = await fetchText(cfg.file);
    const { headers, rows } = parseCsv(csvText);

    currentHeaders = headers;
    currentRows = rows;

    renderTable();
}

function renderTable() {
    const q = (elQ.value ?? "").trim().toLowerCase();

    const filtered = !q
        ? currentRows
        : currentRows.filter((r) =>
              r.some((cell) =>
                  String(cell ?? "")
                      .toLowerCase()
                      .includes(q)
              )
          );

    elMeta.textContent = `${TAB_CONFIG[currentTabKey].title} — ${filtered.length} rijen`;
    elTableWrap.innerHTML = buildTableHtml(currentHeaders, filtered);
}

function buildTableHtml(headers, rows) {
    const headerLower = headers.map((h) => h.trim().toLowerCase());
    const idxStatus = headerLower.findIndex(
        (h) => h === "status" || h === "actueel niveau"
    );
    const idxPrio = headerLower.findIndex((h) => h === "prioriteit");
    const idxIdLike = headerLower.findIndex(
        (h) =>
            h === "id" ||
            h === "oc" ||
            h === "fr" ||
            h === "nfr" ||
            h === "#" ||
            h === "norm / cluster"
    );

    const thead = `
      <thead>
        <tr>
          ${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}
        </tr>
      </thead>
    `;

    const tbody = `
      <tbody>
        ${rows
            .map(
                (r) =>
                    `<tr>${r
                        .map((c, i) => `<td>${cellHtml(c, i, idxStatus, idxPrio, idxIdLike)}</td>`)
                        .join("")}</tr>`
            )
            .join("")}
      </tbody>
    `;

    return `<div class="tableWrap__inner" style="overflow:auto">
    <table class="matrixTable">
        ${thead}${tbody}
    </table>
</div>`;
}

function cellHtml(raw, i, idxStatus, idxPrio, idxIdLike) {
    const value = String(raw ?? "").trim();
    if (!value) return "";

    if (i === idxStatus) {
        const cls = statusBadgeClass(value);
        if (cls) return `<span class="badge ${cls}">${escapeHtml(value)}</span>`;
    }
    if (i === idxPrio) {
        const cls = priorityBadgeClass(value);
        if (cls) return `<span class="badge ${cls}">${escapeHtml(value)}</span>`;
    }
    if (i === idxIdLike) {
        return `<span class="badge badge--id">${escapeHtml(value)}</span>`;
    }
    return escapeHtml(value);
}

function statusBadgeClass(value) {
    const v = value.toLowerCase();
    if (/^(ja|gemitigeerd|voldoet|done)$/.test(v)) return "badge--ok";
    if (/^(gedeeltelijk|open)$/.test(v)) return "badge--partial";
    if (/^(nee|to do|todo)$/.test(v)) return "badge--no";
    if (/^(n\.v\.t\.|na)$/.test(v)) return "badge--na";
    return null;
}

function priorityBadgeClass(value) {
    const v = value.toUpperCase();
    if (v === "MUST") return "badge--must";
    if (v === "SHOULD") return "badge--should";
    if (v === "COULD") return "badge--could";
    return null;
}

async function fetchText(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
        throw new Error(`Kon CSV niet laden (${res.status}): ${url}`);
    }
    return await res.text();
}

/** Minimal CSV parser (`;`-delimited, supports quoted values). */
function parseCsv(text, delimiter = ";") {
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const next = text[i + 1];

        if (ch === '"') {
            if (inQuotes && next === '"') {
                cell += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (!inQuotes && ch === delimiter) {
            row.push(cell);
            cell = "";
            continue;
        }

        if (!inQuotes && (ch === "\n" || ch === "\r")) {
            if (ch === "\r" && next === "\n") i++;
            row.push(cell);
            rows.push(row);
            row = [];
            cell = "";
            continue;
        }

        cell += ch;
    }

    if (cell.length || row.length) {
        row.push(cell);
        rows.push(row);
    }

    while (
        rows.length &&
        rows[rows.length - 1].every((c) => String(c ?? "").trim() === "")
    ) {
        rows.pop();
    }

    const headers = (rows.shift() ?? []).map((h) => String(h ?? "").trim());
    const data = rows.map((r) => normalizeRow(r, headers.length));

    return { headers, rows: data };
}

function normalizeRow(r, len) {
    const out = new Array(len).fill("");
    for (let i = 0; i < len; i++) out[i] = r[i] ?? "";
    return out;
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (m) => {
        return (
            {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;",
            }[m] ?? m
        );
    });
}

// ===== Presentation mode =====
const btnPresent = document.getElementById("btnPresent");

function togglePresent(force) {
    const on =
        typeof force === "boolean"
            ? force
            : !document.body.classList.contains("is-presenting");
    document.body.classList.toggle("is-presenting", on);
    btnPresent?.classList.toggle("is-on", on);
    if (btnPresent) btnPresent.textContent = on ? "✖ Stop presentatie" : "▶ Presentatie";
    // Save in URL so a saved link reproduces presentation mode
    const params = new URLSearchParams(window.location.search);
    if (on) params.set("present", "1");
    else params.delete("present");
    const q = params.toString();
    history.replaceState(
        null,
        "",
        window.location.pathname + (q ? `?${q}` : "") + window.location.hash
    );
}

btnPresent?.addEventListener("click", () => togglePresent());

window.addEventListener("keydown", (e) => {
    const tag = (e.target?.tagName ?? "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    if (e.key === "p" || e.key === "P") togglePresent();
    if (e.key === "Escape" && document.body.classList.contains("is-presenting")) {
        togglePresent(false);
    }
});

if (new URLSearchParams(window.location.search).get("present") === "1") {
    togglePresent(true);
}

initHamburgerNav();
initThemeToggle();
initStoryMode();
