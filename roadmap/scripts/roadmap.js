/**
 * roadmap.js — Rendert de interactieve ontwikkelroadmap.
 *
 * Leest configuratie uit roadmapData.js en genereert:
 *   1. Fase-banden (phase labels)
 *   2. Versiekaarten met status-indicatie
 *   3. Detail-paneel bij klik op een kaart
 *   4. Scope-grens en huidige-positie-marker
 *   5. Methodologiekoppelingstabel
 *   6. Legenda
 *
 * Alle content is data-driven — nieuwe versies toevoegen door
 * roadmapData.js uit te breiden.
 */

import { PHASES, VERSIONS, SCOPE_BOUNDARY, METHODOLOGY_TABLE } from "../data/roadmapData.js";
import { initHamburgerNav } from "../../scripts/shared/nav.js";
import { initStoryMode } from "../../scripts/shared/storyMode.js";

// ── Theme toggle (reused pattern from other pages) ──
const themeBtn = document.querySelector(".themeToggle");
if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const html = document.documentElement;
        const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
        html.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
    });
}

// ── Init nav + story ──
initHamburgerNav();
initStoryMode();

// ── DOM references ──
const timelineEl = document.getElementById("roadmapTimeline");
const phaseBandsEl = document.getElementById("phaseBands");
const detailEl = document.getElementById("roadmapDetail");
const methodTableBody = document.getElementById("methodTableBody");
const phaseDescRow = document.getElementById("phaseDescRow");
const legendCurrentLabel = document.getElementById("legendCurrentLabel");

// ── Render ──
renderPhaseBands();
renderTimeline();
renderPhaseDescriptions();
renderMethodologyTable();
updateLegend();

// ═══════════════════════════════════════════════════════════════════
// Phase bands
// ═══════════════════════════════════════════════════════════════════
function renderPhaseBands() {
    if (!phaseBandsEl) return;
    phaseBandsEl.innerHTML = PHASES.map(
        (p) => `
        <div class="rm-phaseBand rm-phaseBand--${p.color}">
            <span class="rm-phaseBand__label">${esc(p.label)}</span>
            <span class="rm-phaseBand__tag">${esc(p.tag)}</span>
        </div>`
    ).join("");
}

// ═══════════════════════════════════════════════════════════════════
// Timeline cards
// ═══════════════════════════════════════════════════════════════════
function renderTimeline() {
    if (!timelineEl) return;

    // Group versions by phase
    const groups = new Map();
    for (const p of PHASES) groups.set(p.id, []);
    for (const v of VERSIONS) {
        const arr = groups.get(v.phase);
        if (arr) arr.push(v);
    }

    let html = "";

    // Phase columns
    for (const p of PHASES) {
        const versions = groups.get(p.id) ?? [];
        const colCls = `rm-phaseCol rm-phaseCol--${p.color}`;
        html += `<div class="${colCls}" data-count="${versions.length}">`;
        for (const v of versions) {
            html += renderCard(v, p);
        }
        html += `</div>`;
    }

    // Scope boundary line
    html += `<div class="rm-scopeLine" aria-hidden="true">
        <span class="rm-scopeLine__label">Scopegrens onderzoek</span>
    </div>`;

    // Current position marker
    const currentVersion = VERSIONS.find((v) => v.current);
    if (currentVersion) {
        html += `<div class="rm-currentMarker" aria-hidden="true">
            <span class="rm-currentMarker__label">Huidige positie · ${esc(currentVersion.version)}</span>
        </div>`;
    }

    timelineEl.innerHTML = html;

    // Bind card clicks
    timelineEl.querySelectorAll(".rm-card").forEach((card) => {
        card.addEventListener("click", () => showDetail(card.dataset.id));
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                showDetail(card.dataset.id);
            }
        });
    });
}

function renderCard(v, phase) {
    const statusCls = `rm-card--${v.status}`;
    const currentCls = v.current ? "rm-card--highlight" : "";
    const phaseColor = `rm-card--${phase.color}`;
    const dateHtml = v.week
        ? `${esc(v.period)}<br/>${esc(v.week)}`
        : esc(v.period);
    const statusIcon = getStatusIcon(v.status);

    return `
    <div class="rm-card ${statusCls} ${currentCls} ${phaseColor}"
         data-id="${esc(v.id)}" tabindex="0" role="button"
         aria-label="${esc(v.version)} — ${esc(v.focus)}">
        <div class="rm-card__head">
            <span class="rm-card__version">${esc(v.version)}</span>
            <span class="rm-card__status">${statusIcon}</span>
        </div>
        <div class="rm-card__date">${dateHtml}</div>
        <div class="rm-card__focus">${esc(v.focus)}</div>
        <div class="rm-card__val">${esc(v.validationGoal)}</div>
        <ul class="rm-card__bullets">
            ${v.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}
        </ul>
        ${v.ocLinks.length ? `<div class="rm-card__ocs">${v.ocLinks.map((oc) => `<span class="rm-ocChip">${esc(oc)}</span>`).join("")}</div>` : ""}
    </div>`;
}

function getStatusIcon(status) {
    switch (status) {
        case "done": return `<span class="rm-statusBadge rm-statusBadge--done" title="Afgerond">&#10003;</span>`;
        case "current": return `<span class="rm-statusBadge rm-statusBadge--current" title="Huidige versie">&#9679;</span>`;
        case "next": return `<span class="rm-statusBadge rm-statusBadge--next" title="Volgende iteratie">&#9654;</span>`;
        case "future": return `<span class="rm-statusBadge rm-statusBadge--future" title="Toekomstig">&#9675;</span>`;
        default: return "";
    }
}

// ═══════════════════════════════════════════════════════════════════
// Phase descriptions
// ═══════════════════════════════════════════════════════════════════
function renderPhaseDescriptions() {
    if (!phaseDescRow) return;
    phaseDescRow.innerHTML = PHASES.map(
        (p) => `<div class="rm-phaseDesc rm-phaseDesc--${p.color}"><b>${esc(p.description.split(".")[0])}.</b> ${esc(p.description.split(".").slice(1).join(".").trim())}</div>`
    ).join("");
}

// ═══════════════════════════════════════════════════════════════════
// Detail panel
// ═══════════════════════════════════════════════════════════════════
function showDetail(id) {
    const v = VERSIONS.find((x) => x.id === id);
    if (!v || !detailEl) return;
    const phase = PHASES.find((p) => p.id === v.phase);

    detailEl.querySelector(".rm-detail__version").textContent = v.version;
    detailEl.querySelector(".rm-detail__phase").textContent = phase?.label ?? "";
    detailEl.querySelector(".rm-detail__focus").textContent = v.focus;

    let bodyHtml = `<p>${esc(v.detail)}</p>`;
    bodyHtml += `<div class="rm-detail__meta">
        <div><b>Validatiedoel</b> ${esc(v.validationGoal)}</div>
        <div><b>Onderzoeksvraag</b> ${esc(v.researchQuestion)}</div>
        <div><b>Fase</b> ${esc(v.researchPhase)}</div>
        ${v.testCount ? `<div><b>Tests</b> ${v.testCount} MSTest-cases</div>` : ""}
    </div>`;
    if (v.ocLinks.length) {
        bodyHtml += `<div class="rm-detail__ocs">${v.ocLinks.map(
            (oc) => `<a href="/digitalportfolio/oc/?id=${esc(oc)}" class="rm-ocChip rm-ocChip--link">${esc(oc)}</a>`
        ).join("")}</div>`;
    }

    detailEl.querySelector(".rm-detail__body").innerHTML = bodyHtml;
    detailEl.classList.add("is-open");
    detailEl.setAttribute("aria-hidden", "false");
}

function hideDetail() {
    if (!detailEl) return;
    detailEl.classList.remove("is-open");
    detailEl.setAttribute("aria-hidden", "true");
}

detailEl?.querySelector(".rm-detail__close")?.addEventListener("click", hideDetail);
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && detailEl?.classList.contains("is-open")) hideDetail();
});

// ═══════════════════════════════════════════════════════════════════
// Methodology table
// ═══════════════════════════════════════════════════════════════════
function renderMethodologyTable() {
    if (!methodTableBody) return;
    methodTableBody.innerHTML = METHODOLOGY_TABLE.map((row) => {
        const v = VERSIONS.find((x) => x.version === row.version);
        const statusCls = v ? `rm-methodRow--${v.status}` : "";
        return `<tr class="${statusCls}">
            <td class="rm-methodVer">${esc(row.version)}</td>
            <td>${esc(row.phase)}</td>
            <td>${esc(row.question)}</td>
        </tr>`;
    }).join("");
}

// ═══════════════════════════════════════════════════════════════════
// Legend
// ═══════════════════════════════════════════════════════════════════
function updateLegend() {
    const cur = VERSIONS.find((v) => v.current);
    if (legendCurrentLabel && cur) {
        legendCurrentLabel.textContent = `Huidige positie (${cur.version})`;
    }
}

// ═══════════════════════════════════════════════════════════════════
// Filter buttons
// ═══════════════════════════════════════════════════════════════════
document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;
        // Toggle active state
        document.querySelectorAll("[data-filter]").forEach((b) =>
            b.classList.toggle("is-active", b.dataset.filter === filter && !btn.classList.contains("is-active"))
        );
        const isActive = btn.classList.contains("is-active");

        // Filter cards
        timelineEl?.querySelectorAll(".rm-card").forEach((card) => {
            if (!isActive) {
                card.classList.remove("rm-card--dimmed");
            } else {
                const id = card.dataset.id;
                const v = VERSIONS.find((x) => x.id === id);
                card.classList.toggle("rm-card--dimmed", v?.status !== filter);
            }
        });
    });
});

// ═══════════════════════════════════════════════════════════════════
// Helper
// ═══════════════════════════════════════════════════════════════════
function esc(s) {
    return String(s ?? "").replace(
        /[&<>"']/g,
        (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[m]
    );
}
