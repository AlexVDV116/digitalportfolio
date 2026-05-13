/**
 * Bewijs-keten per OC.
 *
 * Bronnen: OC_Traceability.csv, FR/NFR-traceability, SDD (regelreferenties),
 * Beveiligingsnormen.csv, Risicoregister.csv, Eindverslag DV5 §4.
 *
 * Per OC vijf secties:
 *   origin       — DV + theoretisch insight (TheoryMap-ID) + literatuur
 *   operational  — gekoppelde FR/NFR/C
 *   compliance   — normatieve basis (BIO-artikel, D/300, OWASP LLM)
 *   implementation — module + concrete regelverwijzing
 *   validation   — testklasse(n), DV5-paragraaf, gemitigeerde risico's
 */

export const OC_DETAILS = {
    "OC-1": {
        designDecision:
            "LLM-output altijd als suggestie/preview; geen autonome code-injectie. " +
            "Bewuste keuze om geen IVsTextManager.ReplaceText of DTE.ActiveDocument.Selection te gebruiken.",
        origin: {
            dvs: ["DV5"],
            insights: ["IN_HITL"],
            literature: ["AMERSHI_2019", "BARKE_2023", "OWASP_LLM_TOP10"],
            rationale:
                "Human-in-the-loop is een dominant ontwerpprincipe in mens-AI-interactie " +
                "literatuur (Amershi e.a. 2019) en in OWASP LLM09 (overreliance). " +
                "Barke e.a. (2023) toont dat developers AI-output zelden 1-op-1 overnemen.",
        },
        operational: {
            fr: ["FR-5", "FR-1", "FR-3"],
            nfr: ["NFR-4"],
        },
        compliance: [
            { norm: "D/301 (BIO)", scope: "Beveiligingsbaseline: gecontroleerde verwerking" },
            { norm: "OWASP LLM09", scope: "Overreliance — banner mitigatie" },
        ],
        implementation: [
            {
                module: "ChatWindowViewModel.cs",
                lines: "r.83 (DisplayMessages); r.153–173 (IsDisclaimerVisible); r.224 (DismissDisclaimerCommand); r.238/r.423 (SessionDisclaimer)",
            },
            {
                module: "ChatToolWindowControl.xaml",
                lines: "r.401–442 — banner 'AI-generated — human review required' + ✕-knop",
            },
        ],
        validation: {
            tests: [
                {
                    name: "Code-grep editor-manipulatie API's",
                    result: "0 hits (DV5 v3 §4.2.1)",
                    type: "static",
                },
                {
                    name: "Gebruikersevaluatie banner-effectiviteit",
                    result: "Gepland in DV5-D5",
                    type: "empirical",
                },
            ],
            mitigatesRisks: ["R7", "R9"],
            evalRef: "DV5 v3 §4.2.1, §4.6",
        },
    },

    "OC-2": {
        designDecision:
            "ContextMode-ceiling (Off / SelectionOnly / IncludeMethod / IncludeFile) als plafond; " +
            "default SelectionOnly. Methode-detectie en full-file alleen bij expliciete opt-in. " +
            "Hard cap van 500 regels op full-file context (PromptOrchestrator.MaxFileLines).",
        origin: {
            dvs: ["DV2", "DV3"],
            insights: ["IN_CTX"],
            literature: ["BROWN_2020", "CHEN_2021", "NIJKAMP_2022"],
            rationale:
                "Output-kwaliteit hangt sterk af van context-omvang (Brown, Chen). " +
                "Te veel context veroorzaakt foutversterking (Nijkamp). " +
                "Selectieve context is ook een beveiligingseis (need-to-know, BIO 10.1).",
        },
        operational: {
            fr: ["FR-4", "FR-7", "FR-8", "FR-2", "FR-3"],
        },
        compliance: [
            { norm: "BIO 10.1", scope: "Need-to-know principe" },
            { norm: "OWASP LLM06", scope: "Sensitive Information Disclosure" },
        ],
        implementation: [
            {
                module: "LocalLLMOptionsPage.cs",
                lines: "r.67–84 (ContextMode-enum)",
            },
            {
                module: "ContextProvider.cs",
                lines: "r.78–148 (ceiling-logica); r.86/r.118 (UI-thread switches)",
            },
            {
                module: "ContextSelection.cs",
                lines: "r.98–131 (Summary); factory-methoden",
            },
            {
                module: "AppDefaults.cs",
                lines: "r.88 (DefaultContextMode = SelectionOnly)",
            },
        ],
        validation: {
            tests: [
                {
                    name: "ContextSelectionTests",
                    result: "6 cases — factory-isolatie en mode-roundtrip",
                    type: "unit",
                },
                {
                    name: "InMemoryContextSettingsTests",
                    result: "14 cases — settings persistence",
                    type: "unit",
                },
            ],
            mitigatesRisks: ["R8"],
            evalRef: "DV5 v3 §4.2.2 — payload-inspectie per scenario",
        },
    },

    "OC-3": {
        designDecision:
            "Niet-deterministische modelparameters (Temperature=0.2f, TopP=0.9f, NumPredict=2048) " +
            "vast ingesteld in AppDefaults.FixedOptions. Pinning-tests bewaken drift.",
        origin: {
            dvs: ["DV3"],
            insights: ["IN_STOCH"],
            literature: ["BROWN_2020", "CHEN_2021"],
            rationale:
                "LLM's zijn probabilistisch (Brown 2020). Voor toetsbare/herhaalbare " +
                "ontwerpcriteria moet variabiliteit worden begrensd (D/302 toetsbaarheid).",
        },
        operational: {
            nfr: ["NFR-2"],
        },
        compliance: [
            { norm: "D/302", scope: "Toetsbaarheid / herhaalbaarheid" },
        ],
        implementation: [
            {
                module: "AppDefaults.cs",
                lines: "r.98 (Temperature=0.2f); r.105 (TopP=0.9f); r.111 (NumPredict=2048)",
            },
            {
                module: "OllamaClient.cs",
                lines: "r.76–81 (FixedOptions static readonly); r.151 (assignatie in SendChatAsync)",
            },
        ],
        validation: {
            tests: [
                {
                    name: "AppDefaultsTests",
                    result: "12 cases — pinning + integratie OllamaClient/PromptOrchestrator",
                    type: "unit",
                },
                {
                    name: "Empirische herhaaltest",
                    result: "3× identieke prompt op codellama:13b-instruct — DV5-D5",
                    type: "empirical",
                },
            ],
            mitigatesRisks: ["R3"],
            evalRef: "DV5 v3 §4.5",
        },
    },

    "OC-4": {
        designDecision:
            "Alleen localhost-egress (http://localhost:11434). IsLocalhost-check incl. IPv6-fix " +
            "TrimStart('[').TrimEnd(']') corrigeert latente kwetsbaarheid in .NET 4.8 " +
            "waarbij Uri.Host '[::1]' inclusief blokhaken retourneert. " +
            "OllamaClient is de enige uitgaande netwerkactor in de hele oplossing.",
        origin: {
            dvs: ["DV1"],
            insights: ["IN_OFFLINE"],
            literature: ["SHOSTACK_2014", "OWASP_LLM_TOP10"],
            rationale:
                "Zero-trust / air-gap is een primaire eis in defensiecontext (D/304). " +
                "Shostack (threat modeling) onderbouwt minimale trust-boundaries. " +
                "OWASP LLM06 vereist preventie van data-exfiltratie.",
        },
        operational: {
            c: ["C-1", "C-2"],
            nfr: ["NFR-1"],
        },
        compliance: [
            { norm: "D/304", scope: "Netwerkscheiding en air-gap" },
            { norm: "BIO 13.1", scope: "Netwerkbeveiliging / -scheiding" },
            { norm: "OWASP LLM06", scope: "Sensitive Information Disclosure" },
        ],
        implementation: [
            {
                module: "OllamaClient.cs",
                lines: "r.289–300 (IsLocalhost incl. IPv6-fix); r.92–104 (BaseUrl-setter); r.131–135 (per-call validatie)",
            },
            {
                module: "AppDefaults.cs",
                lines: "OllamaBaseUrl = http://localhost:11434",
            },
        ],
        validation: {
            tests: [
                {
                    name: "OllamaClientTests",
                    result: "18 cases (na DataRow-expansie): localhost / 127.0.0.1 / [::1] / .localhost geaccepteerd; example.com / 192.168.x / 10.x / internal.corp / 0.0.0.0 geweigerd",
                    type: "unit",
                },
                {
                    name: "Egress-controle (packet-capture)",
                    result: "Aanbeveling P1 — uit te voeren in doelomgeving",
                    type: "empirical",
                },
            ],
            mitigatesRisks: ["R8"],
            evalRef: "DV5 v3 §4.2.4; DV1 §5.1 + §5.3",
        },
    },

    "OC-5": {
        designDecision:
            "Geen persistente opslag van prompts/output. ChatHistory is List<ChatMessage> in-memory; " +
            "LocalLLMOptionsPage overschrijft LoadSettingsToStorage/SaveSettingsToStorage met no-op. " +
            "ExtensionLogger schrijft alleen tijd/lengte/status, geen inhoud.",
        origin: {
            dvs: ["DV1"],
            insights: ["IN_NOSTORE"],
            literature: ["OWASP_LLM_TOP10", "SHOSTACK_2014"],
            rationale:
                "Privacy by design (Cavoukian): default geen retentie. BIO 9.4 dataminimalisatie. " +
                "OWASP LLM06 (Sensitive Information Disclosure) vraagt minimalisatie van opgeslagen state.",
        },
        operational: {
            nfr: ["NFR-5"],
        },
        compliance: [
            { norm: "BIO 9.4", scope: "Dataminimalisatie" },
            { norm: "AVG 5.1.c", scope: "Dataminimalisatie" },
            { norm: "OWASP LLM06", scope: "Sensitive Information Disclosure" },
        ],
        implementation: [
            {
                module: "PromptOrchestrator.cs",
                lines: "r.48 (_history List<ChatMessage>) — in-memory",
            },
            {
                module: "ExtensionLogger.cs",
                lines: "Alleen Output-pane; geen File.Write / StreamWriter / FileStream",
            },
            {
                module: "LocalLLMOptionsPage.cs",
                lines: "r.135–148 — no-op overrides van Load/SaveSettingsToStorage",
            },
            {
                module: "ChatToolWindowControl.xaml",
                lines: "r.728–732 — UI-tekst 'History is in-memory and not saved'",
            },
        ],
        validation: {
            tests: [
                {
                    name: "Statische codescan",
                    result: "Grep over solution: 0 hits op File.Write* / StreamWriter / FileStream / WritableSettingsStore / BinaryFormatter in productiecode",
                    type: "static",
                },
                {
                    name: "Experimental-hive restart-test (P3)",
                    result: "Bevestigt dat OptionsPage-waarden niet persisteren na VS-restart",
                    type: "manual",
                },
            ],
            mitigatesRisks: ["R8"],
            evalRef: "DV5 v3 §4.2.5",
        },
    },

    "OC-6": {
        designDecision:
            "LocalLLM.Core kent geen VS-SDK references. Ollama draait als apart OS-proces. " +
            "SettingsProxy fungeert als trust-grens tussen Core en VSIX-host en lost tweefase-init " +
            "op zonder downstream-componenten te raken.",
        origin: {
            dvs: ["DV1", "DV4"],
            insights: ["IN_ISO"],
            literature: ["SHOSTACK_2014"],
            rationale:
                "Separation of Concerns (Dijkstra). Threat modeling (Shostack) vraagt expliciete " +
                "trust-boundaries en least privilege. STRIDE Elevation-of-Privilege wordt hiermee " +
                "structureel afgedekt.",
        },
        operational: {
            nfr: ["NFR-1"],
            c: ["C-1"],
        },
        compliance: [
            { norm: "BIO 6.1.2", scope: "Functiescheiding" },
        ],
        implementation: [
            {
                module: "LocalLLM.Core.csproj",
                lines: "Bewust GEEN Microsoft.VisualStudio.* references",
            },
            {
                module: "ChatToolWindow.cs",
                lines: "r.62–124 (composition root); r.166–218 (SettingsProxy als trust-grens)",
            },
            {
                module: "ContextProvider.cs",
                lines: "r.86 + r.118 (UI-thread switches)",
            },
        ],
        validation: {
            tests: [
                {
                    name: "Dependency-graph inspectie",
                    result: "Eenrichtingsverkeer Core ← VSIX bevestigd",
                    type: "static",
                },
                {
                    name: "STRIDE-analyse",
                    result: "EoP restrisico 'zeer laag'",
                    type: "review",
                },
            ],
            mitigatesRisks: [],
            evalRef: "DV5 v3 §4.4.2",
        },
    },

    "OC-7": {
        designDecision:
            "Uitsluitend gedocumenteerde VS SDK-types: AsyncPackage + PackageRegistration + " +
            "ProvideMenuResource + ProvideToolWindow + ProvideOptionPage. Geen private API's of reflection. " +
            "AllowsBackgroundLoading=true voor IDE-stabiliteit.",
        origin: {
            dvs: ["DV4"],
            insights: ["IN_SDK"],
            literature: ["MS_VS_EXT"],
            rationale:
                "Microsoft Extensibility Guidelines onderbouwen LTS-API gebruik. " +
                "Vermijdt onbeheersbare regressies bij VS-updates. " +
                "VSSDK best practices (Microsoft 2024).",
        },
        operational: {
            nfr: ["NFR-1"],
        },
        compliance: [
            { norm: "DBB BB-V", scope: "Verantwoording door opdrachtgever — supported API gebruik" },
        ],
        implementation: [
            {
                module: "LocalLLMPackage.cs",
                lines: "r.30–53 — AsyncPackage + ProvideMenuResource + ProvideToolWindow + ProvideOptionPage",
            },
            {
                module: "LocalLLMPackage.vsct",
                lines: "r.55–101 — guidImages/bmpOpenChat",
            },
            {
                module: "OpenChatWindowCommand.cs",
                lines: "r.45–66",
            },
            {
                module: "ChatToolWindow.cs",
                lines: "r.76 — KnownMonikers.MessageBubble als tab-icoon",
            },
        ],
        validation: {
            tests: [
                {
                    name: "VSIX-manifest validatie",
                    result: "PASS",
                    type: "build",
                },
                {
                    name: "Experimental-hive test in VS 2022 17.14",
                    result: "Geen stability warnings",
                    type: "manual",
                },
            ],
            mitigatesRisks: ["R4"],
            evalRef: "DV5 v3 §4.2.7",
        },
    },

    "OC-8": {
        designDecision:
            "Typed exceptions (OllamaUnavailableException, OllamaResponseException) maken " +
            "error-paden testbaar. Linked CancellationTokenSource met 5s timeout op IsAvailableAsync. " +
            "AsyncRelayCommand top-level catch beschermt async-void.",
        origin: {
            dvs: ["DV4", "DV5"],
            insights: ["IN_COMMS"],
            literature: ["MS_VS_EXT"],
            rationale:
                "Defensive programming (Meyer). Microsoft Extensibility guidelines voor " +
                "thread-safety. Foutbestendigheid is voorwaarde voor IDE-stabiliteit (NFR-1).",
        },
        operational: {
            nfr: ["NFR-4"],
            fr: ["FR-1"],
        },
        compliance: [
            { norm: "BIO 12.4", scope: "Logboeken en monitoring" },
            { norm: "OWASP LLM04", scope: "Model Denial of Service — timeouts" },
        ],
        implementation: [
            {
                module: "OllamaClient.cs",
                lines: "r.18–35 (typed exceptions); r.65–68 (HttpClient + 120s timeout); r.125–229 (SendChatAsync); r.240–258 (IsAvailableAsync linked CTS)",
            },
            {
                module: "ChatWindowViewModel.cs",
                lines: "r.267–282 (OnSettingsChanged + auto-refresh); r.326–375 (try/catch)",
            },
            {
                module: "AsyncRelayCommand.cs",
                lines: "r.42–119 — top-level catch + isExecuting-guard",
            },
        ],
        validation: {
            tests: [
                {
                    name: "OllamaClientTests",
                    result: "Dekt timeout / 4xx / 5xx / cancel / malformed JSON",
                    type: "unit",
                },
                {
                    name: "Foutinjectietest",
                    result: "Ollama-stop, timeout, 4xx, 5xx, malformed JSON — alle paden graceful",
                    type: "integration",
                },
            ],
            mitigatesRisks: [],
            evalRef: "DV5 v3 §4.2.8",
        },
    },

    "OC-9": {
        designDecision:
            "Context-strip toont vorm/herkomst vóór verzending. 'Ollama'-label op elk antwoord. " +
            "Status-dot in vier kleuren. Read-only settings-mirror met ⚙ Open settings-knop. " +
            "Markdown-rendering via Markdig 0.40.0 attached property.",
        origin: {
            dvs: ["DV5"],
            insights: ["IN_HITL", "IN_COMMS"],
            literature: ["AMERSHI_2019", "BARKE_2023"],
            rationale:
                "Amershi e.a. (2019): transparantie en feedback zijn dragende guidelines. " +
                "Barke e.a. (2023): developers vertrouwen output wanneer herkomst zichtbaar is. " +
                "Explainable AI (Gunning 2017) onderbouwt status-zichtbaarheid.",
        },
        operational: {
            fr: ["FR-7", "FR-2", "FR-4", "FR-6"],
            nfr: ["NFR-5", "NFR-3"],
        },
        compliance: [
            { norm: "D/303", scope: "Transparantie van systeemgedrag" },
        ],
        implementation: [
            {
                module: "Converters.cs",
                lines: "r.53–80 (MessageHeaderConverter)",
            },
            {
                module: "ChatToolWindowControl.xaml",
                lines: "r.521–540 (context-strip); r.564–655 (read-only Model/URL/Mode-mirror); r.466–494 (status-dot DataTriggers); r.250–263 (RichTextBox)",
            },
            {
                module: "MarkdownHelper.cs",
                lines: "Markdig 0.40.0 attached property — code-fences ondersteund",
            },
        ],
        validation: {
            tests: [
                {
                    name: "Usability-observatie",
                    result: "Gebruikers herkennen welke context is meegestuurd",
                    type: "empirical",
                },
                {
                    name: "Markdown-rendering code-review",
                    result: "Goedgekeurd",
                    type: "review",
                },
            ],
            mitigatesRisks: ["R9"],
            evalRef: "DV5 v3 §4.2.9 + §4.6",
        },
    },
};

/**
 * Ordering used by the OC Explorer (matches OC-1..OC-9 narrative order).
 */
export const OC_ORDER = [
    "OC-1",
    "OC-2",
    "OC-3",
    "OC-4",
    "OC-5",
    "OC-6",
    "OC-7",
    "OC-8",
    "OC-9",
];
