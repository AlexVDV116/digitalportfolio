export const LITERATURE = [
    {
        id: "AMERSHI_2019",
        short: "Amershi et al. (2019)",
        title: "Guidelines for Human-AI Interaction",
        summary:
            "Presenteert 18 ontwerprichtlijnen voor mens–AI-interactie met focus op transparantie, gebruikerscontrole en samenwerking. Waarschuwt voor over-reliance als gebruikers AI-output niet kunnen begrijpen of corrigeren. Relevant als normatief kader voor human-in-the-loop en transparante UI-feedback.",
        url: "https://doi.org/10.1145/3290605.3300233",
        full: `Amershi, S., Weld, D., Vorvoreanu, M., Fourney, A., Nushi, B., Collisson, P., Suh, J., Iqbal, S., Bennett, P. N., Inkpen, K., Teevan, J., Kikin-Gil, R., & Horvitz, E. (2019). Guidelines for Human-AI Interaction. CHI ’19, 1–13. https://doi.org/10.1145/3290605.3300233`,
        type: "paper",
    },
    {
        id: "BARKE_2023",
        short: "Barke et al. (2023)",
        title: "Grounded Copilot: How Programmers Interact with Code-Generating Models",
        summary:
            "Kwalitatieve studie naar hoe developers Copilot-output lezen, toetsen, aanpassen en integreren. Introduceert ‘grounding’: AI-output wordt zelden 1-op-1 overgenomen maar actief verankerd in context en begrip. Onderbouwt ontwerpkeuzes die controle, review en feedbackmechanismen afdwingen.",
        url: "https://doi.org/10.1145/3586030",
        full: `Barke, S., James, M. B., & Polikarpova, N. (2023). Grounded Copilot: How Programmers Interact with Code-Generating Models. PACMPL, 7(OOPSLA1), 85–111. https://doi.org/10.1145/3586030`,
        type: "paper",
    },
    {
        id: "BROWN_2020",
        short: "Brown et al. (2020)",
        title: "Language Models are Few-Shot Learners",
        summary:
            "Introduceert GPT-3 en toont few-shot/one-shot/zero-shot gedrag door schaalvergroting. Benadrukt dat output statistisch/probabilistisch is, zonder waarheids- of veiligheidsgaranties, en (door sampling) niet-deterministisch kan zijn. Dit legitimeert contextbegrenzing en human-in-the-loop in veiligheidskritische omgevingen.",
        url: "https://doi.org/10.48550/arxiv.2005.14165",
        full: `Brown, T. B., et al. (2020). Language Models are Few-Shot Learners. arXiv. https://doi.org/10.48550/arxiv.2005.14165`,
        type: "paper",
    },
    {
        id: "CHEN_2021",
        short: "Chen et al. (2021)",
        title: "Evaluating large language models trained on code",
        summary:
            "Systematische evaluatie van code-LLM’s (zoals Codex) voor codegeneratie en completion. Positioneert de modellen als ondersteuning, niet als autonome programmeur: ze hebben geen semantisch begrip, doen geen verificatie en kunnen plausibele maar onjuiste/onveilige code produceren. Onderbouwt noodzaak van expliciete controle en begrensde context.",
        url: "https://doi.org/10.48550/arxiv.2107.03374",
        full: `Chen, M., et al. (2021). Evaluating large language models trained on code. arXiv. https://doi.org/10.48550/arxiv.2107.03374`,
        type: "paper",
    },
    {
        id: "NIJKAMP_2022",
        short: "Nijkamp et al. (2022)",
        title: "CodeGen: An Open Large Language Model for Code with Multi-Turn Program Synthesis",
        summary:
            "Introduceert CodeGen als open (lokaal inzetbaar) code-LLM en analyseert single-turn vs multi-turn program synthesis. Laat zien dat iteratieve interactie aansluit bij hoe developers werken, maar dat ‘meenemen van historie’ ontwerpkeuzes rond contextselectie en begrenzing vereist. Relevant voor gecontroleerde multi-turn flows en contextbeheer.",
        url: "https://doi.org/10.48550/arxiv.2203.13474",
        full: `Nijkamp, E., et al. (2022). CodeGen: An Open Large Language Model for Code with Multi-Turn Program Synthesis. arXiv. https://doi.org/10.48550/arxiv.2203.13474`,
        type: "paper",
    },
    {
        id: "PENG_2023",
        short: "Peng et al. (2023)",
        title: "The Impact of AI on Developer Productivity: Evidence from GitHub Copilot",
        summary:
            "Controlled experiment met/zonder Copilot op dezelfde programmeertaak (HTTP server) en meet taakvoltooiingstijd. Rapporteert substantiële tijdwinst (55,8% sneller) en heterogene effecten tussen ontwikkelaars. Onderbouwt productiviteitsclaims, maar impliceert dat effect context- en gebruiker-afhankelijk is.",
        url: "https://doi.org/10.48550/arxiv.2302.06590",
        full: `Peng, S., Kalliamvakou, E., Cihon, P., & Demirer, M. (2023). The Impact of AI on Developer Productivity: Evidence from GitHub Copilot. arXiv. https://doi.org/10.48550/arxiv.2302.06590`,
        type: "paper",
    },
    {
        id: "WEISZ_2025",
        short: "Weisz et al. (2025)",
        title: "Examining the Use and Impact of an AI Code Assistant on Developer Productivity and Experience in the Enterprise",
        summary:
            "Enterprise-studie naar gebruik van een interne AI-codeassistent (watsonx Code Assistant) in echte teams. Combineert grootschalige surveys (N=669) met usability testing (N=15) om zowel productiviteit als developer experience te duiden. Laat zien dat waarde vaak zit in routinewerk, begrip en suggesties, met sterke afhankelijkheid van workflow en context.",
        url: "https://doi.org/10.1145/3706599.370667",
        full: `Weisz, J. D., et al. (2025). Examining the Use and Impact of an AI Code Assistant on Developer Productivity and Experience in the Enterprise. CHI EA ’25, 1–13. https://doi.org/10.1145/3706599.370667`,
        type: "paper",
    },
    {
        id: "SHOSTACK_2014",
        short: "Shostack (2014)",
        title: "Threat Modeling: Designing for Security",
        summary:
            "Shostack introduceert een systematische aanpak voor threat modeling met nadruk op het vroegtijdig identificeren van trust boundaries, attack surfaces en mogelijke misbruikscenario’s (STRIDE). Het boek positioneert beveiliging als ontwerpprobleem in plaats van een latere toevoeging. Relevantie voor dit onderzoek ligt in het structureren van risicoanalyse, het expliciet modelleren van interacties tussen IDE en LLM, en het afdwingen van least-privilege en isolatie.",
        url: "https://www.wiley.com/en-us/Threat+Modeling%3A+Designing+for+Security-p-9781118809990",
        full: `Shostack, A. (2014). Threat Modeling: Designing for Security. John Wiley & Sons. ISBN: 9781118809990`,
        type: "book",
    },
    {
        id: "OWASP_LLM_TOP10",
        short: "OWASP LLM Top 10",
        title: "OWASP Top 10 for Large Language Model Applications",
        summary:
            "De OWASP LLM Top 10 beschrijft de belangrijkste beveiligingsrisico’s specifiek voor LLM-gebaseerde systemen, waaronder prompt injection, data leakage, model supply chain risks en onvoldoende output-validatie. Het document biedt een risicogebaseerd referentiekader voor het ontwerpen van veilige LLM-integraties. Voor dit onderzoek onderbouwt het ontwerpkeuzes rond offline verwerking, geen persistente opslag, gecontroleerde contextoverdracht en expliciete foutafhandeling.",
        url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
        full: `OWASP Top 10 for Large Language Model Applications. https://owasp.org/www-project-top-10-for-large-language-model-applications/`,
        type: "guideline",
    },
    {
        id: "MS_VS_EXT",
        short: "Microsoft Learn (VS Extensibility)",
        title: "Visual Studio Extensibility (Visual Studio SDK / MEF)",
        summary:
            "De Microsoft Learn-documentatie over Visual Studio extensibility beschrijft het gebruik van de Visual Studio SDK, MEF en officiële extensibility-mechanismen voor het veilig en stabiel uitbreiden van de IDE. Het benadrukt lifecycle management, thread-safety, package-isolatie en supported API’s. Binnen dit onderzoek legitimeert dit het gebruik van ondersteunde extensiepunten in plaats van niet-gedocumenteerde hooks, ter borging van stabiliteit en beheersbaarheid.",
        url: "https://learn.microsoft.com/en-us/visualstudio/extensibility/",
        full: `Madskristensen. Visual Studio Extensibility (Visual Studio SDK / MEF). Microsoft Learn. https://learn.microsoft.com/en-us/visualstudio/extensibility/`,
        type: "documentation",
    },
];
