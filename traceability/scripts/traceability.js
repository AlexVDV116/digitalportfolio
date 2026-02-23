import { initHamburgerNav } from "../../scripts/shared/nav.js";

const TAB_CONFIG = {
    project: {
        title: "Project traceability",
        file: "./data/Project_Traceability.csv",
    },
    pva: {
        title: "PvA traceability",
        file: "./data/PVA_Traceability.csv",
        // optioneel: mooiere headers i.p.v. "Unnamed: x"
        headerOverride: [
            "Fase 1 — Probleemverkenning & vraagstelling (Voorbereiding)",
            "Centrale onderzoeksvraag",
            "Deelvraag",
            "Fase 2 — Theorie & onderzoeksopzet (Voorbereiding)",
            "Onderzoeksmethode & synthese",
            "Fase 4 — Ontwerp & MVP-beslissingen (Uitvoering)",
            "Ontwerpbeslissing (MVP)",
            "Fase 5 — Evaluatie & afronding (Afronding)",
        ],
    },
    mvpoc: {
        title: "MVP ↔ OC traceability",
        file: "./data/MVP_OC_Traceability.csv",
    },
    uitvoering: {
        title: "Uitvoering traceability",
        file: "./data/Uitvoering_Traceability.csv",
    },
};

const elWrap = document.getElementById("tableWrap");
const elMeta = document.getElementById("meta");
const elQ = document.getElementById("q");
const tabButtons = [...document.querySelectorAll(".tab")];

let currentTabKey = "project";
let currentRows = [];
let currentHeaders = [];

tabButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
        setActiveTab(btn.dataset.tab);
        await loadAndRender();
    });
});

elQ.addEventListener("input", () => renderTable());

(async () => {
    await loadAndRender();
})();

function setActiveTab(key) {
    currentTabKey = key;

    tabButtons.forEach((b) => {
        const active = b.dataset.tab === key;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", String(active));
    });

    elQ.value = "";
}

async function loadAndRender() {
    const cfg = TAB_CONFIG[currentTabKey];
    elMeta.textContent = `Laden: ${cfg.title}...`;
    elWrap.innerHTML = "";

    const csvText = await fetchText(cfg.file);
    const { headers, rows } = parseCsv(csvText);

    currentHeaders = cfg.headerOverride ?? headers;
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

    elWrap.innerHTML = buildTableHtml(currentHeaders, filtered);
}

function buildTableHtml(headers, rows) {
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
                        .map((c) => `<td>${escapeHtml(c)}</td>`)
                        .join("")}</tr>`
            )
            .join("")}
      </tbody>
    `;

    return `<div class="tableWrap__inner"><table class="matrixTable">${thead}${tbody}</table></div>`;
}

async function fetchText(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
        throw new Error(`Kon CSV niet laden (${res.status}): ${url}`);
    }
    return await res.text();
}

/**
 * Minimal CSV parser (ondersteunt quotes).
 * Jouw CSV's zijn ;-gescheiden, dus default delimiter = ';'
 */
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

    // last cell
    if (cell.length || row.length) {
        row.push(cell);
        rows.push(row);
    }

    // trim empty trailing lines
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

initHamburgerNav();
