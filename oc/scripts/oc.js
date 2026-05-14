import { initHamburgerNav } from "../../scripts/shared/nav.js";
import { initStoryMode } from "../../scripts/shared/storyMode.js";
import { initThemeToggle } from "../../scripts/shared/themeToggle.js";
import { OC_DETAILS, OC_ORDER } from "../data/ocDetails.js";
import { NODES } from "../../traceability/data/graph.js";
import { LITERATURE } from "../../theory/scripts/data/literature.js";

const elList = document.getElementById("ocList");
const elMain = document.getElementById("ocMain");

const nodeById = new Map(NODES.map((n) => [n.id, n]));
const litById = new Map(LITERATURE.map((l) => [l.id, l]));

const STATUS_LABEL = {
    ok: "Ja",
    partial: "Gedeeltelijk",
    no: "Buiten MVP",
    todo: "Open",
    na: "n.v.t.",
};
const STATUS_BADGE = {
    ok: "badge--ok",
    partial: "badge--partial",
    no: "badge--no",
    todo: "badge--todo",
    na: "badge--na",
};

let currentId = null;

initRail();
initKeys();

// Initial OC from URL or default to OC-1
const params = new URLSearchParams(window.location.search);
const requested = params.get("id");
showOc(OC_ORDER.includes(requested) ? requested : "OC-1");

initHamburgerNav();
initThemeToggle();
initStoryMode();
initPresentationMode();

// ---------------------------------------------------------------------------

function initRail() {
    elList.innerHTML = OC_ORDER.map((id) => {
        const n = nodeById.get(id);
        const status = n?.status ?? "na";
        return `
            <li>
                <button class="ocRail__item" data-id="${id}" type="button">
                    <span class="ocRail__id">${id}</span>
                    <span class="ocRail__name">${escape(n?.name ?? "")}</span>
                    <span class="ocRail__status badge ${STATUS_BADGE[status]}" title="${STATUS_LABEL[status]}"></span>
                </button>
            </li>`;
    }).join("");

    elList.querySelectorAll(".ocRail__item").forEach((b) => {
        b.addEventListener("click", () => showOc(b.dataset.id));
    });
}

function initKeys() {
    window.addEventListener("keydown", (e) => {
        const tag = (e.target?.tagName ?? "").toLowerCase();
        if (tag === "input" || tag === "textarea") return;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            step(+1);
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            step(-1);
        }
    });
}

function step(delta) {
    if (!currentId) return;
    const i = OC_ORDER.indexOf(currentId);
    const next = OC_ORDER[(i + delta + OC_ORDER.length) % OC_ORDER.length];
    showOc(next);
}

function showOc(id) {
    currentId = id;
    const node = nodeById.get(id);
    const detail = OC_DETAILS[id];
    if (!node || !detail) {
        elMain.innerHTML = `<div class="card"><div class="card__title">Onbekende OC</div></div>`;
        return;
    }

    elList.querySelectorAll(".ocRail__item").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.id === id);
    });

    const statusKey = node.status ?? "na";

    elMain.innerHTML = `
        <header class="ocHeader">
            <div class="ocHeader__nav">
                <button class="btn" id="prevOc" type="button" aria-label="Vorige OC">← Vorige</button>
                <span class="ocHeader__progress">${OC_ORDER.indexOf(id) + 1} / ${OC_ORDER.length}</span>
                <button class="btn" id="nextOc" type="button" aria-label="Volgende OC">Volgende →</button>
            </div>
            <h2 class="ocHeader__title">
                <span class="ocHeader__id">${id}</span>
                <span class="ocHeader__name">${escape(node.name)}</span>
                <span class="badge ${STATUS_BADGE[statusKey]}">${STATUS_LABEL[statusKey]}</span>
            </h2>
            ${node.desc ? `<p class="ocHeader__lede">${escape(node.desc)}</p>` : ""}
            ${
                detail.designDecision
                    ? `<blockquote class="ocHeader__decision">${escape(detail.designDecision)}</blockquote>`
                    : ""
            }
        </header>

        ${renderOrigin(detail.origin)}
        ${renderOperational(detail.operational)}
        ${renderCompliance(detail.compliance)}
        ${renderImplementation(detail.implementation)}
        ${renderValidation(detail.validation)}

        <footer class="ocFooter">
            <p>Geïntegreerde traceability — bekijk dezelfde keten als netwerk in de
            <a href="../traceability/?focus=${id}">graph (focus ${id})</a>
            of via de
            <a href="../traceability/?tab=heatmap">heatmap</a>.</p>
        </footer>
    `;

    elMain.querySelector("#prevOc")?.addEventListener("click", () => step(-1));
    elMain.querySelector("#nextOc")?.addEventListener("click", () => step(+1));

    // Update URL
    const p = new URLSearchParams(window.location.search);
    p.set("id", id);
    history.replaceState(
        null,
        "",
        window.location.pathname + "?" + p.toString() + window.location.hash
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// --- Section renderers -----------------------------------------------------

function renderOrigin(origin) {
    if (!origin) return "";
    const dvList = (origin.dvs ?? [])
        .map((id) => {
            const n = nodeById.get(id);
            return `<a class="chip chip--dv" href="../traceability/?focus=${id}">${id} — ${escape(n?.name?.replace(/^DV\d — /, "") ?? "")}</a>`;
        })
        .join("");

    const litList = (origin.literature ?? [])
        .map((id) => {
            const l = litById.get(id);
            if (!l) return "";
            return `
                <li>
                    <a href="${escape(l.url)}" target="_blank" rel="noopener noreferrer">
                        <strong>${escape(l.short)}</strong> — ${escape(l.title)}
                    </a>
                </li>`;
        })
        .join("");

    return `
        <section class="ocSection ocSection--origin">
            <div class="ocSection__head">
                <span class="ocSection__step">1</span>
                <h3 class="ocSection__title">Herkomst — theorie &amp; deelonderzoek</h3>
            </div>
            <div class="ocSection__body">
                ${origin.rationale ? `<p class="ocSection__lede">${escape(origin.rationale)}</p>` : ""}
                <div class="ocSection__group">
                    <h4>Afgeleid uit</h4>
                    <div class="chipRow">${dvList || `<span class="muted">—</span>`}</div>
                </div>
                ${
                    litList
                        ? `<div class="ocSection__group">
                            <h4>Literatuur</h4>
                            <ul class="ocLit">${litList}</ul>
                          </div>`
                        : ""
                }
            </div>
        </section>`;
}

function renderOperational(op) {
    if (!op) return "";
    const renderGroup = (label, ids, cssClass) => {
        if (!ids?.length) return "";
        const chips = ids
            .map((id) => {
                const n = nodeById.get(id);
                const prio = n?.priority
                    ? ` <span class="badge badge--${n.priority.toLowerCase()}">${n.priority}</span>`
                    : "";
                return `<a class="chip ${cssClass}" href="../traceability/?focus=${id}">${id} — ${escape(n?.name ?? "")}${prio}</a>`;
            })
            .join("");
        return `
            <div class="ocSection__group">
                <h4>${label}</h4>
                <div class="chipRow">${chips}</div>
            </div>`;
    };

    return `
        <section class="ocSection ocSection--op">
            <div class="ocSection__head">
                <span class="ocSection__step">2</span>
                <h3 class="ocSection__title">Operationalisatie — requirements</h3>
            </div>
            <div class="ocSection__body">
                ${renderGroup("Functionele requirements (FR)", op.fr, "chip--fr")}
                ${renderGroup("Niet-functionele (NFR)", op.nfr, "chip--nfr")}
                ${renderGroup("Constraints", op.c, "chip--c")}
            </div>
        </section>`;
}

function renderCompliance(list) {
    if (!list?.length) return "";
    const items = list
        .map(
            (c) =>
                `<li><strong>${escape(c.norm)}</strong> — ${escape(c.scope)}</li>`
        )
        .join("");
    return `
        <section class="ocSection ocSection--norm">
            <div class="ocSection__head">
                <span class="ocSection__step">3</span>
                <h3 class="ocSection__title">Normatieve verankering</h3>
            </div>
            <div class="ocSection__body">
                <ul class="ocNorm">${items}</ul>
            </div>
        </section>`;
}

function renderImplementation(list) {
    if (!list?.length) return "";
    const items = list
        .map(
            (i) => `
                <li>
                    <code class="ocImpl__module">${escape(i.module)}</code>
                    <span class="ocImpl__lines">${escape(i.lines)}</span>
                </li>`
        )
        .join("");
    return `
        <section class="ocSection ocSection--impl">
            <div class="ocSection__head">
                <span class="ocSection__step">4</span>
                <h3 class="ocSection__title">Implementatie — MVP-modules</h3>
            </div>
            <div class="ocSection__body">
                <ul class="ocImpl">${items}</ul>
            </div>
        </section>`;
}

function renderValidation(v) {
    if (!v) return "";
    const tests = (v.tests ?? [])
        .map(
            (t) => `
                <li class="ocTest ocTest--${escape(t.type)}">
                    <div class="ocTest__name">${escape(t.name)}</div>
                    <div class="ocTest__result">${escape(t.result)}</div>
                    <span class="badge badge--id ocTest__type">${escape(t.type)}</span>
                </li>`
        )
        .join("");

    const risks = (v.mitigatesRisks ?? [])
        .map((id) => {
            const n = nodeById.get(id);
            return `<a class="chip chip--r" href="../traceability/?focus=${id}">${id} — ${escape(n?.name ?? "")}</a>`;
        })
        .join("");

    return `
        <section class="ocSection ocSection--val">
            <div class="ocSection__head">
                <span class="ocSection__step">5</span>
                <h3 class="ocSection__title">Validatie — tests &amp; evaluatie</h3>
            </div>
            <div class="ocSection__body">
                <ul class="ocTests">${tests}</ul>
                ${
                    v.evalRef
                        ? `<p class="ocEvalRef"><b>Evaluatie-referentie:</b> ${escape(v.evalRef)}</p>`
                        : ""
                }
                ${
                    risks
                        ? `<div class="ocSection__group">
                            <h4>Mitigeert risico</h4>
                            <div class="chipRow">${risks}</div>
                          </div>`
                        : ""
                }
            </div>
        </section>`;
}

// --- Presentation mode (shared with traceability page) ---------------------

function initPresentationMode() {
    const btn = document.getElementById("btnPresent");
    const sync = (on) => {
        document.body.classList.toggle("is-presenting", on);
        btn?.classList.toggle("is-on", on);
        if (btn) btn.textContent = on ? "✖ Stop presentatie" : "▶ Presentatie";
        const p = new URLSearchParams(window.location.search);
        if (on) p.set("present", "1");
        else p.delete("present");
        const q = p.toString();
        history.replaceState(
            null,
            "",
            window.location.pathname + (q ? `?${q}` : "") + window.location.hash
        );
    };
    btn?.addEventListener("click", () =>
        sync(!document.body.classList.contains("is-presenting"))
    );
    window.addEventListener("keydown", (e) => {
        const tag = (e.target?.tagName ?? "").toLowerCase();
        if (tag === "input" || tag === "textarea") return;
        if (e.key === "p" || e.key === "P") sync(!document.body.classList.contains("is-presenting"));
        if (e.key === "Escape" && document.body.classList.contains("is-presenting")) sync(false);
    });
    if (new URLSearchParams(window.location.search).get("present") === "1") sync(true);
}

function escape(s) {
    return String(s ?? "").replace(
        /[&<>"']/g,
        (m) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;",
            })[m]
    );
}
