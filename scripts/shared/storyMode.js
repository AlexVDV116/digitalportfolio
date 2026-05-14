import { STORY_SCENES } from "./storyScenes.js";

/**
 * Geleide flow door het portfolio.
 *
 * Activatie:
 *   - via URL ?story=1 (start scène 1)
 *   - via knop in topbar (id=btnStory)
 *
 * Navigatie:
 *   ←  Esc  →  spatie / Enter  → volgende scène
 *
 * De overlay wordt per scène hertoond door alle pagina's die dit script
 * importeren. Story-index wordt in de URL bewaard (`?story=N`) en op
 * navigatie naar de volgende scène doorgegeven.
 *
 * Portfolio-base detectie: GitHub Pages serveert onder
 * `/digitalportfolio/`, lokaal onder `/`. De resolver kiest automatisch.
 */

const OVERLAY_ID = "storyOverlay";
const PORTFOLIO_BASE = location.pathname.startsWith("/digitalportfolio/")
    ? "/digitalportfolio/"
    : "/";

let overlayEl = null;
let activeScene = null;

export function initStoryMode() {
    bindButton();
    const params = new URLSearchParams(window.location.search);
    const idx = parseInt(params.get("story") ?? "", 10);
    if (!Number.isNaN(idx) && idx >= 1 && idx <= STORY_SCENES.length) {
        renderOverlay(idx - 1);
    }
    bindKeys();
}

function bindButton() {
    const btn = document.getElementById("btnStory");
    if (!btn) return;
    btn.addEventListener("click", () => start());
}

function bindKeys() {
    window.addEventListener("keydown", (e) => {
        const tag = (e.target?.tagName ?? "").toLowerCase();
        if (tag === "input" || tag === "textarea") return;

        if (!isActive()) return;

        if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
            e.preventDefault();
            next();
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            prev();
        } else if (e.key === "Escape") {
            e.preventDefault();
            stop();
        }
    });
}

function isActive() {
    return Boolean(overlayEl);
}

function start() {
    goToScene(0);
}

function next() {
    if (!activeScene) return;
    const i = STORY_SCENES.findIndex((s) => s.id === activeScene.id);
    if (i < 0) return;
    const ni = i + 1;
    if (ni >= STORY_SCENES.length) {
        stop();
        return;
    }
    goToScene(ni);
}

function prev() {
    if (!activeScene) return;
    const i = STORY_SCENES.findIndex((s) => s.id === activeScene.id);
    if (i <= 0) return;
    goToScene(i - 1);
}

function stop() {
    overlayEl?.remove();
    overlayEl = null;
    activeScene = null;
    const params = new URLSearchParams(window.location.search);
    params.delete("story");
    const q = params.toString();
    history.replaceState(
        null,
        "",
        window.location.pathname + (q ? `?${q}` : "") + window.location.hash
    );
}

function goToScene(idx) {
    const scene = STORY_SCENES[idx];
    if (!scene) return;

    const targetUrl = buildSceneUrl(scene, idx);
    const cur = window.location.pathname;
    const target = new URL(targetUrl, window.location.origin);

    if (target.pathname === cur || pathEquivalent(target.pathname, cur)) {
        // Same page — just update query/hash + redraw overlay
        const prevSearch = window.location.search; // capture BEFORE replaceState
        const newSearch = target.search;
        const newHash = target.hash;
        history.replaceState(null, "", target.pathname + newSearch + newHash);
        // Trigger any same-page scroll
        if (newHash) {
            const el = document.querySelector(newHash);
            el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        renderOverlay(idx);
        // If the page has query-driven views (graph presets etc.), force a soft reload
        // for pages where state isn't tracked via JS event listeners.
        maybeApplyQueryState(target, prevSearch);
    } else {
        // Different page — navigate. The destination page will pick up ?story=N
        window.location.href = target.pathname + target.search + target.hash;
    }
}

function pathEquivalent(a, b) {
    const norm = (p) => p.replace(/index\.html$/, "").replace(/\/+$/, "/");
    return norm(a) === norm(b);
}

function buildSceneUrl(scene, idx) {
    // Compose absolute URL: <origin><portfolio-base><scene-path>
    const path = scene.path ?? scene.url ?? "";
    const full = PORTFOLIO_BASE + path.replace(/^\//, "");
    const u = new URL(full, window.location.origin);
    u.searchParams.set("story", String(idx + 1));
    return u.toString();
}

function renderOverlay(idx) {
    activeScene = STORY_SCENES[idx] ?? null;
    if (!activeScene) {
        overlayEl?.remove();
        overlayEl = null;
        return;
    }
    if (!overlayEl) {
        overlayEl = document.createElement("aside");
        overlayEl.id = OVERLAY_ID;
        overlayEl.className = "storyOverlay";
        overlayEl.setAttribute("role", "region");
        overlayEl.setAttribute("aria-label", "Verdedigings-tour");
        document.body.appendChild(overlayEl);
        document.body.classList.add("has-story");
    }
    const total = STORY_SCENES.length;
    overlayEl.innerHTML = `
        <div class="storyOverlay__progress" aria-hidden="true">
            ${STORY_SCENES.map(
                (_, i) =>
                    `<span class="storyOverlay__dot ${i === idx ? "is-active" : i < idx ? "is-done" : ""}"></span>`
            ).join("")}
        </div>
        <div class="storyOverlay__main">
            <div class="storyOverlay__chapter">${escape(activeScene.chapter)} — scène ${idx + 1}/${total}</div>
            <h3 class="storyOverlay__title">${escape(activeScene.title)}</h3>
            <p class="storyOverlay__narration">${escape(activeScene.narration)}</p>
        </div>
        <div class="storyOverlay__nav">
            <button class="btn" id="storyPrev" type="button" ${idx === 0 ? "disabled" : ""}>← Vorige</button>
            <button class="btn" id="storyNext" type="button">${idx === total - 1 ? "Afronden" : "Volgende →"}</button>
            <button class="btn btn--ghost" id="storyClose" type="button" title="Esc">✕</button>
        </div>`;
    overlayEl.querySelector("#storyPrev")?.addEventListener("click", prev);
    overlayEl.querySelector("#storyNext")?.addEventListener("click", next);
    overlayEl.querySelector("#storyClose")?.addEventListener("click", stop);
}

function maybeApplyQueryState(target, prevSearch) {
    // Some pages read URL state only at boot (e.g. graph readUrlState).
    // For story-internal navigation between scenes that target the SAME page
    // but different query (e.g. graph preset → heatmap on the same /traceability/),
    // we soft-reload so the page picks up the new state cleanly.
    const same = window.location.pathname === target.pathname;
    if (!same) return;
    // Use prevSearch (captured before replaceState) so we detect actual changes.
    const params = new URLSearchParams(prevSearch ?? "");
    const interesting = ["focus", "filter", "preset", "tab", "id"];
    const changed = interesting.some(
        (k) => params.get(k) !== target.searchParams.get(k)
    );
    if (changed) {
        // Defer slightly so the overlay update is visible before the reload jump
        setTimeout(() => window.location.replace(target.pathname + target.search), 60);
    }
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
