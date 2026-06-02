# Verdediging Q&A — Voorbereiding

**Onderzoek:** Veilige en beheersbare integratie van een lokaal gehost LLM in VS 2022 binnen een gesloten Defensieomgeving  
**Versie:** MVP v0.4 · DV5 v5 · Mei 2026

Dit document bevat **vijfentwintig waarschijnlijke examinatorvragen** met uitgewerkte antwoorden. Indeling per thema.

---

## A. Onderzoeksmethodologie

### A1. Waarom heb je gekozen voor een ontwerpgericht onderzoek (Wieringa) en niet voor een klassiek empirisch onderzoek?

**Antwoord:** De onderzoeksvraag vraagt om een *ontwerp als antwoord*: een extensie die veilig en beheersbaar is. Wieringa's design science maakt het verschil tussen de *kennis-bijdrage* (ontwerpcriteria, architectuurprincipes) en het *artefact* (de extensie) expliciet. Klassiek empirisch onderzoek beantwoordt "hoe is de wereld?" — dat is niet de juiste lens voor de vraag "hoe bouwen we dit veilig?". De design cycle geeft bovendien een structuur voor iteratie: probleem → ontwerp → validatie → reflectie. Dat sluit aan op hoe de MVP daadwerkelijk is ontwikkeld, van v0.1 t/m v0.4.

---

### A2. Hoe heb je de kwaliteit van je literatuursynthese geborgd? Hoe weet je dat je geen relevante bronnen hebt gemist?

**Antwoord:** De literatuurstudie is opgebouwd rond drie domeinen: LLM-gedrag, beveiliging en IDE-integratie. Per domein heb ik gezocht op kernbegrippen in Google Scholar, ACM DL en de Avans-bibliotheek. Vervolgens ben ik via referenties 'backward snowballed' en heb ik via Google Scholar gekeken welke recentere papers de gevonden bronnen citeren. De definitieve selectie bevat alleen bronnen die direct bijdragen aan een synthese-inzicht — bronnen die ik heb gelezen maar waarvan de inhoud niet onderscheidend was ten opzichte van al geselecteerde bronnen zijn buiten het kader gebleven. Ik erken dat het kader niet uitputtend is; er is geen veldexpert of peer reviewer ingeschakeld. Dat is een expliciete beperking.

---

### A3. Je gebruikt vijf deelvragen. Waarom precies vijf, en hoe zijn ze onderling afhankelijk?

**Antwoord:** De vijf deelvragen volgen de logische opbouw van een bouw-en-evalueer-cyclus. DV1 en DV2 zijn de *probleem-fase*: wat zijn de eisen vanuit beveiliging en vanuit stakeholders? DV3 is de *verkenningsfase*: wat weten we al uit bestaande oplossingen? DV4 is de *ontwerp-fase*: hoe ziet de architectuur eruit? DV5 is de *evaluatie-fase*: werkt het? Ze zijn sequentieel afhankelijk: zonder DV1/DV2 heb je geen eisen, zonder eisen geen ontwerp (DV4), zonder ontwerp geen evaluatie (DV5). DV3 voedt DV4 met ontwerpprincipes. De keuze voor vijf is pragmatisch: één per fase, met DV3 als verrijking van de ontwerpbasis.

---

## B. Theoretisch kader

### B1. Welke literatuurbron is het meest bepalend geweest voor je ontwerp, en waarom?

**Antwoord:** Amershi et al. (2019) — *Guidelines for Human-AI Interaction* van Microsoft Research. Richtlijn G1 ("Make clear what the AI can and cannot do") en G14 ("Encourage trial and error") zijn direct terug te vinden in OC-1 en OC-9. De human-in-the-loop keuze — geen auto-apply, output als voorstel — is rechtstreeks afgeleid uit dit kader. Dat is ook de meest bevestigde keuze in de GAT: 4,8 op 5. Shostack over threat modeling (STRIDE) is qua impact op de beveiligingsdimensie vergelijkbaar belangrijk, maar Amershi is de bron die het meest concreet gedragsbepaalde uitkomsten had voor het eindontwerp.

---

### B2. Je noemt in het Venn-diagram dat context-selectie een "kwaliteitskwestie én een privacykwestie" is. Kun je dat concretiseren?

**Antwoord:** Vanuit kwaliteit: Grounded generation-literatuur (Barke et al., 2023) laat zien dat LLM-output sterk verbetert als het model relevante code als context ontvangt. Te weinig context leidt tot hallucinaties of generieke antwoorden — dit bevestigt de GAT ook: gebruikers koppelden onbetrouwbare output aan onvoldoende context. Vanuit privacy: hoe meer context je stuurt, hoe groter de kans dat gevoelige informatie — kwalificaties, algoritmen, klantdata — naar het model gaat. OC-2 adresseert precies dit spanningsveld door de controle bij de ontwikkelaar te leggen: die kiest expliciet welk niveau van context passend is per taak.

---

### B3. Hoe verhoudt jouw onderzoek zich tot bestaande tools zoals GitHub Copilot of Cursor?

**Antwoord:** DV3 heeft bestaande oplossingen vergeleken. GitHub Copilot stuurt context naar externe servers — dat is fundamenteel onverenigbaar met een air-gapped Defensieomgeving. Continue.dev is het dichtst bij mijn aanpak maar heeft geen Visual Studio 2022-extensie (wel VS Code) en biedt geen gelaagd contextmodel. Cursor integreert volledig op codebase-niveau, wat het risico op data-exfiltratie vergroot. Mijn bijdrage is niet "een andere tool bouwen", maar een op specifieke beveiligingskaders gebaseerd ontwerp dat aantoonbaar voldoet aan BIO, D/300-serie en OWASP LLM Top 10 — en dat traceerbaar is terug naar literatuur en normen.

---

## C. Ontwerpcriteria en traceability

### C1. Hoe heb je bepaald dat je negen ontwerpcriteria nodig had, en niet vijf of vijftien?

**Antwoord:** De OC's zijn niet vooraf geteld maar bottom-up afgeleid via synthese-inzichten. Elk inzicht dat leidde tot een onderscheidende ontwerpbeslissing — een beslissing die zonder dat inzicht anders was geweest — heeft een OC opgeleverd. Inzichten die overlappen zijn samengevoegd: OC-5 (geen persistente opslag) en OC-6 (scheiding verantwoordelijkheden) hadden samengevoegd kunnen worden, maar de implementations zijn zo verschillend dat afzonderlijke criteria de traceability helderder houden. Het getal negen is dus een resultaat, geen keuze.

---

### C2. OC-4 ("volledig offline") zeg je dat de borging mede bij de netwerklaag ligt. Is dat niet een ontwerpfout — dat jouw software iets belooft wat je zelf niet kunt garanderen?

**Antwoord:** Dit is een bewuste en expliciet gedocumenteerde architectuurkeuze. De extensie valideert via `CreateBaseUri` dat de ingestelde endpoint een geldige absolute HTTP(S)-URI is, en beperkt alle modelcommunicatie tot precies dat geconfigureerde endpoint. Wat de extensie *niet* kan, is nagaan of dat endpoint intern of extern is — dat is een netwerkverantwoordelijkheid, niet een applicatieverantwoordelijkheid. Dit tweelagen-model is gangbaar in beveiligingsontwerp: applicaties valideren invoer en beperkingen, infrastructuur dwingt netwerk-isolatie af. In de DV5-synthese staat dit expliciet als architectuurafbakening, niet als tekortkoming.

---

### C3. Welk OC vond je het moeilijkst te operationaliseren, en waarom?

**Antwoord:** OC-9 — transparante interactie. Het doel is dat de gebruiker altijd weet wat het systeem doet: welke context is verstuurd, welk model antwoordt, en of de output streaming of reasoning betreft. Dat klinkt simpel maar vereist meerdere UI-onderdelen die samen moeten werken: de context-strip, de model-header in elke bubble, het reasoning-blok, de streaming-indicator. In de GAT scoort "inzicht in verzonden informatie" 3,2 op 5 — het zwakste Likert-resultaat. Dat bevestigt dat operationalisering van transparantie een voortdurend verbetertraject is, geen eenmalige keuze.

---

## D. Architectuur en implementatie

### D1. Waarom heb je gekozen voor .NET Framework 4.8 en niet voor .NET 8?

**Antwoord:** Visual Studio 2022-extensies draaien in het VS-hostproces, dat op .NET Framework 4.8 loopt. Een VS-extensie kan geen andere runtime-versie kiezen dan de host. Migratie naar een .NET 8-geïsoleerd-procesmodel (VSSDK out-of-process host) bestaat maar is experimenteel en brengt aanzienlijke complexiteit mee die buiten de MVP-scope valt. Binnen .NET Framework 4.8 is gewerkt met C# 7.3, wat moderne patronen als async/await en interfaces volledig ondersteunt.

---

### D2. Je Core-bibliotheek heeft geen VS-SDK-referenties. Wat levert dat concreet op?

**Antwoord:** Drie voordelen. Ten eerste testbaarheid: alle klassen in LocalLLM.Core zijn testbaar zonder een VS-hostproces op te starten — dat maakt MSTest-uitvoering in CI mogelijk en is de reden waarom 499 tests überhaupt geautomatiseerd draaien. Ten tweede onderhoudbaarheid: bij een VS-SDK-versiesprong hoef je alleen de VSIX-adapter aan te passen, niet de core-logica. Ten derde portabiliteit: de Core-bibliotheek kan in principe hergebruikt worden in een VS Code-extensie of een command-line tool, zonder aanpassingen. OC-6 — scheiding van verantwoordelijkheden — is hier het architectuurprincipe achter.

---

### D3. Streaming via SSE was eerst buiten de MVP-scope (NFR-3 "Nee"). Waarom is het alsnog in v0.4 gekomen?

**Antwoord:** Twee redenen. Ten eerste: de NFR-2 meting liet zien dat in de lokale omgeving de totale outputtijd gemiddeld 13,66 seconden bedraagt. Zonder streaming ziet de gebruiker 13 seconden lang alleen een typing-indicator en dan ineens de volledige respons. Dat is functioneel maar ervaart als "bevroren". Streaming verlaagt de totale T_output niet, maar verlaagt de *tijd-tot-eerste-token* (TTFT) — de gebruiker ziet output vrijwel direct na aanvang van inferentie. Ten tweede: in de productieomgeving (LITON, Land_IT model) is de totale T_output al laag, maar versterkt streaming de ervaren responsiviteit verder. De implementatie via SSE (Server-Sent Events) bleek in de OpenAI-compatibele API goed te realiseren met de bestaande architectuur.

---

### D4. Hoe is het Apply-mechanisme gebouwd en waarom heb je gekozen voor de VS Suggestions API?

**Antwoord:** In v0.2 gebruikte Apply een modaal DiffPreviewWindow — een eigen venster dat de diff toonde. Dat werkte maar voelde niet native aan en had problemen met indentatie-normalisatie. In v0.3 is overgestapt naar de VS Suggestions API: dit is de ingebouwde diff-preview die VS zelf gebruikt voor quick fixes en refactoring suggesties. Het geeft een inline preview direct in de editor, met dezelfde look-and-feel als de rest van VS. Voor de beveiligingsredenering is de keuze ook relevant: Apply gebruikt de officiële extensibility-API's (IVsTextManager, suggestion-provider contract), geen directe buffer-manipulatie. Dat is consistent met OC-7 — gebruik van ondersteunde mechanismen.

---

## E. Evaluatie en validatie (technisch)

### E1. 62,7% lijn-dekking op projectniveau klinkt niet heel hoog. Waarom is dat geen probleem?

**Antwoord:** Dat getal vraagt inderdaad uitleg. De Coverlet-engine meetelt de volledige codebase inclusief WPF View-laag — XAML-controls, auto-generated BAML-bindings, en resource-klassen. Die zijn architectureel buiten de unit-testscope, omdat ze direct afhankelijk zijn van een VS-hostproces en WPF-dispatcher die niet in een testrunner beschikbaar zijn. Als ik de meting beperk tot de Core-scope — de unit-testbare services, viewmodels, DTO's en clients — haal ik 93,9% lijn-dekking en 85% branch-dekking. De waarde van de 499 tests ligt niet primair in het percentage, maar in de *traceability*: voor elke ontwerpinvariant — ContextMode-ceiling, vaste modelparameters, foutafhandeling, URL-validatie — zijn tests aanwezig die breken als de invariant wordt geschonden.

---

### E2. Je hebt acht mutatietests uitgevoerd. Dat is een erg klein aantal — waarom?

**Antwoord:** Mutatietests zijn selectief ingezet op de acht *kritiekste ontwerpinvarianten* — de invarianten die direct een OC onderbouwen en waarbij een stille regressie de meeste schade aanricht. Dat zijn onder andere de temperature/topP-pinning in AppDefaults, de ContextMode-ceiling logica en de URL-rejectie in CreateBaseUri. Voor een breder mutatieregime zou PIT of Stryker nodig zijn; die draaien niet in .NET Framework 4.8 zonder aanzienlijke configuratie-inspanning. De acht mutatietests zijn een gerichte kwaliteitscheck, geen volledige mutatiedekking. Dat staat ook zo vermeld in het testrapport.

---

### E3. Je STRIDE-analyse geeft "Gedeeltelijk" bij Repudiation. Kun je dat motiveren?

**Antwoord:** Repudiation gaat over de vraag of een gebruiker kan ontkennen dat hij een bepaalde actie heeft uitgevoerd. De extensie logt via `ExtensionLogger` de tijdstempel en de lengte van berichten — maar *niet de inhoud*. De reden is OC-5: geen persistente opslag van prompts of modeloutput. Volledige logging van prompt-inhoud zou informatiebeveiliging verbeteren maar tegelijk een nieuw privacyrisico introduceren — de logbestanden zouden zelf een data-exfiltratie-risico worden. De keuze is dus bewust: de beheersbaarheid wint het van de wenselijkheid van volledige auditlogging. Het restrisico is "Gedeeltelijk" en niet "Laag" omdat er bij een beveiligingsincident geen reconstructie van prompts mogelijk is.

---

### E4. Hoe heb je geborgen dat je mutatietests en coverage-metingen objectief zijn, als jij zelf de tests hebt geschreven?

**Antwoord:** Volledig objectief is het niet — dat is een erkende beperking in DV5 sectie 6. De borging zit in drie mechanismen. Ten eerste zijn de OC's *vooraf* vastgesteld en de tests zijn *daarna* geschreven om die OC's te toetsen — de criteria waren dus niet gebaseerd op wat makkelijk testbaar was. Ten tweede zijn de tests traceerbaar: elke testklasse verwijst in zijn naam en in de testmethodenamen naar het OC of de requirement die het dekt. Ten derde zijn de mutatietests de sterkste zelftest: als een mutant die een boundary condition verwijdert niet wordt gevangen, heb ik een test die ik dacht te hebben niet werkelijk. Van de acht mutanten zijn er acht gevangen — dat geeft redelijke zekerheid over de kritiekste paden.

---

## F. Gebruikersacceptatietest

### F1. Vijf respondenten is erg weinig. Kun je hier statistisch iets mee?

**Antwoord:** Nee, niet in statistisch-inferentiële zin. Met n=5 is er geen sprake van statistische generaliseerbaarheid; dat staat ook zo in DV5 §6. Wat ik er wél mee kan: indicatief inzicht in de ervaringen van de doelgroep. In kwalitatief onderzoek op beperkte schaal — wat dit feitelijk is — is het patroon-principe leidend: bevindingen die door meerdere respondenten worden benoemd (zoals context-begrenzing als knelpunt, en human-in-the-loop als sterk punt) hebben meer gewicht dan eenmalige observaties. De GAT is dan ook expliciet als *aanvullende* dimensie gepresenteerd naast de statische evaluatie, niet als de primaire validatiemethode.

---

### F2. De GAT is uitgevoerd met v0.3, maar de conclusies gelden voor v0.4. Is dat niet methodologisch onzuiver?

**Antwoord:** Dat is een terechte observatie, en die staat ook zo in DV5 §6. De keuze is pragmatisch: v0.4 was niet klaar op het moment dat de testperiode liep. De bevindingen uit de GAT zijn voor v0.4 relevant op twee manieren. Ten eerste zijn de bevindingen die directe verbeterpunten in v0.4 hebben opgeleverd — de behoefte aan streaming, betere contexttransparantie — nu geadresseerd. Ten tweede zijn de bevindingen die *niet* versie-afhankelijk zijn — zoals de beoordeling van human-in-the-loop, de perceptie van Defensie-potentie — nog steeds geldig. De conclusie die ik trek is dan ook gecalibreerd: "de MVP voldoet in de doelgroep" — niet "v0.4 specifiek is gevalideerd door de GAT".

---

### F3. De score voor "inzicht in verzonden informatie" (OC-9) is 3,2 op 5. Betekent dit dat OC-9 faalt?

**Antwoord:** Nee, maar het nuanceert het. OC-9 is als "Ja" beoordeeld in de technische evaluatie: de context-strip toont welke informatie wordt meegezonden, de model-header toont welk model antwoordt, en streaming/reasoning zijn zichtbaar gemaakt. Het gat zit in de begrijpelijkheid: gebruikers zíen de informatie, maar snappen niet altijd de koppeling tussen de getoonde context en de actuele vraag. Dat is een UX-probleem, geen architectuurprobleem. De aanbeveling in DV5 §5.8.3 (C10) beschrijft een expliciete contextselectie via een contextmenu als verbeterrichting. Dat valt buiten de MVP-scope maar is een concrete doorontwikkelingstap.

---

### F4. Gebruikers melden dat de Apply-functionaliteit "nog niet volwassen genoeg is voor blind vertrouwen." Hoe kijk je daarop terug?

**Antwoord:** Die feedback is terecht en sluit aan op de technische bevindingen. Apply werkt via de VS Suggestions API, maar heeft bekende randgevallen: indentatie-normalisatie bij mixed-indent code, en edge cases bij full-file-refactors buiten de geselecteerde range. De human-in-the-loop aanpak — OC-1 — voorkomt dat Apply-fouten direct tot onbeheersbare codewijzigingen leiden: de gebruiker moet altijd bevestigen. Maar dat haalt de verantwoordelijkheid voor validatie bij het systeem weg en legt die bij de gebruiker. Aanbeveling C15 in DV5 §5.8.3 beschrijft inline Apply-regressietests en een compatibiliteitsmatrix per VS-versie als structurele oplossing.

---

## G. Beveiliging en Defensie-context

### G1. Je noemt BIO, D/300-serie en OWASP LLM. Hoe heb je bepaald welke normen van toepassing zijn en welke niet?

**Antwoord:** Via de scoping van DV1. De Baseline Informatiebeveiliging Overheid (BIO) is van toepassing op alle informatiesystemen bij de Rijksoverheid, inclusief Defensie. De D/300-serie (beveiligingsbeleid Defensie) is de specifieke uitwerking voor de doelomgeving. OWASP LLM Top 10 is een sector-erkend kader voor LLM-applicatiebeveiliging — geen norm maar een best-practice reference. Het DBB (Defensie Beveiligingsbeleid) bepaalt de classificatieniveaus. Normen die ik expliciet buiten scope heb gelaten zijn ISO 27001 (te breed voor een MVP-evaluatie) en specifieke cryptografische normen (niet relevant voor een lokale LLM die geen versleutelde communicatie vereist buiten het interne netwerk).

---

### G2. OWASP LLM01 (Prompt injection) staat in jouw analyse als "inherent aan elk LLM-gebruik." Hoe beperk je dat risico dan?

**Antwoord:** Volledig elimineren is niet mogelijk zolang er een LLM in het systeem zit — dat is de aard van het risico. De mitigatie in de MVP is gelaagd. Ten eerste: de context-ceiling (OC-2) beperkt wat een aanvaller überhaupt in de context kan injecteren — alleen expliciet geselecteerde code. Ten tweede: de human-in-the-loop (OC-1) voorkomt dat een geïnjecteerde instructie direct tot code-uitvoering leidt; de gebruiker ziet de output altijd eerst. Ten derde: de extensie heeft geen toegang tot het filesystem, de VS command-API of externe netwerken — er zijn geen "tools" die een geïnjecteerde instructie kan aanroepen. Het residuele risico is dat een gebruiker misleide modeloutput handmatig toepast — dat is een gedragsrisico, geen technisch risico, en is gemitigeerd door de banner en de SessionDisclaimer.

---

### G3. Packet capture voor OC-4 stond in de originele planning van de GAT maar is niet uitgevoerd. Hoe borgt je dan de offline-claim?

**Antwoord:** De packet capture is inderdaad niet als afzonderlijke meting uitgevoerd. De borging van OC-4 berust op twee pijlers. Ten eerste architectureel: de extensie heeft één enkel geconfigureerd endpoint waarnaartoe HTTP-verkeer mag. Er zijn geen andere uitgaande verbindingen — dat is aantoonbaar via code-grep op alle HTTP-aanroepen (één aanroeplocatie: LlmClientBase.SendRequestAsync). Ten tweede infrastructureel: in de productieomgeving dwingt het LITON-netwerk via firewall en segmentatie af dat alleen goedgekeurde interne endpoints bereikbaar zijn. De packet capture was bedoeld als empirische bevestiging van iets wat statisch al aantoonbaar is. Ik erken dat het wenselijk is voor een hogere zekerheidsgraad — het is opgenomen als aanbeveling voor een volgende evaluatieronde.

---

## H. Beperkingen en validiteit

### H1. Je hebt de evaluatie zelf uitgevoerd als ontwikkelaar van de MVP. Hoe heb je bevestigingsbias beperkt?

**Antwoord:** Vier maatregelen. Ten eerste vooraf vastgestelde criteria: de OC's en de acceptatievoorwaarden waren gedocumenteerd vóórdat de evaluatie plaatsvond. Ik kon niet achteraf bepalen wat "voldaan" betekent. Ten tweede geautomatiseerde tests: 499 MSTest-cases zijn objectief — ze slagen of falen, ongeacht mijn mening. Ten derde externe gebruikers: de GAT geeft inzicht van mensen die niet bij het ontwerp betrokken waren en die ook negatieve feedback hebben gegeven. Ten vierde expliciete documentatie van beperkingen: ik heb bewust zaken als "gedeeltelijk" of "open" gerapporteerd waar dat van toepassing was — NFR-2 lokaal, OC-4 netwerklaag, packet capture. Dat maakt de evaluatie transparanter dan wanneer ik alleen de positieve resultaten had getoond.

---

### H2. Het onderzoek is uitgevoerd in een niet-geclassificeerde omgeving. Hoe geldig zijn de conclusies dan voor de echte Defensieomgeving?

**Antwoord:** De conclusies over softwareontwerp en architectuur zijn overdraagbaar: de extensie is ontworpen om te draaien op de LITON-omgeving en de productie-NFR-2 metingen zijn ook op LITON uitgevoerd. De conclusies over het model zelf zijn beperkter: de GAT gebruikte het Land_IT-model, maar de kwaliteit van dat model en de specifieke classificatieniveaus waarop het werkt zijn buiten de onderzoeksscope. Wat ik heb aangetoond is dat de *integratie-laag* — de extensie — voldoet aan de gestelde eisen. Of het gekozen model geschikt is voor geclassificeerde informatie, vereist een aparte beoordeling door JIVC en de beveiligingsautoriteit.

---

## I. Toekomstige ontwikkeling

### I1. Wat is de belangrijkste aanbeveling voor een hypothetische v1.0?

**Antwoord:** Betere contexttransparantie (aanbeveling C10): een expliciete contextselectie via rechtsklik-menu waarbij de gebruiker per vraag kiest welke bestanden, methoden of diagnostics worden meegestuurd. Dit adresseert het laagste GAT-signaal (OC-9, 3,2/5), lost de spanning tussen contextbeperking en outputkwaliteit deels op, en maakt de keuze zichtbaarder — wat ook bijdraagt aan OC-2. Technisch is het werk (schatting 1-2 dagen), maar de architectuur ondersteunt het al: ContextProvider en ContextSelection zijn voldoende abstract om extra contexttypen te ontvangen.

---

### I2. Je roadmap toont v0.5 en v1.0 als "buiten scope." Wie neemt de overdracht over?

**Antwoord:** De extensie is gebouwd binnen de afdeling JIVC SO&I. De overdracht is gepland als deel van het afstudeertraject: broncode staat in het interne git-repository, er is een VSIX-installatiepakket, een gebruikershandleiding en dit digitale portfolio dat de architectuurkeuzes en traceability documenteert. Wie precies het eigenaarschap neemt is een organisatievraag die buiten mijn bevoegdheid ligt. Wat ik wel heb geborgd is dat de documentatie toereikend is voor een overdracht: elk ontwerpcriterium heeft een herleidbaar bewijs-spoor naar code, test en literatuur. Een nieuw teamlid kan de OC Explorer als onboarding-tool gebruiken.

---

## J. Persoonlijke reflectie

### J1. Wat heb je in dit onderzoek het meest geleerd?

**Antwoord:** De waarde van traceability als *discipline*, niet als formaliteit. Aan het begin van het traject zag ik de traceability matrix als een rapportageverplichting. In de loop van het onderzoek merkte ik dat het een *sturingsinstrument* is: als ik een ontwerpbeslissing niet kon herleiden naar een OC, was dat een signaal dat de beslissing niet goed genoeg onderbouwd was — of dat de OC moest worden uitgebreid. Die reflectie heeft mij geholpen om ontwerpkeuzes beter te articuleren en ook eerder te herkennen wanneer ik een aanname maakte die ik nog niet had gevalideerd.

---

### J2. Wat zou je anders doen als je opnieuw begon?

**Antwoord:** De gebruikersacceptatietest eerder in het traject plannen — bij voorkeur na v0.2 al een kleinere pilotronde met twee of drie gebruikers. Nu heeft de GAT plaatsgevonden in de afrondingsfase, met v0.3. Dat betekent dat de feedback over context-UX en Apply-volwassenheid wel in DV5 is opgenomen maar pas in v0.4 geadresseerd kon worden — te laat om de GAT te herhalen. Een eerder feedback-moment had meer iteraties mogelijk gemaakt. Dat is consistent met de Wieringa-cyclus: validatie moet je meerdere keren doorlopen, niet alleen aan het einde.

---

## K. Jokerkaarten (onverwachte vragen)

### K1. Stel dat een commissielid zegt: "Dit had ook een simpele proxy-server kunnen zijn. Waarom een VS-extensie?"

**Antwoord:** Een proxy-server lost het netwerk-isolatieprobleem deels op maar mist drie kernvereisten. Ten eerste IDE-integratie: de meerwaarde van een LLM voor ontwikkelaars zit in context — weten waar de cursor staat, welke code geselecteerd is, welke methode actief is. Dat is alleen beschikbaar vanuit de IDE zelf. Een proxy heeft die context niet. Ten tweede human-in-the-loop in de editor: Apply werkt via de VS Suggestions API — dat vereist een extensie. Ten derde controlebaarheid: een extensie heeft expliciet beperkte rechten binnen VS. Een proxy-server is een apart proces met andere vertrouwensgrenzen. De keuze voor een extensie is dus een *ontwerpmotivatie*, geen technische toevalligheid.

---

### K2. Stel dat een commissielid vraagt: "Is dit eigenlijk wel AI-onderzoek? Je hebt zelf geen model gebouwd."

**Antwoord:** Klopt — en dat is bewust. Het onderzoek is gericht op de *integratie-laag*, niet op modelbouw. Dat is een legitiem en relevant onderzoeksdomein. De meeste organisaties die LLM's willen inzetten bouwen geen eigen modellen; ze integreren bestaande modellen in hun werkprocessen. De vraag "hoe doe je dat veilig en beheersbaar?" is precies die vraag. Vergelijkbaar: een onderzoek naar veilig gebruik van HTTPS-verbindingen is ook relevant zonder dat je het TLS-protocol zelf ontwerpt. De wetenschappelijke bijdrage zit in de *ontwerpkennis*: welke ontwerpcriteria zijn nodig, hoe zijn ze herleidbaar, en werken ze in de praktijk?

---

*Einde Q&A-document — 25 vragen · Mei 2026*
