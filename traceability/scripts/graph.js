import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {
    NODES,
    EDGES,
    NODE_TYPES,
    EDGE_TYPES,
    PRESETS,
} from "../data/graph.js";

/**
 * Mount a D3 force-directed traceability graph into the given host.
 *
 * host    : container element (will be cleared and rendered into)
 * sideEl  : container element for the right-hand detail panel
 *
 * Returns an API with:
 *   focus(id)           — anchor on a node
 *   applyPreset(id)     — apply a saved camera preset
 *   setFilter(types)    — show only these node types
 *   snapshot()          — download current view as PNG
 *   destroy()           — tear down (force sim, listeners)
 */
export function mountGraph({ host, sideEl }) {
    host.innerHTML = "";

    // Build node degree map (size by importance)
    const degreeById = new Map(NODES.map((n) => [n.id, 0]));
    for (const [a, b] of EDGES) {
        degreeById.set(a, (degreeById.get(a) ?? 0) + 1);
        degreeById.set(b, (degreeById.get(b) ?? 0) + 1);
    }
    const minDeg = d3.min([...degreeById.values()]) ?? 1;
    const maxDeg = d3.max([...degreeById.values()]) ?? 6;
    const sizeScale = d3.scaleLinear().domain([minDeg, maxDeg]).range([8, 18]);

    // Working data
    const nodes = NODES.map((n) => ({
        ...n,
        radius: sizeScale(degreeById.get(n.id) ?? 1),
    }));
    const nodeById = new Map(nodes.map((n) => [n.id, n]));

    const links = EDGES.map(([source, target, kind]) => ({
        source,
        target,
        kind,
    })).filter((l) => nodeById.has(l.source) && nodeById.has(l.target));

    // Adjacency for hover/focus highlighting
    const neighborsById = new Map();
    const incidentLinksById = new Map();
    for (const n of nodes) {
        neighborsById.set(n.id, new Set());
        incidentLinksById.set(n.id, new Set());
    }
    for (const l of links) {
        neighborsById.get(l.source).add(l.target);
        neighborsById.get(l.target).add(l.source);
        incidentLinksById.get(l.source).add(l);
        incidentLinksById.get(l.target).add(l);
    }

    // ---- Toolbar (filter chips + search + presets + snapshot + reset) ----
    const toolbar = document.createElement("div");
    toolbar.className = "graphToolbar";

    const typeChips = Object.values(NODE_TYPES);
    let activeTypes = new Set(typeChips.map((t) => t.id));

    const chipGroup = document.createElement("div");
    chipGroup.className = "graphToolbar__group";
    chipGroup.innerHTML = `<span class="graphToolbar__label">Toon</span>`;
    for (const t of typeChips) {
        const count = nodes.filter((n) => n.type === t.id).length;
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip is-active";
        chip.dataset.type = t.id;
        chip.innerHTML = `<span class="chip__dot" style="background:${t.fill};border-color:${t.color}"></span>${t.label}<span class="chip__count">${count}</span>`;
        chip.addEventListener("click", () => {
            if (activeTypes.has(t.id)) {
                activeTypes.delete(t.id);
                chip.classList.add("is-off");
                chip.classList.remove("is-active");
            } else {
                activeTypes.add(t.id);
                chip.classList.remove("is-off");
                chip.classList.add("is-active");
            }
            applyVisibility();
            writeUrlState();
        });
        chipGroup.appendChild(chip);
    }
    toolbar.appendChild(chipGroup);

    const presetGroup = document.createElement("div");
    presetGroup.className = "graphToolbar__group";
    presetGroup.innerHTML = `<span class="graphToolbar__label">Preset</span>`;
    for (const p of PRESETS) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tab";
        btn.textContent = p.title;
        btn.title = p.desc;
        btn.dataset.preset = p.id;
        btn.addEventListener("click", () => applyPreset(p.id));
        presetGroup.appendChild(btn);
    }
    toolbar.appendChild(presetGroup);

    const searchGroup = document.createElement("div");
    searchGroup.className = "graphToolbar__group";
    searchGroup.innerHTML = `<span class="graphToolbar__label">Zoek</span>`;
    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.placeholder = "bijv. OC-4, FR-5, R8…";
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const match = findNode(searchInput.value.trim());
            if (match) focusOn(match.id);
        }
    });
    searchGroup.appendChild(searchInput);
    toolbar.appendChild(searchGroup);

    const actionsGroup = document.createElement("div");
    actionsGroup.className = "graphToolbar__group";
    const fitBtn = btn("Fit", () => fitToView());
    const clearBtn = btn("Reset", () => {
        clearAnchor();
        activeTypes = new Set(typeChips.map((t) => t.id));
        chipGroup.querySelectorAll(".chip").forEach((c) => {
            c.classList.add("is-active");
            c.classList.remove("is-off");
        });
        applyVisibility();
        fitToView();
        writeUrlState();
    });
    const snapBtn = btn("📸 PNG", () => snapshot());
    actionsGroup.append(fitBtn, clearBtn, snapBtn);
    toolbar.appendChild(actionsGroup);

    host.appendChild(toolbar);

    function btn(label, onClick) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "btn";
        b.textContent = label;
        b.addEventListener("click", onClick);
        return b;
    }

    // ---- Graph SVG ----
    const stage = document.createElement("div");
    stage.className = "graphHost";
    host.appendChild(stage);

    const meta = document.createElement("div");
    meta.className = "graphMeta";
    host.appendChild(meta);

    const legend = document.createElement("div");
    legend.className = "graphLegend";
    legend.innerHTML = typeChips
        .map(
            (t) =>
                `<span class="graphLegend__item"><span class="graphLegend__dot" style="background:${t.fill};border-color:${t.color}"></span>${t.label}</span>`
        )
        .join("");
    legend.innerHTML += `<span class="graphLegend__item">→ relatie • <em>klik node = vasthouden</em> • <em>hover = buren highlighten</em></span>`;
    host.appendChild(legend);

    const width = () => stage.clientWidth || 800;
    const height = () => stage.clientHeight || 600;

    const svg = d3
        .select(stage)
        .append("svg")
        .attr("viewBox", `0 0 ${width()} ${height()}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const defs = svg.append("defs");
    for (const [k, e] of Object.entries(EDGE_TYPES)) {
        defs.append("marker")
            .attr("id", `arrow-${k}`)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 16)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", e.color);
    }

    const zoomLayer = svg.append("g").attr("class", "zoomLayer");
    const linkLayer = zoomLayer.append("g").attr("class", "linkLayer");
    const nodeLayer = zoomLayer.append("g").attr("class", "nodeLayer");

    // ---- Zoom & pan ----
    const zoom = d3
        .zoom()
        .scaleExtent([0.35, 3])
        .on("zoom", (e) => zoomLayer.attr("transform", e.transform))
        .on("start", () => svg.classed("is-grabbing", true))
        .on("end", () => svg.classed("is-grabbing", false));
    svg.call(zoom);

    function fitToView() {
        const W = width();
        const H = height();
        svg.attr("viewBox", `0 0 ${W} ${H}`);
        svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity);
    }

    // ---- Force simulation ----
    const sim = d3
        .forceSimulation(nodes)
        .force(
            "link",
            d3
                .forceLink(links)
                .id((d) => d.id)
                .distance((l) => {
                    if (l.kind === "complies") return 90;
                    if (l.kind === "mitigates") return 80;
                    return 70;
                })
                .strength(0.55)
        )
        .force("charge", d3.forceManyBody().strength(-240))
        .force("center", d3.forceCenter(width() / 2, height() / 2))
        .force(
            "collide",
            d3.forceCollide().radius((d) => d.radius + 6)
        )
        .force("x", d3.forceX(width() / 2).strength(0.04))
        .force("y", d3.forceY(height() / 2).strength(0.04));

    // ---- Links ----
    const link = linkLayer
        .selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "gLink")
        .attr("stroke", (d) => EDGE_TYPES[d.kind]?.color ?? "#cbd5e1")
        .attr("stroke-width", 1.2)
        .attr("marker-end", (d) => `url(#arrow-${d.kind})`);

    // ---- Nodes ----
    const node = nodeLayer
        .selectAll("g.gNode")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "gNode")
        .attr("data-type", (d) => d.type)
        .style("cursor", "pointer")
        .call(
            d3
                .drag()
                .on("start", (e, d) => {
                    if (!e.active) sim.alphaTarget(0.25).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (e, d) => {
                    d.fx = e.x;
                    d.fy = e.y;
                })
                .on("end", (e, d) => {
                    if (!e.active) sim.alphaTarget(0);
                    // keep node pinned where user dropped it; double-click releases
                })
        )
        .on("mouseover", (_, d) => {
            if (anchorId) return;
            highlightNeighborhood(d.id);
            renderDetail(d, /*hover*/ true);
        })
        .on("mouseout", () => {
            if (anchorId) return;
            clearHighlight();
            renderDefault();
        })
        .on("click", (e, d) => {
            e.stopPropagation();
            if (anchorId === d.id) clearAnchor();
            else anchorOn(d.id);
        })
        .on("dblclick", (_, d) => {
            d.fx = null;
            d.fy = null;
            sim.alpha(0.4).restart();
        });

    node.append("circle")
        .attr("r", (d) => d.radius)
        .attr("fill", (d) => NODE_TYPES[d.type].fill)
        .attr("stroke", (d) => NODE_TYPES[d.type].color)
        .attr("stroke-opacity", (d) => (d.status === "ok" ? 1 : 0.95))
        .attr("stroke-dasharray", (d) =>
            d.status === "partial" || d.status === "todo" ? "3 2" : null
        );

    node.append("title").text((d) => `${d.label} — ${d.name}`);

    node.append("text")
        .attr("dy", (d) => d.radius + 11)
        .attr("text-anchor", "middle")
        .text((d) => d.label);

    // Click outside any node = clear anchor
    svg.on("click", () => {
        if (anchorId) clearAnchor();
    });

    sim.on("tick", () => {
        link.attr("d", (d) => {
            const sx = d.source.x;
            const sy = d.source.y;
            const tx = d.target.x;
            const ty = d.target.y;
            // gentle curve = easier to read overlapping edges
            const dx = tx - sx;
            const dy = ty - sy;
            const dr = Math.sqrt(dx * dx + dy * dy) * 1.4;
            return `M${sx},${sy}A${dr},${dr} 0 0,1 ${tx},${ty}`;
        });
        node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // ---- Highlight / anchor logic ----
    let anchorId = null;

    function highlightNeighborhood(id) {
        const neighbors = neighborsById.get(id) ?? new Set();
        const incident = incidentLinksById.get(id) ?? new Set();

        stage.classList.add("is-dim");
        node.classed("gNode--focus", (n) => n.id === id);
        node.classed(
            "gNode--related",
            (n) => n.id !== id && neighbors.has(n.id)
        );
        link.classed("gLink--related", (l) => incident.has(l));
    }

    function clearHighlight() {
        stage.classList.remove("is-dim");
        node.classed("gNode--focus", false).classed("gNode--related", false);
        link.classed("gLink--related", false);
    }

    function anchorOn(id) {
        anchorId = id;
        highlightNeighborhood(id);
        const n = nodeById.get(id);
        if (n) renderDetail(n, /*hover*/ false);
        writeUrlState();
        // soft camera move: re-center on node at current zoom
        centerOnNode(id);
    }

    function clearAnchor() {
        anchorId = null;
        clearHighlight();
        renderDefault();
        writeUrlState();
    }

    function focusOn(id) {
        const n = nodeById.get(id);
        if (!n) return;
        // ensure node's type is visible
        if (!activeTypes.has(n.type)) {
            activeTypes.add(n.type);
            chipGroup
                .querySelector(`.chip[data-type="${n.type}"]`)
                ?.classList.add("is-active");
            chipGroup
                .querySelector(`.chip[data-type="${n.type}"]`)
                ?.classList.remove("is-off");
            applyVisibility();
        }
        anchorOn(id);
    }

    function centerOnNode(id) {
        const n = nodeById.get(id);
        if (!n || n.x == null || n.y == null) return;
        const W = width();
        const H = height();
        // current zoom transform
        const currentT = d3.zoomTransform(svg.node());
        const k = Math.max(0.9, currentT.k); // don't zoom out
        const tx = W / 2 - n.x * k;
        const ty = H / 2 - n.y * k;
        svg.transition()
            .duration(450)
            .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(k));
    }

    function findNode(query) {
        if (!query) return null;
        const q = query.toLowerCase();
        // exact match first
        return (
            nodes.find((n) => n.id.toLowerCase() === q) ||
            nodes.find((n) => n.label.toLowerCase() === q) ||
            nodes.find((n) => n.id.toLowerCase().includes(q)) ||
            nodes.find((n) => n.name.toLowerCase().includes(q))
        );
    }

    // ---- Visibility / filter ----
    function applyVisibility() {
        node.style("display", (n) => (activeTypes.has(n.type) ? null : "none"));
        link.style("display", (l) =>
            activeTypes.has(l.source.type ?? nodeById.get(l.source).type) &&
            activeTypes.has(l.target.type ?? nodeById.get(l.target).type)
                ? null
                : "none"
        );
        updateMeta();
    }

    function updateMeta() {
        const visibleNodes = nodes.filter((n) => activeTypes.has(n.type));
        const visibleEdges = links.filter(
            (l) =>
                activeTypes.has(l.source.type ?? nodeById.get(l.source).type) &&
                activeTypes.has(l.target.type ?? nodeById.get(l.target).type)
        );
        const byType = Object.fromEntries(
            typeChips.map((t) => [
                t.label,
                visibleNodes.filter((n) => n.type === t.id).length,
            ])
        );
        meta.innerHTML =
            `<span><strong>${visibleNodes.length}</strong> nodes</span>` +
            `<span><strong>${visibleEdges.length}</strong> relaties</span>` +
            Object.entries(byType)
                .filter(([, c]) => c > 0)
                .map(
                    ([k, c]) =>
                        `<span style="opacity:.8">${k}: <strong>${c}</strong></span>`
                )
                .join("");
    }

    function applyPreset(id) {
        const p = PRESETS.find((x) => x.id === id);
        if (!p) return;
        activeTypes = new Set(p.types);
        chipGroup.querySelectorAll(".chip").forEach((c) => {
            const on = activeTypes.has(c.dataset.type);
            c.classList.toggle("is-active", on);
            c.classList.toggle("is-off", !on);
        });
        applyVisibility();
        if (p.focus) focusOn(p.focus);
        else clearAnchor();
        // re-energise the layout so things spread nicely
        sim.alpha(0.6).restart();
        fitToView();
        writeUrlState(id);
    }

    function setFilter(types) {
        activeTypes = new Set(types);
        chipGroup.querySelectorAll(".chip").forEach((c) => {
            const on = activeTypes.has(c.dataset.type);
            c.classList.toggle("is-active", on);
            c.classList.toggle("is-off", !on);
        });
        applyVisibility();
    }

    // ---- Side detail panel ----
    function renderDefault() {
        const total = nodes.length;
        const okCount = nodes.filter((n) => n.status === "ok").length;
        sideEl.innerHTML = `
            <div class="card">
                <div class="card__title">Traceability graph</div>
                <div class="card__desc">
                    <p>${total} entiteiten, ${links.length} relaties.
                    ${okCount} entiteiten met status <em>Ja / Gemitigeerd / Done</em>.</p>
                    <p style="margin:8px 0 0;color:var(--muted)">
                    <b>Hover</b> = buren highlighten •
                    <b>Klik</b> = vastzetten •
                    <b>Sleep</b> = node verplaatsen •
                    <b>Dubbelklik</b> = node loslaten.</p>
                </div>
            </div>`;
    }

    function renderDetail(n, isHover) {
        const t = NODE_TYPES[n.type];
        const status = STATUS_LABEL[n.status] ?? "";
        const statusClass = STATUS_BADGE[n.status] ?? "";
        const prioPill = n.priority
            ? `<span class="badge badge--${n.priority.toLowerCase()}">${
                  n.priority
              }</span>`
            : "";

        const incoming = links
            .filter((l) => l.target.id === n.id || l.target === n.id)
            .map((l) => ({
                other: nodeById.get(l.source.id ?? l.source),
                kind: l.kind,
                direction: "in",
            }));
        const outgoing = links
            .filter((l) => l.source.id === n.id || l.source === n.id)
            .map((l) => ({
                other: nodeById.get(l.target.id ?? l.target),
                kind: l.kind,
                direction: "out",
            }));

        const groupByKind = (arr, dir) => {
            const m = new Map();
            for (const r of arr) {
                const key = `${r.kind}-${dir}`;
                if (!m.has(key))
                    m.set(key, { kind: r.kind, items: [], direction: dir });
                m.get(key).items.push(r.other);
            }
            return [...m.values()];
        };

        const inGroups = groupByKind(incoming, "in");
        const outGroups = groupByKind(outgoing, "out");

        const relationsHtml = [...inGroups, ...outGroups]
            .map((g) => {
                const verb = relationVerb(g.kind, g.direction);
                const items = g.items
                    .map(
                        (o) =>
                            `<li><a href="#" data-jump="${o.id}"><strong>${
                                o.label
                            }</strong> — ${escape(o.name)}</a></li>`
                    )
                    .join("");
                return `<p style="margin:8px 0 4px"><b>${verb}</b></p><ul class="sideDetail__list">${items}</ul>`;
            })
            .join("");

        sideEl.innerHTML = `
            <div class="card">
                <div class="card__title">
                    <span class="badge badge--id" style="color:${
                        t.color
                    };border-color:${t.color}">${escape(n.label)}</span>
                    ${prioPill}
                    ${
                        status
                            ? `<span class="badge ${statusClass}" style="margin-left:6px">${status}</span>`
                            : ""
                    }
                </div>
                <div class="sideDetail__row" style="margin-top:6px">
                    <span style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.4px">${
                        t.label
                    }</span>
                </div>
                <div class="card__desc">
                    <p style="font-weight:600;color:var(--ink)">${escape(
                        n.name
                    )}</p>
                    ${n.desc ? `<p>${escape(n.desc)}</p>` : ""}
                </div>
                ${
                    relationsHtml ||
                    `<div class="sideDetail__meta">Geen uitgaande/inkomende relaties.</div>`
                }
                <div class="sideDetail__meta">
                    ${
                        isHover
                            ? "💡 klik om vast te zetten"
                            : `📌 vastgezet — klik elders om los te laten`
                    }
                </div>
            </div>`;

        // wire up jump links
        sideEl.querySelectorAll("a[data-jump]").forEach((a) => {
            a.addEventListener("click", (e) => {
                e.preventDefault();
                focusOn(a.dataset.jump);
            });
        });
    }

    function relationVerb(kind, dir) {
        const e = EDGE_TYPES[kind]?.label ?? kind;
        if (dir === "out") {
            return `${capitalize(e)} →`;
        }
        return `← ${capitalize(e)} (vanuit)`;
    }
    function capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
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
                }[m])
        );
    }

    // ---- Snapshot to PNG ----
    function snapshot() {
        const svgNode = svg.node();
        const W = svgNode.clientWidth;
        const H = svgNode.clientHeight;
        const xml = new XMLSerializer().serializeToString(svgNode);
        const svgBlob = new Blob([xml], {
            type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const scale = 2;
            canvas.width = W * scale;
            canvas.height = H * scale;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.scale(scale, scale);
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            canvas.toBlob((blob) => {
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `traceability-graph-${anchorId ?? "all"}.png`;
                a.click();
                setTimeout(() => URL.revokeObjectURL(a.href), 1000);
            });
        };
        img.src = url;
    }

    // ---- URL state (deep links) ----
    function writeUrlState(presetId) {
        const params = new URLSearchParams(window.location.search);
        if (anchorId) params.set("focus", anchorId);
        else params.delete("focus");
        const allOn = typeChips.every((t) => activeTypes.has(t.id));
        if (allOn) params.delete("filter");
        else params.set("filter", [...activeTypes].join(","));
        if (presetId) params.set("preset", presetId);
        else params.delete("preset");
        const q = params.toString();
        history.replaceState(
            null,
            "",
            window.location.pathname + (q ? `?${q}` : "") + window.location.hash
        );
    }

    function readUrlState() {
        const params = new URLSearchParams(window.location.search);
        const filter = params.get("filter");
        if (filter) {
            const wanted = new Set(filter.split(",").filter(Boolean));
            if (wanted.size) setFilter(wanted);
        }
        const preset = params.get("preset");
        if (preset) {
            applyPreset(preset);
            return;
        }
        const focus = params.get("focus");
        if (focus && nodeById.has(focus)) {
            // wait one tick for the sim to settle a little
            setTimeout(() => focusOn(focus), 250);
        }
    }

    // ---- Init ----
    renderDefault();
    applyVisibility();
    readUrlState();

    // Resize handling
    const ro = new ResizeObserver(() => {
        svg.attr("viewBox", `0 0 ${width()} ${height()}`);
        sim.force("center", d3.forceCenter(width() / 2, height() / 2));
        sim.alpha(0.2).restart();
    });
    ro.observe(stage);

    return {
        focus: focusOn,
        applyPreset,
        setFilter,
        snapshot,
        destroy() {
            sim.stop();
            ro.disconnect();
            host.innerHTML = "";
        },
    };
}

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
