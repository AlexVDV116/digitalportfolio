import { initHamburgerNav } from "../../scripts/shared/nav.js";
import { initStoryMode } from "../../scripts/shared/storyMode.js";
import { initThemeToggle } from "../../scripts/shared/themeToggle.js";

const elBody = document.getElementById("timelineBody");
const elDetail = document.getElementById("detail");
const btnReset = document.getElementById("btnReset");
const chkMilestones = document.getElementById("chkMilestones");

const chips = [...document.querySelectorAll(".chip[data-phase]")];

const DATA = [
    {
        week: 0,
        date: "",
        phase: "Voorbereiding",
        activity:
            "Afstudeervoorstel indienen bij afstudeercommissie middels aanmeldformulier",
        milestone: "Goedgekeurd afstudeervoorstel",
    },
    {
        week: 1,
        date: "2 feb",
        phase: "Voorbereiding",
        activity:
            "Start afstuderen, oriëntatie organisatie & opdracht, afspraken met begeleiders",
        milestone: "",
    },
    {
        week: 2,
        date: "9 feb",
        phase: "Voorbereiding",
        activity:
            "Probleemverkenning, centrale vraag & deelvragen, literatuuronderzoek",
        milestone: "Projectstatusrapport",
    },
    {
        week: 3,
        date: "16 feb",
        phase: "Voorbereiding",
        activity: "Uitwerken PvA",
        milestone: "",
    },
    {
        week: 4,
        date: "23 feb",
        phase: "Voorbereiding",
        activity: "PvA afronden en inleveren",
        milestone: "Plan van Aanpak GO/NO-GO",
    },

    {
        week: 5,
        date: "2 mrt",
        phase: "Uitvoering",
        activity: "Start onderzoek volgens PvA, dataverzameling",
        milestone: "Projectstatusrapport",
    },
    {
        week: 6,
        date: "9 mrt",
        phase: "Uitvoering",
        activity: "Analyse huidige situatie",
        milestone: "",
    },
    {
        week: 7,
        date: "16 mrt",
        phase: "Uitvoering",
        activity: "Verdieping analyse, ontwerpkeuzes onderbouwen",
        milestone: "Projectstatusrapport",
    },
    {
        week: 8,
        date: "23 mrt",
        phase: "Uitvoering",
        activity: "Ontwerp / oplossingsrichting uitwerken",
        milestone: "",
    },
    {
        week: 9,
        date: "30 mrt",
        phase: "Uitvoering",
        activity: "Realisatie / prototype / MVP",
        milestone: "Projectstatusrapport",
    },
    {
        week: 10,
        date: "6 apr",
        phase: "Uitvoering",
        activity: "Testen, validatie, bijstellen ontwerp",
        milestone: "",
    },
    {
        week: 11,
        date: "13 apr",
        phase: "Uitvoering",
        activity: "Afronden uitvoering en resultaten consolideren",
        milestone: "Projectstatusrapport",
    },
    {
        week: 12,
        date: "20 apr",
        phase: "Uitvoering",
        activity: "Documenteren bevindingen voor eindverslag",
        milestone: "",
    },
    {
        week: "13–14",
        date: "27 apr",
        phase: "Uitvoering",
        activity: "Einde uitvoeringsfase + beoordeling bedrijfsbegeleider",
        milestone: "Beoordelingsformulier uitvoering (≥5,5)",
    },

    {
        week: 15,
        date: "4 mei",
        phase: "Afronding",
        activity: "Concept eindverslag inleveren",
        milestone: "Concept eindverslag",
    },
    {
        week: 16,
        date: "11 mei",
        phase: "Afronding",
        activity: "Feedback verwerken, conclusies & aanbevelingen uitwerken",
        milestone: "",
    },
    {
        week: 17,
        date: "18 mei",
        phase: "Afronding",
        activity: "Eindverslag finaliseren + presentatie voorbereiden",
        milestone: "",
    },
    {
        week: 18,
        date: "25 mei",
        phase: "Afronding",
        activity: "Definitief eindverslag inleveren",
        milestone: "Eindverslag + bijlagen",
    },
    {
        week: 19,
        date: "1 jun",
        phase: "Afronding",
        activity: "Voorbereiden presentatie & verdediging",
        milestone: "",
    },
    {
        week: 20,
        date: "8 jun",
        phase: "Afronding",
        activity: "Presentatie & verdediging (eindgesprek)",
        milestone: "Eindbeoordeling",
    },
];

let selectedPhase = "ALL";

function render() {
    const onlyMilestones = chkMilestones?.checked ?? false;

    const rows = DATA.filter((r) => {
        if (selectedPhase !== "ALL" && r.phase !== selectedPhase) return false;
        if (onlyMilestones && !r.milestone?.trim()) return false;
        return true;
    });

    elBody.innerHTML = rows
        .map((r, idx) => {
            const isMilestone = Boolean(r.milestone?.trim());
            const phaseClass = `tr-phase--${r.phase}`;
            const milestoneClass = isMilestone ? "tr-milestone" : "";
            return `
        <tr class="tr-row ${phaseClass} ${milestoneClass}" data-idx="${idx}">
          <td>${escapeHtml(String(r.week))}</td>
          <td>${escapeHtml(r.date || "-")}</td>
          <td>${escapeHtml(r.phase)}</td>
          <td>${escapeHtml(r.activity)}</td>
          <td>${escapeHtml(r.milestone || "")}</td>
        </tr>
      `;
        })
        .join("");

    // Row click → details
    [...elBody.querySelectorAll("tr.tr-row")].forEach((tr) => {
        tr.addEventListener("click", () => {
            const i = Number(tr.getAttribute("data-idx"));
            const r = rows[i];
            setDetail(r);
        });
    });
}

function setDetail(r) {
    if (!elDetail || !r) return;
    elDetail.textContent =
        `Week: ${r.week} (${r.date || "-"})\n` +
        `Fase: ${r.phase}\n\n` +
        `Activiteiten:\n${r.activity}\n\n` +
        (r.milestone?.trim() ? `Mijlpaal:\n${r.milestone}` : "Mijlpaal:\n—");
}

function setActiveChip(phase) {
    selectedPhase = phase;
    chips.forEach((c) =>
        c.classList.toggle("is-active", c.dataset.phase === phase)
    );
    render();
}

chips.forEach((c) => {
    c.addEventListener("click", () => setActiveChip(c.dataset.phase));
});

chkMilestones?.addEventListener("change", render);

btnReset?.addEventListener("click", () => {
    chkMilestones.checked = true;
    setActiveChip("ALL");
    if (elDetail) elDetail.textContent = "Klik op een rij om details te zien.";
});

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

// Init
render();

initHamburgerNav();
initThemeToggle();
initStoryMode();
