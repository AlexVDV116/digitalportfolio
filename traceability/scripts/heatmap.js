import { NODES, EDGES } from "../data/graph.js";

/**
 * Render an OC × DV coverage heatmap into `host`.
 *
 * Cell value = number of paths from DV → OC, counted via direct
 * `derived` edges (DV→OC) plus indirect derivation via FR/NFR/C
 * (DV→FR→OC etc). Empty cells get a dashed neutral style.
 *
 * Clicking a cell calls `onSelect(dvId, ocId)` if provided
 * (the page wires this to focus the graph).
 */
export function mountHeatmap({ host, sideEl, onSelect }) {
    host.innerHTML = "";

    const dvs = NODES.filter((n) => n.type === "dv");
    const ocs = NODES.filter((n) => n.type === "oc");

    // adjacency
    const outBy = new Map();
    for (const [s, t, k] of EDGES) {
        if (!outBy.has(s)) outBy.set(s, []);
        outBy.get(s).push({ t, k });
    }

    // For each DV, count "reach" to each OC (direct or via FR/NFR/C).
    function reach(fromId) {
        const counts = new Map();
        const seen = new Set([fromId]);
        const stack = [{ id: fromId, depth: 0 }];
        while (stack.length) {
            const { id, depth } = stack.pop();
            if (depth > 2) continue;
            const outs = outBy.get(id) ?? [];
            for (const { t } of outs) {
                if (t.startsWith("OC-")) {
                    counts.set(t, (counts.get(t) ?? 0) + 1);
                }
                if (!seen.has(t)) {
                    seen.add(t);
                    stack.push({ id: t, depth: depth + 1 });
                }
            }
        }
        return counts;
    }

    const matrix = new Map(); // `${dv}|${oc}` -> count
    for (const dv of dvs) {
        const r = reach(dv.id);
        for (const oc of ocs) {
            const v = r.get(oc.id) ?? 0;
            matrix.set(`${dv.id}|${oc.id}`, v);
        }
    }
    const maxVal = Math.max(1, ...matrix.values());

    const wrap = document.createElement("div");
    wrap.className = "heatmap";

    const table = document.createElement("table");
    table.className = "heatmap__table";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.appendChild(th("")); // corner
    for (const oc of ocs) headRow.appendChild(th(oc.label));
    thead.appendChild(headRow);

    const tbody = document.createElement("tbody");
    for (const dv of dvs) {
        const tr = document.createElement("tr");
        const rowHead = document.createElement("th");
        rowHead.scope = "row";
        rowHead.textContent = dv.label;
        rowHead.title = dv.name;
        tr.appendChild(rowHead);
        for (const oc of ocs) {
            const v = matrix.get(`${dv.id}|${oc.id}`) ?? 0;
            const td = document.createElement("td");
            const cell = document.createElement("div");
            cell.className = `heatmap__cell heatmap__cell--${Math.min(v, 5)}`;
            cell.textContent = v > 0 ? String(v) : "—";
            cell.title = v
                ? `${dv.label} → ${oc.label} (${v} pad${v === 1 ? "" : "en"})`
                : `${dv.label} → ${oc.label}: geen pad`;
            if (v > 0) {
                const alpha = 0.18 + 0.82 * (v / maxVal);
                cell.style.background = `rgba(109, 40, 217, ${alpha.toFixed(
                    2
                )})`;
                cell.style.cursor = "pointer";
                cell.addEventListener("click", () => {
                    onSelect?.(dv.id, oc.id);
                });
                cell.addEventListener("mouseover", () =>
                    renderSideForCell(dv, oc, v)
                );
            } else {
                cell.addEventListener("mouseover", () =>
                    renderSideForCell(dv, oc, 0)
                );
            }
            td.appendChild(cell);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    table.append(thead, tbody);
    wrap.appendChild(table);

    const cap = document.createElement("div");
    cap.className = "heatmap__caption";
    cap.innerHTML =
        "Aantal afgeleide paden van <strong>Deelvraag</strong> (rij) naar <strong>Ontwerpcriterium</strong> (kolom). " +
        "Hoe donkerder, hoe sterker een DV een OC empirisch onderbouwt.";
    wrap.appendChild(cap);

    const leg = document.createElement("div");
    leg.className = "heatmap__legend";
    leg.innerHTML = `<span>geen</span><span class="heatmap__legendBar"></span><span>sterk (${maxVal})</span>`;
    wrap.appendChild(leg);

    host.appendChild(wrap);

    function th(label) {
        const el = document.createElement("th");
        el.textContent = label;
        return el;
    }

    function renderSideForCell(dv, oc, v) {
        sideEl.innerHTML = `
            <div class="card">
                <div class="card__title">
                    <span class="badge badge--id" style="color:var(--c-dv);border-color:var(--c-dv)">${
                        dv.label
                    }</span>
                    <span style="margin:0 6px;color:var(--muted)">→</span>
                    <span class="badge badge--id" style="color:var(--c-oc);border-color:var(--c-oc)">${
                        oc.label
                    }</span>
                </div>
                <div class="card__desc">
                    <p><b>${dv.name}</b></p>
                    <p><b>${oc.name}</b></p>
                    ${
                        v
                            ? `<p style="color:var(--c-oc);font-weight:700">${v} afleidingspad${
                                  v === 1 ? "" : "en"
                              }</p>`
                            : `<p style="color:var(--muted)">Geen directe of indirecte afleiding tussen deze DV en OC.</p>`
                    }
                    ${oc.desc ? `<p>${escape(oc.desc)}</p>` : ""}
                </div>
                <div class="sideDetail__meta">
                    💡 Klik een cel om de Graph te openen met deze OC in focus.
                </div>
            </div>`;
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

    // Default side panel content for the heatmap tab
    sideEl.innerHTML = `
        <div class="card">
            <div class="card__title">Coverage-heatmap</div>
            <div class="card__desc">
                <p>Deze matrix toont in één oogopslag of elk ontwerpcriterium voldoende
                empirische dekking heeft vanuit de deelonderzoeken.</p>
                <p style="margin-top:8px">Een lege cel betekent niet dat een OC ongedekt is —
                hij wordt mogelijk via theorie/normen of andere deelvragen onderbouwd.
                Open de <b>Graph</b>-tab voor het volledige beeld.</p>
            </div>
        </div>`;

    return {
        destroy() {
            host.innerHTML = "";
        },
    };
}
