import { initDiagramPage } from "./shared/diagramPage.js";
import { DIAGRAM } from "./diagram.js";
import { NODE_INFO } from "./nodeInfo.js";
import { initHamburgerNav } from "../scripts/shared/nav.js";
import { initStoryMode } from "../scripts/shared/storyMode.js";
import { initThemeToggle } from "../scripts/shared/themeToggle.js";
import { METRICS } from "./shared/researchMetrics.js";

initDiagramPage({
    diagramText: DIAGRAM,
    nodeInfoMap: NODE_INFO,
    mermaidId: "landingDiagram",
    zoomFactor: 1.75,
    offsetX: 450,
    offsetY: 150,
});

initHamburgerNav();
initThemeToggle();
initStoryMode();

// Sync KPI tiles from central config
document.querySelectorAll("[data-metric]").forEach(el => {
    const key = el.dataset.metric;
    const val = key.split(".").reduce((o, k) => o?.[k], METRICS);
    if (val !== undefined) el.textContent = val;
});
