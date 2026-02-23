import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";

export function initDiagramPage({
    diagramText,
    nodeInfoMap,
    mermaidId = "diagram",
    zoomFactor = 1.1,
    offsetX = 0,
    offsetY = 0,
    fit = "cover",
    traceTargetId = null,
}) {
    const elMermaid = document.getElementById("mermaid");
    const elTooltip = document.getElementById("tooltip");
    const elCanvas = document.getElementById("canvas");

    const elSideTitle = document.getElementById("sideTitle");
    const elSideDesc = document.getElementById("sideDesc");

    const btnResetView = document.getElementById("btnResetView");
    const btnClear = document.getElementById("btnClear");

    let activeNodeGroup = null;

    // Persistente highlight state
    let activeKey = null; // laatst geklikte node (blijft actief)
    let hoverKey = null; // huidige hover node (heeft prioriteit)

    // Zoom/pan state
    let view = { x: 20, y: 20, scale: 1.0 };
    let isPanning = false;
    let panStart = { x: 0, y: 0, vx: 0, vy: 0 };

    // Trace state
    let traceMode = false;

    mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        securityLevel: "strict",
        flowchart: {
            curve: "linear",
            nodeSpacing: 40,
            rankSpacing: 60,
            padding: 10,
            useMaxWidth: true,
        },
        themeVariables: {
            background: "#ffffff",
            primaryTextColor: "#111827",
            lineColor: "#cbd5e1",
            fontFamily:
                "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        },
    });

    const resolveNodeInfo = (key) => {
        const base = nodeInfoMap[key] ?? {};
        return {
            title: base.title ?? key,
            tooltip:
                base.tooltip ??
                base.desc ??
                "Geen korte beschrijving beschikbaar.",
            desc: base.desc ?? "Geen uitgebreide beschrijving beschikbaar.",
            route: base.route,
        };
    };

    // Bouw een simpele adjacency map (outgoing edges) uit Mermaid source
    function buildOutgoingMap(text) {
        const outgoing = new Map();

        const lines = text
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
            // negeer mermaid meta/defs
            .filter((l) => !l.startsWith("%%"))
            .filter((l) => !l.startsWith("classDef"))
            .filter((l) => !l.startsWith("class "))
            .filter((l) => !l.startsWith("subgraph"))
            .filter((l) => !l.startsWith("end"))
            .filter((l) => !l.startsWith("direction"));

        // Match: A --> B, A -.-> B, A --- B (geen pijl), etc.
        // We pakken alleen relaties met '>' (directed)
        const re =
            /\b([A-Za-z][A-Za-z0-9_]*)\b\s*[-.=]*-+>\s*\b([A-Za-z][A-Za-z0-9_]*)\b/g;

        for (const line of lines) {
            let m;
            while ((m = re.exec(line)) !== null) {
                const from = m[1];
                const to = m[2];
                if (!outgoing.has(from)) outgoing.set(from, new Set());
                outgoing.get(from).add(to);
            }
        }

        return outgoing;
    }

    const outgoingMap = buildOutgoingMap(diagramText);

    function clearHoverHighlight(svgEl) {
        elMermaid.classList.remove("is-hover-mode");

        svgEl
            .querySelectorAll("g.node.is-hover-focus, g.node.is-hover-related")
            .forEach((n) =>
                n.classList.remove("is-hover-focus", "is-hover-related")
            );

        svgEl
            .querySelectorAll("g.edgePath.is-hover-related")
            .forEach((e) => e.classList.remove("is-hover-related"));
    }

    function applyHoverHighlight(svgEl, nodeId) {
        clearHoverHighlight(svgEl);

        if (!nodeId) return;

        elMermaid.classList.add("is-hover-mode");

        // focus node
        const focus = findNodeGroup(svgEl, nodeId);
        if (focus) focus.classList.add("is-hover-focus");

        // 1 stap diep: alleen uitgaande targets
        const next = outgoingMap.get(nodeId);
        if (!next || next.size === 0) return;

        for (const toId of next) {
            const g = findNodeGroup(svgEl, toId);
            if (g) g.classList.add("is-hover-related");

            // optioneel: edge highlight (best-effort)
            const edge = findEdgePathGroup(svgEl, nodeId, toId);
            if (edge) edge.classList.add("is-hover-related");
        }
    }

    function refreshHoverOrActive(svgEl) {
        // hover heeft prioriteit; als er geen hover is, valt hij terug op selectie
        const key = hoverKey || activeKey;
        if (!key) {
            clearHoverHighlight(svgEl);
            return;
        }
        applyHoverHighlight(svgEl, key);
    }

    const extractTraceSources = (diagramText, targetId) => {
        const re = new RegExp(
            `\\b([A-Za-z][A-Za-z0-9_]*)\\s*-\\.->\\s*${targetId}\\b`,
            "g"
        );
        const sources = new Set();
        let m;
        while ((m = re.exec(diagramText)) !== null) sources.add(m[1]);
        return [...sources];
    };

    // Entry
    (async () => {
        await render();
        wireButtons();
        setSide(
            "Klik op een node",
            "Hover toont een tooltip. Klik toont details (of navigeert)."
        );
    })();

    async function render() {
        const { svg } = await mermaid.render(mermaidId, diagramText);
        elMermaid.innerHTML = svg;

        const svgEl = elMermaid.querySelector("svg");
        if (!svgEl) throw new Error("Mermaid did not render an SVG element.");

        wrapSvgForPanZoom(svgEl);
        wireInteractivity(svgEl);
        wirePanZoom(svgEl);

        requestAnimationFrame(() =>
            requestAnimationFrame(() => fitToView(svgEl))
        );
    }

    function wireButtons() {
        btnClear?.addEventListener("click", () => {
            setTraceMode(false);
            setActiveNode(null);

            activeKey = null;
            hoverKey = null;

            const svgEl = elMermaid.querySelector("svg");
            if (svgEl) clearHoverHighlight(svgEl);

            setSide(
                "Klik op een node",
                "Hover toont een tooltip. Klik toont details (of navigeert)."
            );
        });

        btnResetView?.addEventListener("click", () => {
            const svg = elMermaid.querySelector("svg");
            if (svg) fitToView(svg);
        });
    }

    function wireInteractivity(svgEl) {
        const nodeGroups = svgEl.querySelectorAll("g.node");

        nodeGroups.forEach((g) => {
            const key = getNodeKey(g);
            if (!key) return;

            const info = resolveNodeInfo(key);
            g.setAttribute("tabindex", "0");

            const hit = ensureHitbox(g);

            hit.addEventListener("pointerover", (e) => {
                showTooltip(info, e);
                hoverKey = key;
                refreshHoverOrActive(svgEl);
            });

            hit.addEventListener("pointermove", (e) => moveTooltip(e));

            hit.addEventListener("pointerleave", () => {
                hideTooltip();
                hoverKey = null;
                refreshHoverOrActive(svgEl); // valt terug op activeKey
            });

            hit.addEventListener("click", () => {
                if (info.route) {
                    const isExternal = /^https?:\/\//i.test(info.route);

                    if (isExternal) {
                        window.open(
                            info.route,
                            "_blank",
                            "noopener,noreferrer"
                        );
                    } else {
                        window.location.href = info.route;
                    }
                    return;
                }

                setActiveNode(g);
                activeKey = key;
                setSide(info.title, info.desc);

                refreshHoverOrActive(svgEl);

                if (traceTargetId && key === traceTargetId) {
                    setTraceMode(!traceMode);
                }
            });

            g.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (info.route) {
                        const isExternal = /^https?:\/\//i.test(info.route);

                        if (isExternal) {
                            window.open(
                                info.route,
                                "_blank",
                                "noopener,noreferrer"
                            );
                        } else {
                            window.location.href = info.route;
                        }
                    } else {
                        setActiveNode(g);
                        activeKey = key;
                        setSide(info.title, info.desc);
                        refreshHoverOrActive(svgEl);
                    }
                }
            });
        });
    }

    function setTraceMode(enabled) {
        if (!traceTargetId) return;

        traceMode = enabled;
        const svgEl = elMermaid.querySelector("svg");
        if (!svgEl) return;

        elMermaid.classList.toggle("is-trace-mode", enabled);

        svgEl
            .querySelectorAll("g.node.is-trace")
            .forEach((n) => n.classList.remove("is-trace"));
        svgEl
            .querySelectorAll("g.edgePath.is-trace")
            .forEach((e) => e.classList.remove("is-trace"));

        if (!enabled) return;

        const sources = extractTraceSources(diagramText, traceTargetId);
        const nodesToHighlight = new Set([traceTargetId, ...sources]);

        for (const id of nodesToHighlight) {
            const node = findNodeGroup(svgEl, id);
            if (node) node.classList.add("is-trace");
        }

        for (const fromId of sources) {
            const edge = findEdgePathGroup(svgEl, fromId, traceTargetId);
            if (edge) edge.classList.add("is-trace");
        }
    }

    function findNodeGroup(svgEl, nodeId) {
        const nodes = svgEl.querySelectorAll("g.node");
        for (const g of nodes) if (getNodeKey(g) === nodeId) return g;
        return null;
    }

    function findEdgePathGroup(svgEl, fromId, toId) {
        const edges = svgEl.querySelectorAll("g.edgePath");
        for (const e of edges) {
            const id = e.getAttribute("id") ?? "";
            if (id.includes(fromId) && id.includes(toId)) return e;
        }
        return null;
    }

    function getNodeKey(nodeGroup) {
        const dataId = nodeGroup.getAttribute("data-id");
        if (dataId && nodeInfoMap[dataId]) return dataId;

        const id = nodeGroup.getAttribute("id") ?? "";

        for (const k of Object.keys(nodeInfoMap)) {
            const re = new RegExp(`(^|[^A-Z0-9])${k}([^A-Z0-9]|$)`);
            if (re.test(id)) return k;
        }

        const m = id.match(
            /(H\d{1,2}|OC|MVP|PL|RM|TM|R0|DOC|PVA|EXEC|REPORT|START|STATUS|REFLECT|MTM|DV\d|ARCH|FUNC|USER|SEC|RISK\d|EVID|ANSWER)/
        );
        return m?.[1] ?? null;
    }

    function ensureHitbox(nodeGroup) {
        let hit = nodeGroup.querySelector(":scope > rect.node-hitbox");
        if (hit) return hit;

        const bbox = nodeGroup.getBBox();

        hit = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        hit.classList.add("node-hitbox");
        hit.setAttribute("x", bbox.x);
        hit.setAttribute("y", bbox.y);
        hit.setAttribute("width", bbox.width);
        hit.setAttribute("height", bbox.height);

        nodeGroup.appendChild(hit);
        return hit;
    }

    function setActiveNode(g) {
        if (activeNodeGroup) activeNodeGroup.classList.remove("is-active");
        activeNodeGroup = g;
        if (activeNodeGroup) activeNodeGroup.classList.add("is-active");
    }

    function setSide(title, desc) {
        if (!elSideTitle || !elSideDesc) return;
        elSideTitle.textContent = title;
        elSideDesc.innerHTML = desc;
    }

    function showTooltip(info, evt) {
        const nodeGroup = evt.currentTarget.closest("g.node");
        let accentColor = null;

        if (nodeGroup) {
            const shape =
                nodeGroup.querySelector("rect:not(.node-hitbox)") ||
                nodeGroup.querySelector("polygon") ||
                nodeGroup.querySelector("path");
            if (shape) accentColor = getComputedStyle(shape).stroke;
        }

        elTooltip.innerHTML = `
      <div class="tooltip__title">${escapeHtml(info.title)}</div>
      <div class="tooltip__desc">${escapeHtml(info.tooltip)}</div>
    `;

        if (accentColor)
            elTooltip.style.setProperty("--tooltip-accent", accentColor);
        else elTooltip.style.removeProperty("--tooltip-accent");

        elTooltip.style.display = "block";
        elTooltip.setAttribute("aria-hidden", "false");
        moveTooltip(evt);
    }

    function moveTooltip(evt) {
        const rect = elCanvas.getBoundingClientRect();
        const x = evt.clientX - rect.left + elCanvas.scrollLeft;
        const y = evt.clientY - rect.top + elCanvas.scrollTop;

        // tooltip links van cursor plaatsen (met clamp binnen canvas)
        const tipW = elTooltip.offsetWidth || 260;
        const tipH = elTooltip.offsetHeight || 80;

        const pad = 8;

        let left = x - tipW - 12; // 12px gap
        let top = y + 12;

        // clamp zodat hij niet buiten canvas verdwijnt
        left = Math.max(pad, Math.min(left, elCanvas.scrollWidth - tipW - pad));
        top = Math.max(pad, Math.min(top, elCanvas.scrollHeight - tipH - pad));

        elTooltip.style.left = `${left}px`;
        elTooltip.style.top = `${top}px`;
    }

    function hideTooltip() {
        elTooltip.style.display = "none";
        elTooltip.setAttribute("aria-hidden", "true");
    }

    function escapeHtml(str) {
        return String(str).replace(
            /[&<>"']/g,
            (m) =>
                ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#039;",
                }[m])
        );
    }

    function wrapSvgForPanZoom(svgEl) {
        const wrapper = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g"
        );
        wrapper.setAttribute("id", "panzoom-wrapper");

        const children = [...svgEl.children].filter(
            (c) => c.tagName.toLowerCase() !== "defs"
        );
        children.forEach((c) => wrapper.appendChild(c));
        svgEl.appendChild(wrapper);

        applyView();
    }

    function getWrapper(svgEl) {
        return svgEl.querySelector("#panzoom-wrapper");
    }

    function wirePanZoom(svgEl) {
        const wrapper = getWrapper(svgEl);
        if (!wrapper) return;

        svgEl.addEventListener(
            "wheel",
            (e) => {
                e.preventDefault();

                const delta = -e.deltaY;
                const z = delta > 0 ? 1.08 : 0.92;

                const rect = svgEl.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                const worldX = (mouseX - view.x) / view.scale;
                const worldY = (mouseY - view.y) / view.scale;

                const newScale = clamp(view.scale * z, 0.45, 2.25);

                view.x = mouseX - worldX * newScale;
                view.y = mouseY - worldY * newScale;
                view.scale = newScale;

                applyView();
            },
            { passive: false }
        );

        let spaceDown = false;

        function isTypingOrInteractiveFocus() {
            const el = document.activeElement;
            if (!el) return false;
            const tag = el.tagName?.toLowerCase();
            return (
                tag === "input" ||
                tag === "textarea" ||
                tag === "select" ||
                tag === "button" ||
                el.closest?.("g.node") // focus op mermaid node
            );
        }

        window.addEventListener("keydown", (e) => {
            if (e.code !== "Space") return;
            if (isTypingOrInteractiveFocus()) return;
            spaceDown = true;
        });

        window.addEventListener("keyup", (e) => {
            if (e.code === "Space") spaceDown = false;
        });

        svgEl.addEventListener("mousedown", (e) => {
            const usePan = e.button === 1 || spaceDown;
            if (!usePan) return;

            isPanning = true;
            panStart = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
            svgEl.style.cursor = "grabbing";
        });

        window.addEventListener("mousemove", (e) => {
            if (!isPanning) return;

            view.x = panStart.vx + (e.clientX - panStart.x);
            view.y = panStart.vy + (e.clientY - panStart.y);

            applyView();
        });

        window.addEventListener("mouseup", () => {
            if (!isPanning) return;
            isPanning = false;
            svgEl.style.cursor = "";
        });
    }

    function applyView() {
        const svgEl = elMermaid.querySelector("svg");
        if (!svgEl) return;
        const wrapper = getWrapper(svgEl);
        if (!wrapper) return;

        wrapper.setAttribute(
            "transform",
            `translate(${view.x} ${view.y}) scale(${view.scale})`
        );
    }

    function fitToView(svgEl) {
        const wrapper = getWrapper(svgEl);
        if (!wrapper) return;

        const bbox = wrapper.getBBox();
        const canvasRect = elCanvas.getBoundingClientRect();

        const padding = 24;
        const availableW = Math.max(100, canvasRect.width - padding * 2);
        const availableH = Math.max(100, canvasRect.height - padding * 2);

        const scaleW = availableW / bbox.width;
        const scaleH = availableH / bbox.height;

        const baseScale =
            fit === "contain"
                ? Math.min(scaleW, scaleH)
                : Math.max(scaleW, scaleH);

        const scale = clamp(baseScale * zoomFactor, 0.45, 2.25);

        const x =
            (canvasRect.width - bbox.width * scale) / 2 -
            bbox.x * scale +
            offsetX;

        const y =
            (canvasRect.height - bbox.height * scale) / 2 -
            bbox.y * scale +
            offsetY;

        view = { x, y, scale };
        applyView();
    }

    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }
}
