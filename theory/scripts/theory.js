import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {
    sankey,
    sankeyLinkHorizontal,
} from "https://cdn.jsdelivr.net/npm/d3-sankey@0.12/+esm";

import { LITERATURE } from "./data/literature.js";
import { THEORY_MAP } from "./data/theoryMap.js";
import { initHamburgerNav } from "../../scripts/shared/nav.js";

const elSideTitle = document.getElementById("sideTitle");
const elSideDesc = document.getElementById("sideDesc");
const btnReset = document.getElementById("btnResetView");
const btnClear = document.getElementById("btnClear");

const litById = new Map(LITERATURE.map((x) => [x.id, x]));

let locked = null; // { type: 'venn'|'sankey', id: '...' }

init();

function init() {
    renderVenn();
    renderSankey();

    btnClear?.addEventListener("click", () => {
        locked = null;
        clearAllHighlights();
        setSide(
            "Selecteer een element",
            "Hover toont highlight. Klik “lockt” de selectie zodat je erover kunt toelichten."
        );
    });

    btnReset?.addEventListener("click", () => {
        // simpel reset = clear
        locked = null;
        clearAllHighlights();
    });

    setSide(
        "Selecteer een element",
        "Hover toont highlight. Klik “lockt” de selectie zodat je erover kunt toelichten."
    );
}

function setSide(title, html) {
    elSideTitle.textContent = title;
    elSideDesc.innerHTML = html;
}

function tagsHtml(dvs = [], ocs = []) {
    const dvTags = dvs
        .map((d) => `<span class="tag">${escapeHtml(d)}</span>`)
        .join("");
    const ocTags = ocs
        .map((o) => `<span class="tag">${escapeHtml(o)}</span>`)
        .join("");
    return `
    <div class="tagRow">${dvTags}${ocTags}</div>
  `;
}

function sourcesHtml(sourceIds = []) {
    if (!sourceIds.length) return "";
    const items = sourceIds
        .map((id) => litById.get(id))
        .filter(Boolean)
        .map((x) => `<li>${escapeHtml(x.short)}</li>`)
        .join("");
    return `<p><b>Bronnen</b></p><ul>${items}</ul>`;
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

function clearAllHighlights() {
    d3.select("#vennSvg").classed("vizDim", false);
    d3.select("#sankeySvg").classed("vizDim", false);

    d3.selectAll("#vennSvg .node")
        .classed("isFocus", false)
        .classed("isRelated", false);
    d3.selectAll("#sankeySvg .node")
        .classed("isFocus", false)
        .classed("isRelated", false);
    d3.selectAll("#sankeySvg .link").classed("isRelated", false);
}

function renderVenn() {
    const svg = d3.select("#vennSvg");
    svg.selectAll("*").remove();

    const w = svg.node().clientWidth || 800;
    const h = parseFloat(svg.style("height")) || 320;

    svg.attr("viewBox", `0 0 ${w} ${h}`);

    // eenvoudige fixed layout (strak, consistent)
    const r = Math.min(w, h) * 0.28;
    const cxA = w * 0.4,
        cyA = h * 0.5;
    const cxB = w * 0.6,
        cyB = h * 0.5;
    const cxC = w * 0.5,
        cyC = h * 0.32;

    const circles = [
        {
            id: "A_LLM",
            label: "Modelgedrag en outputkwaliteit",
            x: cxA,
            y: cyA,
            r,
            fill: "rgba(234,255,242,0.65)",
            stroke: "#1b7f3a",
        },
        {
            id: "B_SECURITY",
            label: "Beveiligingsrisico’s en beheersmaatregelen",
            x: cxB,
            y: cyB,
            r,
            fill: "rgba(254,226,226,0.55)",
            stroke: "#b91c1c",
        },
        {
            id: "C_IDE_HAI",
            label: "Integratie en interactie in de IDE",
            x: cxC,
            y: cyC,
            r,
            fill: "rgba(224,242,254,0.65)",
            stroke: "#0369a1",
        },
    ];

    const g = svg.append("g").attr("transform", "translate(0,20)");

    // --- Overlap overlays (exacte intersecties) ---
    const defs = svg.append("defs");

    defs.append("clipPath")
        .attr("id", "clipA")
        .append("circle")
        .attr("cx", cxA)
        .attr("cy", cyA)
        .attr("r", r);

    defs.append("clipPath")
        .attr("id", "clipB")
        .append("circle")
        .attr("cx", cxB)
        .attr("cy", cyB)
        .attr("r", r);

    defs.append("clipPath")
        .attr("id", "clipC")
        .append("circle")
        .attr("cx", cxC)
        .attr("cy", cyC)
        .attr("r", r);

    // circles
    const node = g
        .selectAll("g.node")
        .data(circles, (d) => d.id)
        .enter()
        .append("g")
        .attr("class", "node")
        .style("cursor", "pointer");

    node.append("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => d.r)
        .attr("fill", (d) => d.fill)
        .attr("stroke", (d) => d.stroke);

    node.append("text");
    node.append("text")
        .attr("x", (d) => {
            if (d.id === "A_LLM") return d.x - 50; // iets naar links
            if (d.id === "B_SECURITY") return d.x + 50; // iets naar rechts
            return d.x; // C blijft gelijk
        })
        .attr("y", (d) => {
            if (d.id === "C_IDE_HAI") {
                return d.y - d.r - 10; // boven
            }
            return d.y + d.r + 18; // onder
        })
        .attr("text-anchor", "middle")
        .attr("font-size", 12)
        .attr("font-weight", 500)
        .attr("fill", "#111827")
        .text((d) => d.label);

    const overlays = g.append("g").attr("class", "overlays");

    const cA = circles.find((c) => c.id === "A_LLM");
    const cB = circles.find((c) => c.id === "B_SECURITY");
    const cC = circles.find((c) => c.id === "C_IDE_HAI");

    const lensFill = "rgba(109,40,217,0.25)";

    function addOverlap(id, baseCircle, clipId, fill) {
        return overlays
            .append("circle")
            .attr("class", "overlap")
            .attr("data-overlap", id)
            .attr("cx", baseCircle.x)
            .attr("cy", baseCircle.y)
            .attr("r", baseCircle.r)
            .attr("clip-path", `url(#${clipId})`)
            .attr("fill", fill)
            .attr("opacity", 0);
    }

    // Pair overlaps
    addOverlap("A_B", cA, "clipB", lensFill);
    addOverlap("A_C", cA, "clipC", lensFill);
    addOverlap("B_C", cB, "clipC", lensFill);

    // Triple overlap: (A clipped by B) clipped by C
    const ovABC = overlays
        .append("g")
        .attr("class", "overlapTriple")
        .attr("data-overlap", "A_B_C")
        .attr("clip-path", "url(#clipC)")
        .style("opacity", 0);

    ovABC
        .append("circle")
        .attr("cx", cA.x)
        .attr("cy", cA.y)
        .attr("r", cA.r)
        .attr("clip-path", "url(#clipB)")
        .attr("fill", "rgba(109,40,217,0.35)");

    // click targets voor zones (simpel maar effectief: onzichtbare labels op posities)
    // Voor een echt “gebied” kun je later path-intersections doen; voor verdediging werkt dit prima.
    const zones = THEORY_MAP.venn.zones;

    const zoneAnchors = [
        { id: "A", x: cxA - r * 0.55, y: cyA + r * 0.35 },
        { id: "B", x: cxB + r * 0.55, y: cyB + r * 0.35 },
        { id: "C", x: cxC, y: cyC - r * 0.55 },
        { id: "A_B", x: w * 0.5, y: h * 0.62 },
        { id: "A_C", x: w * 0.44, y: h * 0.42 },
        { id: "B_C", x: w * 0.56, y: h * 0.42 },
        { id: "A_B_C", x: w * 0.5, y: h * 0.48 },
    ];

    const zoneById = new Map(zones.map((z) => [z.id, z]));
    const zNodes = g
        .selectAll("g.zone")
        .data(zoneAnchors, (d) => d.id)
        .enter()
        .append("g")
        .attr("class", "node zone")
        .style("cursor", "pointer");

    zNodes
        .append("text")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y + 5)
        .attr("text-anchor", "middle")
        .attr("font-size", 12)
        .attr("font-weight", 800)
        .attr("fill", "#111827")
        .text((d) => zoneById.get(d.id)?.label ?? d.id);

    const applyVennFocus = (zoneId) => {
        clearAllHighlights();
        svg.classed("vizDim", true);

        // focus zone letter
        zNodes.classed("isFocus", (d) => d.id === zoneId);

        // altijd overlays resetten
        overlays.selectAll(".overlap").attr("opacity", 0);
        overlays.selectAll(".overlapTriple").style("opacity", 0);

        const isOverlap = zoneId.includes("_");

        // Overlap geselecteerd: highlight alleen het overlap-gebied (lens)
        if (isOverlap) {
            overlays.selectAll(`[data-overlap="${zoneId}"]`).each(function () {
                const sel = d3.select(this);
                if (sel.classed("overlap")) sel.attr("opacity", 1);
                else sel.style("opacity", 1); // overlapTriple is een <g>
            });
            return;
        }

        // Single set A/B/C: highlight alleen de bijbehorende cirkel
        const related = new Set();
        if (zoneId === "A") related.add("A_LLM");
        if (zoneId === "B") related.add("B_SECURITY");
        if (zoneId === "C") related.add("C_IDE_HAI");

        node.classed("isRelated", (d) => related.has(d.id));
    };

    const setVennSide = (zoneId) => {
        const z = zoneById.get(zoneId);
        if (!z) return;
        const srcIds = new Set();
        // bronnen per cirkel
        for (const c of THEORY_MAP.venn.circles) {
            if (zoneId.includes("A") && c.id === "A_LLM")
                c.sources.forEach((x) => srcIds.add(x));
            if (zoneId.includes("B") && c.id === "B_SECURITY")
                c.sources.forEach((x) => srcIds.add(x));
            if (zoneId.includes("C") && c.id === "C_IDE_HAI")
                c.sources.forEach((x) => srcIds.add(x));
        }

        setSide(
            z.title,
            `<p>${escapeHtml(z.insight)}</p>
       ${tagsHtml(z.dvs, z.ocs)}
       ${sourcesHtml([...srcIds])}`
        );
    };

    const onHover = (zoneId) => {
        if (locked) return;
        applyVennFocus(zoneId);
        setVennSide(zoneId);
    };

    const onLeave = () => {
        if (locked) return;
        clearAllHighlights();
        setSide(
            "Selecteer een element",
            "Hover toont highlight. Klik “lockt” de selectie zodat je erover kunt toelichten."
        );
    };

    zNodes
        .on("mouseover", (_, d) => onHover(d.id))
        .on("mouseout", onLeave)
        .on("click", (_, d) => {
            const isSame = locked?.type === "venn" && locked?.id === d.id;
            if (isSame) {
                locked = null;
                clearAllHighlights();
                return;
            }
            locked = { type: "venn", id: d.id };
            applyVennFocus(d.id);
            setVennSide(d.id);
        });
}

function renderSankey() {
    const svg = d3.select("#sankeySvg");
    svg.selectAll("*").remove();

    const w = svg.node().clientWidth || 900;
    const h = parseFloat(svg.style("height")) || 520;
    svg.attr("viewBox", `0 0 ${w} ${h}`);

    // nodes bouwen
    const { clusters, insights, ocs, links } = THEORY_MAP.sankey;

    const nodes = [];
    const nodeIndex = new Map();

    const addNode = (id, label, type) => {
        if (nodeIndex.has(id)) return;
        nodeIndex.set(id, nodes.length);
        nodes.push({ id, name: label, type });
    };

    // sources
    for (const l of LITERATURE) addNode(l.id, l.short, "source");
    // clusters
    for (const c of clusters) addNode(c.id, c.label, "cluster");
    // insights
    for (const i of insights) addNode(i.id, i.label, "insight");
    // ocs
    for (const oc of ocs) addNode(oc.id, oc.label ?? oc.id, "oc");

    const sLinks = links
        .map(([a, b]) => ({
            source: nodeIndex.get(a),
            target: nodeIndex.get(b),
            value: 1,
            a,
            b,
        }))
        .filter((x) => x.source != null && x.target != null);

    const pad = 16;
    const headerH = 24;
    const s = sankey()
        .nodeWidth(14)
        .nodePadding(12)
        .extent([
            [pad, pad + headerH],
            [w - pad, h - pad],
        ]);

    const graph = s({
        nodes: nodes.map((d) => ({ ...d })),
        links: sLinks.map((d) => ({ ...d })),
    });

    const colorByType = (t) => {
        switch (t) {
            case "source":
                return "#f9fafb";
            case "cluster":
                return "#eef2ff";
            case "insight":
                return "#eafff2";
            case "oc":
                return "#f3e8ff";
            default:
                return "#ffffff";
        }
    };

    const strokeByType = (t) => {
        switch (t) {
            case "source":
                return "#6b7280";
            case "cluster":
                return "#3730a3";
            case "insight":
                return "#1b7f3a";
            case "oc":
                return "#6d28d9";
            default:
                return "#6b7280";
        }
    };

    const g = svg.append("g");

    // --- Column headers (Source / Cluster / Insight / OC) ---
    const colMeta = [
        { type: "source", label: "Literatuur", align: "start" },
        { type: "cluster", label: "Theoretisch cluster", align: "center" },
        { type: "insight", label: "Synthese-inzicht", align: "center" },
        { type: "oc", label: "Ontwerpcriterium", align: "end" }, // <-- belangrijk
    ];

    const headers = svg.append("g").attr("class", "sankeyHeaders");

    for (const { type, label, align } of colMeta) {
        const nodesOfType = graph.nodes.filter((n) => n.type === type);
        if (!nodesOfType.length) continue;

        const minX = d3.min(nodesOfType, (n) => n.x0);
        const maxX = d3.max(nodesOfType, (n) => n.x1);

        let x;
        let anchor;

        if (align === "center") {
            x = (minX + maxX) / 2;
            x = Math.max(pad, Math.min(x, w - pad)); // clamp
            anchor = "middle";
        } else if (align === "end") {
            x = w - pad; // <-- rechts tegen de viewbox
            anchor = "end";
        } else {
            x = pad; // <-- links op padding (strakker dan minX)
            anchor = "start";
        }

        headers
            .append("text")
            .attr("x", x)
            .attr("y", pad + 14) // binnen header-ruimte
            .attr("text-anchor", anchor)
            .attr("font-size", 12)
            .attr("font-weight", 800)
            .attr("fill", "#111827")
            .text(label);
    }

    const link = g
        .append("g")
        .attr("fill", "none")
        .selectAll("path")
        .data(graph.links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", sankeyLinkHorizontal())
        .attr("stroke", "#cbd5e1")
        .attr("stroke-width", (d) => Math.max(1, d.width))
        .attr("opacity", 0.55);

    const node = g
        .append("g")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .style("cursor", "pointer");

    node.append("rect")
        .attr("x", (d) => d.x0)
        .attr("y", (d) => d.y0)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("fill", (d) => colorByType(d.type))
        .attr("stroke", (d) => strokeByType(d.type));

    const wrapByChars = (text, maxChars) => {
        const words = String(text || "")
            .split(/\s+/)
            .filter(Boolean);
        const lines = [];
        let line = "";
        for (const w of words) {
            const test = line ? `${line} ${w}` : w;
            if (test.length > maxChars && line) {
                lines.push(line);
                line = w;
            } else {
                line = test;
            }
        }
        if (line) lines.push(line);
        return lines;
    };

    const labelX = (d) => {
        // Forceer per kolom/type
        if (d.type === "oc") return d.x0 - 10; // links
        if (d.type === "insight") return d.x1 + 10; // rechts
        if (d.type === "cluster") return d.x1 + 10; // rechts (voorkomt overlap)
        if (d.type === "source") return d.x1 + 10; // rechts
        // fallback
        return d.x0 < w / 2 ? d.x1 + 8 : d.x0 - 8;
    };

    const labelAnchor = (d) => {
        if (d.type === "oc") return "end";
        if (d.type === "insight") return "start";
        if (d.type === "cluster") return "start";
        if (d.type === "source") return "start";
        return d.x0 < w / 2 ? "start" : "end";
    };

    node.append("text")
        .attr("x", (d) => labelX(d))
        .attr("y", (d) => (d.y0 + d.y1) / 2)
        .attr("text-anchor", (d) => labelAnchor(d))
        .attr("fill", "#111827")
        .each(function (d) {
            const t = d3.select(this);
            const x = labelX(d);
            const yMid = (d.y0 + d.y1) / 2;

            // Bouw regels: 1e regel = bestaande naam
            const lines = [
                { text: d.name, size: 12, color: "#111827", weight: null },
            ];

            // Alleen bij sources: voeg titelregels toe als subtitel
            if (d.type === "source") {
                const lit = litById.get(d.id);
                const title = lit?.title || "";
                if (title) {
                    const titleLines = wrapByChars(title, 34).slice(0, 2);
                    for (const tl of titleLines) {
                        lines.push({
                            text: tl,
                            size: 10,
                            color: "#6b7280",
                            weight: null,
                        });
                    }
                }
            }

            // === Cluster → Venn zones met titels als subtitel (meerdere regels) ===
            if (d.type === "cluster") {
                const zonesByCluster = {
                    CL_LLM: ["A", "A_B", "A_C"],
                    CL_SEC: ["B", "A_B", "B_C"],
                    CL_IDE: ["C", "B_C"],
                    CL_HAI: ["A_C", "A_B_C"],
                    CL_PROD: ["A", "A_C"],
                };

                // 1) Bouw een snelle lookup van zoneId -> {label,title}
                // zones zitten in THEORY_MAP.venn.zones
                const zoneMetaById = new Map(
                    (THEORY_MAP.venn?.zones ?? []).map((z) => [
                        z.id,
                        {
                            label: z.label, // bijv. "A ∩ B"
                            title: z.title, // bijv. "Context als functionele én beveiligingsfactor"
                        },
                    ])
                );

                const zoneIds = zonesByCluster[d.id] || [];

                // 2) Voeg per zone een subtitelregel toe: "<label>: <title>"
                // (max 3 regels om het compact te houden; pas aan indien nodig)
                for (const zid of zoneIds.slice(0, 3)) {
                    const meta = zoneMetaById.get(zid);
                    if (!meta) continue;

                    lines.push({
                        text: `${meta.label}: ${meta.title}`,
                        size: 9,
                        color: "#6b7280",
                    });
                }
            }

            // Centreer het hele blok verticaal rond yMid
            // lineHeight in em: hoofdregel iets ruimer, subtitel compact
            const lh = 1.15; // em
            const totalLines = lines.length;
            const startDyEm = (-(totalLines - 1) * lh) / 2; // start boven midden

            // Eerste regel: dy naar startpositie + baseline
            t.append("tspan")
                .attr("x", x)
                .attr("dy", `${startDyEm + 0.35}em`)
                .attr("font-size", lines[0].size)
                .attr("fill", lines[0].color)
                .text(lines[0].text);

            // Volgende regels: vaste line-height omlaag
            for (let i = 1; i < lines.length; i++) {
                t.append("tspan")
                    .attr("x", x)
                    .attr("dy", `${lh}em`)
                    .attr("font-size", lines[i].size)
                    .attr("fill", lines[i].color)
                    .text(lines[i].text);
            }
        });

    const insightById = new Map(
        THEORY_MAP.sankey.insights.map((i) => [i.id, i])
    );
    const clusterById = new Map(
        THEORY_MAP.sankey.clusters.map((c) => [c.id, c])
    );
    const ocById = new Map(THEORY_MAP.sankey.ocs.map((o) => [o.id, o]));

    const sankeySide = (n) => {
        if (n.type === "source") {
            const lit = litById.get(n.id);
            const title = lit?.title
                ? `<p><b>Titel</b><br>${escapeHtml(lit.title)}</p>`
                : "";
            const summary = lit?.summary
                ? `<p><b>Kern</b><br>${escapeHtml(lit.summary)}</p>`
                : "";
            const link = lit?.url
                ? `<p><a href="${escapeHtml(
                      lit.url
                  )}" target="_blank" rel="noopener noreferrer">Open artikel</a></p>`
                : "";

            setSide(
                n.name,
                `${title}${summary}${link}<p style="margin-top:10px;"><b>Referentie</b><br>${escapeHtml(
                    lit?.full ?? ""
                )}</p>`
            );
            return;
        }

        if (n.type === "cluster") {
            const cl = clusterById.get(n.id);
            const desc = cl?.desc ?? "Geen beschrijving beschikbaar.";
            setSide(cl?.label ?? n.name, `<p>${escapeHtml(desc)}</p>`);
            return;
        }

        if (n.type === "insight") {
            const ins = insightById.get(n.id);
            const desc = ins?.desc ?? "";
            setSide(
                `Synthese-inzicht`,
                `<p><b>${escapeHtml(ins?.label ?? n.name)}</b></p>
               ${desc ? `<p>${escapeHtml(desc)}</p>` : ""}
               ${tagsHtml(ins?.dvs ?? [], ins?.ocs ?? [])}`
            );
            return;
        }

        if (n.type === "oc") {
            const oc = ocById.get(n.id);
            setSide(
                n.name,
                `<p>${escapeHtml(
                    oc?.desc ?? "Geen beschrijving beschikbaar."
                )}</p>
               ${tagsHtml([], [n.name])}`
            );
            return;
        }
    };

    const applySankeyFocus = (nodeId) => {
        clearAllHighlights();
        svg.classed("vizDim", true);

        const focus = graph.nodes.find((n) => n.id === nodeId);
        if (!focus) return;

        // highlight: focus node + 1 stap links/rechts (incoming/outgoing)
        const relatedNodeIds = new Set([nodeId]);
        const relatedLinks = new Set();

        for (const l of graph.links) {
            const sId = l.source.id;
            const tId = l.target.id;

            if (sId === nodeId) {
                relatedNodeIds.add(tId);
                relatedLinks.add(l);
            }
            if (tId === nodeId) {
                relatedNodeIds.add(sId);
                relatedLinks.add(l);
            }
        }

        node.classed("isFocus", (d) => d.id === nodeId).classed(
            "isRelated",
            (d) => relatedNodeIds.has(d.id)
        );

        link.classed("isRelated", (d) => relatedLinks.has(d))
            .attr("stroke", "#cbd5e1")
            .attr("opacity", (d) => (relatedLinks.has(d) ? 0.55 : 0.12));
    };

    const onHover = (n) => {
        if (locked) return;
        applySankeyFocus(n.id);
        sankeySide(n);
    };

    const onLeave = () => {
        if (locked) return;
        clearAllHighlights();
        setSide(
            "Selecteer een element",
            "Hover toont highlight. Klik “lockt” de selectie zodat je erover kunt toelichten."
        );
    };

    node.on("mouseover", (_, d) => onHover(d))
        .on("mouseout", onLeave)
        .on("click", (_, d) => {
            const isSame = locked?.type === "sankey" && locked?.id === d.id;
            if (isSame) {
                locked = null;
                clearAllHighlights();
                return;
            }
            locked = { type: "sankey", id: d.id };
            applySankeyFocus(d.id);
            sankeySide(d);
        });
}
initHamburgerNav();
