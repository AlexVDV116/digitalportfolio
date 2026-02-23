export const THEORY_MAP = {
    // Venn (3 domeinen)
    venn: {
        circles: [
            {
                id: "A_LLM",
                label: "LLM & Productiviteit",
                sources: [
                    "BROWN_2020",
                    "CHEN_2021",
                    "NIJKAMP_2022",
                    "PENG_2023",
                    "WEISZ_2025",
                    "BARKE_2023",
                ],
            },
            {
                id: "B_SECURITY",
                label: "Security & Air-gapped",
                sources: ["SHOSTACK_2014", "OWASP_LLM_TOP10"],
            },
            {
                id: "C_IDE_HAI",
                label: "IDE-Architectuur & Human-AI",
                sources: ["MS_VS_EXT", "AMERSHI_2019", "BARKE_2023"],
            },
        ],
        zones: [
            {
                id: "A",
                label: "A",
                title: "Modelgedrag en outputkwaliteit",
                insight:
                    "LLM-output is probabilistisch; kwaliteit hangt sterk af van context en taakafbakening.",
                ocs: ["OC-2", "OC-3"],
                dvs: ["DV3"],
            },
            {
                id: "B",
                label: "B",
                title: "Beveiligingsrisico’s en beheersmaatregelen",
                insight:
                    "Data-minimalisatie, duidelijke trust boundaries en beperkt attack surface zijn leidend.",
                ocs: ["OC-4", "OC-5", "OC-6"],
                dvs: ["DV1"],
            },
            {
                id: "C",
                label: "C",
                title: "Integratie en interactie in de IDE",
                insight:
                    "Stabiele, controleerbare integratie vereist supported extensibility en expliciete foutafhandeling.",
                ocs: ["OC-7", "OC-8", "OC-9"],
                dvs: ["DV4"],
            },
            {
                id: "A_C",
                label: "A ∩ C",
                title: "Menselijke regie over AI",
                insight:
                    "AI werkt als suggestie; developer blijft eindverantwoordelijk. Over-reliance voorkomen.",
                ocs: ["OC-1", "OC-9"], // OC-3 verwijderd
                dvs: ["DV5"],
            },
            {
                id: "A_B",
                label: "A ∩ B",
                title: "Context als functionele én beveiligingsfactor",
                insight:
                    "Beperk en selecteer context expliciet; voorkom ongecontroleerde contextoverdracht en logging.",
                ocs: ["OC-2", "OC-5", "OC-6"], // OC-6 toegevoegd
                dvs: ["DV1", "DV2"],
            },
            {
                id: "B_C",
                label: "B ∩ C",
                title: "Isolatie en gecontroleerde communicatie",
                insight:
                    "Scheiding IDE ↔ model, least privilege, timeouts en veilige foutlogging.",
                ocs: ["OC-6", "OC-8", "OC-7"],
                dvs: ["DV1", "DV4"],
            },
            {
                id: "A_B_C",
                label: "A ∩ B ∩ C",
                title: "Veilige LLM-ondersteuning",
                insight:
                    "Veilige LLM-ondersteuning binnen een zware IDE in een gesloten netwerk. Productiviteit is secundair aan beheersbaarheid: offline, gecontroleerd, transparant.",
                ocs: [
                    "OC-1",
                    "OC-2",
                    "OC-4",
                    "OC-5",
                    "OC-6",
                    "OC-7",
                    "OC-8",
                    "OC-9",
                ],
                dvs: ["DV1", "DV2", "DV3", "DV4", "DV5"],
            },
        ],
    },

    // Sankey / conceptmap
    sankey: {
        clusters: [
            {
                id: "CL_LLM",
                label: "LLM-theorie & codegeneratie",
                desc: "Modelgedrag en outputkwaliteit: probabilistische output, foutgevoeligheid bij complexiteit, en sterke afhankelijkheid van context. Richt zich op grenzen aan autonome inzet en voorwaarden voor betrouwbaar gebruik.",
            },
            {
                id: "CL_PROD",
                label: "Productiviteit & praktijkgebruik",
                desc: "Empirische bevindingen over productiviteitswinst bij routinematige taken, met de kanttekening dat winst afhankelijk is van menselijke controle en kritische beoordeling in de praktijk (zeker in enterprise-context).",
            },
            {
                id: "CL_HAI",
                label: "Human-AI interactie",
                desc: "Interactieprincipes en risico’s zoals over-reliance. Effectieve inzet vraagt transparantie, voorspelbaarheid en behoud van menselijke regie over wat wordt toegepast.",
            },
            {
                id: "CL_SEC",
                label: "Security & threat modeling",
                desc: "Beveiligingskaders voor gevoelige omgevingen: dataminimalisatie, trust boundaries, beperkt attack surface, mitigatie van prompt-injectie en ongewenste logging. Air-gapped randvoorwaarden sturen de architectuur.",
            },
            {
                id: "CL_IDE",
                label: "IDE/VS extensibility & architectuur",
                desc: "Architectuurprincipes voor stabiele IDE-extensies: supported SDK/MEF, losse koppeling, expliciete interfaces en foutafhandeling. In defensiecontext extra nadruk op begrensde communicatie en beheersbaarheid.",
            },
        ],
        insights: [
            {
                id: "IN_HITL",
                label: "Human-in-the-loop",
                dvs: ["DV5"],
                ocs: ["OC-1", "OC-9"],
                desc: "LLM-output is ondersteuning, geen autonome besluitvorming. Output moet als voorstel/preview worden gepresenteerd; de ontwikkelaar blijft eindverantwoordelijk en bevestigt actief wat wordt overgenomen.",
            },
            {
                id: "IN_CTX",
                label: "Contextbegrenzing",
                dvs: ["DV2", "DV3"],
                ocs: ["OC-2"],
                desc: "Betrouwbaarheid hangt af van de juiste hoeveelheid context. Zowel te weinig als te veel context kan output verslechteren; onbeperkte contextaccumulatie kan foutversterking en onvoorspelbaar gedrag veroorzaken.",
            },
            {
                id: "IN_STOCH",
                label: "Stochasticiteitscontrole",
                dvs: ["DV3"],
                ocs: ["OC-3"],
                desc: "Omdat modellen niet-deterministisch zijn, is het nodig parameters (zoals temperature/top-p) vast te zetten om variatie te beperken en gedrag reproduceerbaarder te maken binnen een gecontroleerde ontwikkelomgeving.",
            },
            {
                id: "IN_OFFLINE",
                label: "Volledig offline",
                dvs: ["DV1"],
                ocs: ["OC-4"],
                desc: "In een air-gapped defensieomgeving is externe communicatie uitgesloten. LLM-verwerking moet volledig lokaal plaatsvinden; er mogen geen gegevens de omgeving verlaten.",
            },
            {
                id: "IN_NOSTORE",
                label: "Geen persistente opslag",
                dvs: ["DV1"],
                ocs: ["OC-5"],
                desc: "Prompts en output kunnen gevoelige informatie bevatten. Daarom geen persistente opslag of inhoudelijke logging; verwerking blijft tijdelijk in-memory en wordt na de interactie verwijderd.",
            },
            {
                id: "IN_ISO",
                label: "Procesisolatie (least-privilege)",
                dvs: ["DV1", "DV4"],
                ocs: ["OC-6"],
                desc: "Beperk het aanvalsoppervlak door duidelijke scheiding IDE ↔ model. Het modelproces krijgt geen directe toegang tot projectstructuren/bestandssysteem en werkt alleen met expliciet aangeleverde input.",
            },
            {
                id: "IN_SDK",
                label: "Supported extensibility",
                dvs: ["DV4"],
                ocs: ["OC-7"],
                desc: "Stabiliteit en compatibiliteit vereisen gebruik van gedocumenteerde, ondersteunde VS SDK/MEF-mechanismen. Vermijd interne/experimentele hooks die onderhoudbaarheid en beheersbaarheid ondermijnen.",
            },
            {
                id: "IN_COMMS",
                label: "Gecontroleerde communicatie",
                dvs: ["DV4", "DV5"],
                ocs: ["OC-8"],
                desc: "Communicatie tussen IDE en LLM moet controleerbaar zijn: expliciete foutafhandeling, timeouts en veilige technische logging (zonder inhoud). Dit voorkomt vastlopers en maakt gedrag uitlegbaar.",
            },
        ],
        ocs: [
            {
                id: "OC-1",
                label: "OC-1",
                desc: "De extensie past nooit automatisch gegenereerde code toe op de codebase. Alle LLM-output wordt uitsluitend weergegeven als expliciete suggestie of preview en vereist een actieve bevestiging van de ontwikkelaar voordat deze in de code wordt ingevoegd.",
            },
            {
                id: "OC-2",
                label: "OC-2",
                desc: "Het LLM ontvangt uitsluitend codefragmenten die expliciet door de gebruiker zijn geselecteerd. De extensie verzendt geen volledige projectstructuren, ongebruikte bestanden of impliciete IDE-context zonder expliciete handeling van de gebruiker.",
            },
            {
                id: "OC-3",
                label: "OC-3",
                desc: "Niet-deterministische modelparameters (zoals temperature en top-p) worden vast ingesteld op vooraf bepaalde waarden om variabiliteit in output te beperken en reproduceerbaar gedrag te bevorderen.",
            },
            {
                id: "OC-4",
                label: "OC-4",
                desc: "Alle LLM-verwerking vindt plaats op lokale infrastructuur binnen de gesloten netwerkomgeving. De extensie maakt geen externe netwerkverbindingen en verzendt geen gegevens buiten de air-gapped omgeving.",
            },
            {
                id: "OC-5",
                label: "OC-5",
                desc: "Prompts en gegenereerde output worden niet persistent opgeslagen op schijf of in externe logsystemen. Verwerking vindt uitsluitend tijdelijk in-memory plaats en wordt na afronding van de interactie verwijderd.",
            },
            {
                id: "OC-6",
                label: "OC-6",
                desc: "Het LLM-proces draait geïsoleerd van de IDE en heeft geen directe toegang tot het bestandssysteem, projectstructuren of IDE-API’s buiten de expliciet aangeleverde input.",
            },
            {
                id: "OC-7",
                label: "OC-7",
                desc: "De extensie maakt uitsluitend gebruik van officieel gedocumenteerde en ondersteunde uitbreidingsmechanismen van de Visual Studio 2022 SDK en vermijdt niet-gedocumenteerde of experimentele koppelingen met interne IDE-componenten.",
            },
            {
                id: "OC-8",
                label: "OC-8",
                desc: "De communicatie tussen IDE en LLM verloopt via een gecontroleerd mechanisme met expliciete foutafhandeling, timeouts en logging van technische fouten zonder inhoudelijke opslag van code of prompts.",
            },
            {
                id: "OC-9",
                label: "OC-9",
                desc: "De extensie toont duidelijk welke input naar het LLM wordt verzonden en presenteert output als AI-gegenereerd voorstel, zodat de ontwikkelaar inzicht heeft in de herkomst en status van de gegenereerde code.",
            },
        ],

        // Links: source -> cluster -> insight -> oc
        links: [
            // Sources -> clusters
            ["BROWN_2020", "CL_LLM"],
            ["CHEN_2021", "CL_LLM"],
            ["NIJKAMP_2022", "CL_LLM"],
            ["PENG_2023", "CL_PROD"],
            ["WEISZ_2025", "CL_PROD"],
            ["BARKE_2023", "CL_PROD"],
            ["AMERSHI_2019", "CL_HAI"],
            ["BARKE_2023", "CL_HAI"],
            ["SHOSTACK_2014", "CL_SEC"],
            ["OWASP_LLM_TOP10", "CL_SEC"],
            ["MS_VS_EXT", "CL_IDE"],

            // Clusters -> insights
            ["CL_HAI", "IN_HITL"],
            ["CL_PROD", "IN_HITL"],
            ["CL_LLM", "IN_CTX"],
            ["CL_LLM", "IN_STOCH"],
            ["CL_SEC", "IN_OFFLINE"],
            ["CL_SEC", "IN_NOSTORE"],
            ["CL_SEC", "IN_ISO"],
            ["CL_IDE", "IN_SDK"],
            ["CL_IDE", "IN_COMMS"],
            ["CL_LLM", "IN_COMMS"],

            // Insights -> OCs
            ["IN_HITL", "OC-1"],
            ["IN_HITL", "OC-9"],
            ["IN_CTX", "OC-2"],
            ["IN_STOCH", "OC-3"],
            ["IN_OFFLINE", "OC-4"],
            ["IN_NOSTORE", "OC-5"],
            ["IN_ISO", "OC-6"],
            ["IN_SDK", "OC-7"],
            ["IN_COMMS", "OC-8"],
        ],
    },
};
