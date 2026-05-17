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
            "Bewuste keuze om geen IVsTextManager.ReplaceText of DTE.ActiveDocument.Selection te gebruiken. " +
            "In v0.4 versterkt: Apply uitgeschakeld tijdens streaming, na cancellation, bij incomplete output en bij niet-normale finish_reason.",
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
                lines: "DisplayMessages; IsDisclaimerVisible; DismissDisclaimerCommand; SessionDisclaimer; SendStreamingAsync (Apply-safety)",
            },
            {
                module: "ChatMessageDisplay.cs",
                lines: "CanApply: !IsStreaming && !IsCancelled && !IsIncomplete + FinishReason-controle",
            },
            {
                module: "ChatToolWindowControl.xaml",
                lines: "Banner 'AI-generated — human review required' + ✕-knop",
            },
        ],
        validation: {
            tests: [
                {
                    name: "Code-grep editor-manipulatie API's",
                    result: "0 hits (DV5 v7 §4.1)",
                    type: "static",
                },
                {
                    name: "ChatWindowViewModelStreamingTests",
                    result: "53 cases — streaming routing, Apply-safety, cancellation",
                    type: "unit",
                },
                {
                    name: "Gebruikersevaluatie banner-effectiviteit",
                    result: "Gepland in DV5-D5",
                    type: "empirical",
                },
            ],
            mitigatesRisks: ["R7", "R9"],
            evalRef: "DV5 v7 §4.1, §7",
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
                    result: "10 cases — factory-isolatie en mode-roundtrip",
                    type: "unit",
                },
                {
                    name: "InMemoryContextSettingsTests",
                    result: "26 cases — settings persistence, streaming/reasoning properties",
                    type: "unit",
                },
            ],
            mitigatesRisks: ["R8"],
            evalRef: "DV5 v3 §4.2.2 — payload-inspectie per scenario",
        },
    },

    "OC-3": {
        designDecision:
            "Niet-deterministische modelparameters (Temperature=0.2f, TopP=0.9f) vast in AppDefaults. " +
            "MaxTokensPreset biedt drie gecontroleerde output-budgetten (Standard=2048, Extended=4096, Large=8192) " +
            "i.p.v. vast NumPredict. Default Extended. Pinning-tests bewaken drift.",
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
                lines: "Temperature=0.2f; TopP=0.9f; DefaultMaxTokensPreset=Extended; MapMaxTokens()",
            },
            {
                module: "LlmClientBase.cs",
                lines: "BuildRequestJson en BuildStreamRequestJson gebruiken dezelfde AppDefaults-waarden",
            },
        ],
        validation: {
            tests: [
                {
                    name: "AppDefaultsTests",
                    result: "16 cases — pinning waarden + preset-mapping + integratie",
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
            "Tweelagenmodel voor offline verwerking: (1) URL-syntaxvalidatie in LlmClientBase.CreateBaseUri " +
            "(Uri.TryCreate + http/https-scheme check), gedeeld door OpenAICompatibleClient en OpenWebUIClient; " +
            "(2) endpoint-allow-listing op netwerklaag (firewall + JIVC SO&I-LAN-segmentatie). " +
            "Twee adapterprofielen: OpenAICompatibleClient (POST /v1/chat/completions, geen auth) en " +
            "OpenWebUIClient (POST /api/chat/completions, Bearer-token). Endpoint-keuze is beheerverantwoordelijkheid.",
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
                module: "LlmClientBase.cs",
                lines: "CreateBaseUri (Uri.TryCreate + http/https-scheme) — gedeeld door beide backends",
            },
            {
                module: "OpenAICompatibleClient.cs + OpenWebUIClient.cs",
                lines: "Implementaties van ILlmClient via LlmClientBase; URL-validatie geërfd; 100% lijn- en block-dekking",
            },
            {
                module: "LlmClientSelector.cs",
                lines: "Runtime backend-selectie op basis van ConnectionType-configuratie",
            },
            {
                module: "AppDefaults.cs",
                lines: "DefaultBaseUrl = http://localhost:11434 (dev-default)",
            },
        ],
        validation: {
            tests: [
                {
                    name: "OpenAICompatibleClientTests + ArgumentTests + StreamChatTests + OpenWebUIClientTests",
                    result: "63 URL-validatietests: alle geldige http(s)-URLs geaccepteerd; ongeldige (blanks, malformed, niet-http(s)) geweigerd",
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
            "Geen persistente opslag van interactie-inhoud (prompts, codecontext, chathistorie, modeloutput). " +
            "ChatHistory is List<ChatMessage> in-memory. Reasoning_content, cancelled en incomplete responses " +
            "worden niet als assistant-turn in history opgenomen. " +
            "Configuratie (Mode, ModelName, BaseUrl, ConnectionType, ApiToken, streaming/reasoning/MaxTokensPreset) " +
            "wordt via standaard DialogPage-persistentie opgeslagen. " +
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
                lines: "_history List<ChatMessage> — in-memory; RecordAssistantReply alleen bij complete succesvolle responses",
            },
            {
                module: "ChatWindowViewModel.cs",
                lines: "SendStreamingAsync: reasoning, cancelled en incomplete responses niet in history opgenomen",
            },
            {
                module: "ExtensionLogger.cs",
                lines: "Alleen Output-pane; geen File.Write / StreamWriter / FileStream",
            },
            {
                module: "LocalLLMOptionsPage.cs",
                lines: "Standaard DialogPage-persistentie voor configuratie; API-token als plaintext in per-user VS-profiel",
            },
            {
                module: "ChatToolWindowControl.xaml",
                lines: "UI-tekst 'Chat history is not saved between sessions'",
            },
        ],
        validation: {
            tests: [
                {
                    name: "Statische codescan",
                    result: "Grep over solution: 0 hits op File.Write* / StreamWriter / FileStream / BinaryFormatter voor opslag van interactie-inhoud",
                    type: "static",
                },
                {
                    name: "Experimental-hive restart-test (P2)",
                    result: "Chat-historie verdwijnt bij IDE-restart; OptionsPage-waarden behouden via DialogPage-persistentie",
                    type: "manual",
                },
                {
                    name: "ChatWindowViewModelStreamingTests",
                    result: "53 cases — history-regels bij streaming: reasoning, cancelled, incomplete niet opgenomen",
                    type: "unit",
                },
            ],
            mitigatesRisks: ["R8"],
            evalRef: "DV5 v3 §4.2.5",
        },
    },

    "OC-6": {
        designDecision:
            "LocalLLM.Core kent geen VS-SDK references. LLM-server draait als apart OS-proces. " +
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
            "Typed exceptions (LlmUnavailableException, LlmResponseException) maken " +
            "error-paden testbaar. LlmClientBase definieert URL-validatie en foutcontract voor beide backends. " +
            "In v0.4 uitgebreid met SSE-foutpaden: malformed SSE → IsIncomplete, non-SSE → FallbackToNonStreaming, " +
            "cancellation tijdens streaming, finish_reason-afhandeling. " +
            "Linked CancellationTokenSource met 5s timeout op IsAvailableAsync. " +
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
                module: "LlmClientBase.cs",
                lines: "CreateBaseUri, SendChatAsync, StreamChatAsync, PostStreamAsync, ReadSseStreamAsync — gedeeld validatie- en foutcontract",
            },
            {
                module: "OpenAICompatibleClient.cs",
                lines: "Typed exceptions (LlmUnavailableException, LlmResponseException); HttpClient + 120s timeout; exception-mapping; IsAvailableAsync linked CTS",
            },
            {
                module: "OpenWebUIClient.cs",
                lines: "Analoge foutafhandeling via LlmClientBase; Bearer-token auth; OpenAI-compatible response-mapping",
            },
            {
                module: "ChatWindowViewModel.cs",
                lines: "OnSettingsChanged + auto-refresh; typed catch-blokken voor streaming + non-streaming; ClearHistoryOnBackendChange",
            },
            {
                module: "AsyncRelayCommand.cs",
                lines: "Top-level catch + isExecuting-guard",
            },
        ],
        validation: {
            tests: [
                {
                    name: "OpenAICompatibleClientTests + SendChatTests",
                    result: "Dekken timeout / 4xx / 5xx / cancel / malformed JSON",
                    type: "unit",
                },
                {
                    name: "OpenAICompatibleClientStreamChatTests",
                    result: "33 cases — SSE, malformed JSON, missing [DONE], non-SSE fallback, cancellation, finish_reason",
                    type: "unit",
                },
                {
                    name: "OpenWebUIClientTests",
                    result: "22 cases — URL-validatie en response-mapping voor Open WebUI-backend",
                    type: "unit",
                },
                {
                    name: "Foutinjectietest",
                    result: "Timeout, 4xx, 5xx, malformed JSON, malformed SSE, non-SSE fallback — alle paden graceful; IDE blijft bruikbaar",
                    type: "integration",
                },
            ],
            mitigatesRisks: [],
            evalRef: "DV5 v3 §4.2.8",
        },
    },

    "OC-9": {
        designDecision:
            "Context-strip toont vorm/herkomst vóór verzending. Model-label op elk antwoord. " +
            "Status-dot in vier kleuren. Read-only settings-mirror (Model/Max tokens/Context/Streaming/Reasoning) " +
            "met ⚙ Open settings-knop. Markdown-rendering via Markdig 0.40.0 attached property. " +
            "In v0.4: streaming-statussen (streaming...), (cancelled), (incomplete); reasoning-expander " +
            "toont reasoning_content ingeklapt; automatische history-clear bij model/backendwijziging met infomelding.",
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
                lines: "MessageHeaderConverter",
            },
            {
                module: "ChatToolWindowControl.xaml",
                lines: "Context-strip; read-only settings-mirror (Model/Max tokens/Context/Streaming/Reasoning + ⚙-deeplink); status-dot DataTriggers; RichTextBox",
            },
            {
                module: "ChatMessageDisplay.cs",
                lines: "IsStreaming, IsCancelled, IsIncomplete, HasHiddenReasoning, ReasoningContent properties",
            },
            {
                module: "ChatWindowViewModel.cs",
                lines: "ClearHistoryOnBackendChange met infomelding en SessionDisclaimer-herstel",
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
