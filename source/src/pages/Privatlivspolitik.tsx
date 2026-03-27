import { ArrowLeft, Shield } from "lucide-react";
import { useLocation } from "wouter";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-3">
      <h2 className="text-white font-semibold text-base">{title}</h2>
      <div className="space-y-2 text-white/70 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-white/90 font-medium text-sm">{title}</h3>
      <div className="text-white/70 text-sm leading-relaxed space-y-1">
        {children}
      </div>
    </div>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#4ECDC4] flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export default function Privatlivspolitik() {
  const [, setLocation] = useLocation();

  return (
    <div
      className="relative min-h-svh pb-16"
      style={{ background: "#0D1220" }}
      data-testid="privatlivspolitik-page"
    >
      {/* Header */}
      <div
        className="sticky top-0 z-30 pt-12 pb-3 px-5 flex items-center gap-3"
        style={{ background: "linear-gradient(to bottom, rgba(10,14,35,0.97) 60%, transparent)" }}
      >
        <button
          onClick={() => setLocation(-1 as unknown as string)}
          className="w-9 h-9 rounded-full glass-card flex items-center justify-center"
          aria-label="Gå tilbage"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="text-white text-xl font-bold">Privatlivspolitik</h1>
      </div>

      <div className="px-5 mt-2 space-y-4">
        {/* Intro card */}
        <div className="glass-card-strong rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#4ECDC4]/15 flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-[#4ECDC4]" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">B-Social.net</p>
            <p className="text-white/50 text-xs mt-0.5">Sidst opdateret: 27. marts 2026</p>
            <p className="text-white/60 text-xs mt-2 leading-relaxed">
              Denne privatlivspolitik beskriver, hvordan B-Social indsamler, behandler og beskytter dine personoplysninger i overensstemmelse med EU's databeskyttelsesforordning (GDPR).
            </p>
          </div>
        </div>

        {/* 1. Dataansvarlig */}
        <Section title="1. Dataansvarlig">
          <p>
            Den dataansvarlige for behandlingen af dine personoplysninger er:
          </p>
          <div className="glass-card rounded-xl p-3 space-y-0.5 text-white/60 text-xs">
            <p className="text-white/80 font-medium">B-Social</p>
            <p>Aalborg, Danmark</p>
            <p>E-mail: <a href="mailto:kontakt@b-social.net" className="text-[#4ECDC4] underline underline-offset-2">kontakt@b-social.net</a></p>
            <p>Hjemmeside: <a href="https://b-social.net" className="text-[#4ECDC4] underline underline-offset-2">b-social.net</a></p>
          </div>
        </Section>

        {/* 2. Oplysninger vi indsamler */}
        <Section title="2. Personoplysninger vi indsamler">
          <SubSection title="2.1 Profiloplysninger">
            <ul className="space-y-1.5">
              <Li>Navn og e-mailadresse</Li>
              <Li>Profilbillede (avatar)</Li>
              <Li>By og interesser/tags</Li>
              <Li>Oplysninger fra Google-konto ved login via Google OAuth (navn, e-mail, profilbillede)</Li>
            </ul>
          </SubSection>
          <SubSection title="2.2 Aktivitetsdata">
            <ul className="space-y-1.5">
              <Li>Deltagelse i arrangementer (tilmelding, afmelding, historik)</Li>
              <Li>Beskeder sendt via vores chatfunktion</Li>
              <Li>Oprettede arrangementer og interaktioner med andre brugere</Li>
            </ul>
          </SubSection>
          <SubSection title="2.3 Lokationsdata">
            <ul className="space-y-1.5">
              <Li>By og søgeradius-præferencer til filtrering af arrangementer</Li>
              <Li>Vi gemmer ikke præcis GPS-position permanent</Li>
            </ul>
          </SubSection>
          <SubSection title="2.4 Tekniske oplysninger">
            <ul className="space-y-1.5">
              <Li>Enhedsoplysninger til push-notifikationer (PWA-token)</Li>
              <Li>IP-adresse og browsertypeoplysninger via Cloudflare CDN</Li>
              <Li>Brugsdata og adfærdsanalyse via Google Tag Manager (G-RKKL2TJLKK)</Li>
            </ul>
          </SubSection>
          <SubSection title="2.5 AI-chatassistent">
            <p>
              Hvis du bruger vores AI-chatassistent (drevet af Cloudflare Workers AI / Llama 3.1), behandles dine beskeder til assistenten med henblik på at generere svar. Samtaler kan midlertidigt behandles i hukommelsen, men gemmes ikke permanent tilknyttet din identitet.
            </p>
          </SubSection>
        </Section>

        {/* 3. Formål og retsgrundlag */}
        <Section title="3. Formål med og retsgrundlag for behandlingen">
          <p>Vi behandler dine oplysninger til følgende formål og på følgende retsgrundlag (GDPR artikel 6):</p>
          <div className="space-y-3 mt-1">
            <div className="glass-card rounded-xl p-3 space-y-1">
              <p className="text-white/80 text-xs font-medium">Oprettelse og drift af brugerkonto</p>
              <p className="text-white/50 text-xs">Retsgrundlag: Opfyldelse af kontrakt (art. 6, stk. 1, litra b)</p>
            </div>
            <div className="glass-card rounded-xl p-3 space-y-1">
              <p className="text-white/80 text-xs font-medium">Formidling af sociale arrangementer og matchning af brugere</p>
              <p className="text-white/50 text-xs">Retsgrundlag: Opfyldelse af kontrakt (art. 6, stk. 1, litra b)</p>
            </div>
            <div className="glass-card rounded-xl p-3 space-y-1">
              <p className="text-white/80 text-xs font-medium">Kommunikation via beskeder og notifikationer</p>
              <p className="text-white/50 text-xs">Retsgrundlag: Opfyldelse af kontrakt (art. 6, stk. 1, litra b)</p>
            </div>
            <div className="glass-card rounded-xl p-3 space-y-1">
              <p className="text-white/80 text-xs font-medium">Forbedring af platformen via analyse og statistik</p>
              <p className="text-white/50 text-xs">Retsgrundlag: Legitim interesse (art. 6, stk. 1, litra f)</p>
            </div>
            <div className="glass-card rounded-xl p-3 space-y-1">
              <p className="text-white/80 text-xs font-medium">Overholdelse af juridiske forpligtelser</p>
              <p className="text-white/50 text-xs">Retsgrundlag: Juridisk forpligtelse (art. 6, stk. 1, litra c)</p>
            </div>
          </div>
        </Section>

        {/* 4. Databehandlere og videregivelse */}
        <Section title="4. Databehandlere og videregivelse af oplysninger">
          <p>
            Vi deler dine oplysninger med følgende databehandlere og tredjeparter for at drive platformen:
          </p>
          <div className="space-y-3 mt-1">
            <div className="glass-card rounded-xl p-3 space-y-1">
              <p className="text-white/80 text-xs font-medium">Supabase (PostgreSQL-database og autentificering)</p>
              <p className="text-white/50 text-xs">Hosting: Amazon Web Services, eu-west-1 (Irland). Data opbevares inden for EU/EØS.</p>
            </div>
            <div className="glass-card rounded-xl p-3 space-y-1">
              <p className="text-white/80 text-xs font-medium">Cloudflare (CDN og Workers)</p>
              <p className="text-white/50 text-xs">Hostes globalt af Cloudflare, Inc. Cloudflare behandler trafik igennem europæiske datacentre. Cloudflare er certificeret under EU-US Data Privacy Framework.</p>
            </div>
            <div className="glass-card rounded-xl p-3 space-y-1">
              <p className="text-white/80 text-xs font-medium">Google LLC (OAuth og Tag Manager)</p>
              <p className="text-white/50 text-xs">Login via Google OAuth og anonym analysesporing via Google Tag Manager (G-RKKL2TJLKK). Google er certificeret under EU-US Data Privacy Framework.</p>
            </div>
            <div className="glass-card rounded-xl p-3 space-y-1">
              <p className="text-white/80 text-xs font-medium">Cloudflare Workers AI (Llama 3.1)</p>
              <p className="text-white/50 text-xs">AI-chatassistenten kører via Cloudflare Workers AI. Beskeder behandles til generering af svar og opbevares ikke varigt.</p>
            </div>
          </div>
          <p className="mt-2">
            Vi videregiver ikke dine oplysninger til andre tredjeparter, medmindre det kræves ved lov eller efter din udtrykkelige samtykke.
          </p>
        </Section>

        {/* 5. Overførsler til tredjelande */}
        <Section title="5. Overførsler til tredjelande">
          <p>
            Vores primære database er hostet af Supabase i AWS eu-west-1 (Irland) og forbliver inden for EU/EØS.
          </p>
          <p>
            Google LLC og Cloudflare, Inc. er amerikanske virksomheder. Overførsler til disse behandles på baggrund af EU-US Data Privacy Framework og EU's standardkontraktbestemmelser (SCC), som sikrer et tilstrækkeligt beskyttelsesniveau for dine personoplysninger.
          </p>
        </Section>

        {/* 6. Opbevaringsperiode */}
        <Section title="6. Opbevaringsperiode">
          <ul className="space-y-1.5">
            <Li>Profiloplysninger: Opbevares så længe din konto er aktiv. Slettes inden 30 dage efter sletning af konto.</Li>
            <Li>Arrangementhistorik: Opbevares i op til 2 år efter arrangementets afholdelse.</Li>
            <Li>Chatbeskeder: Opbevares i op til 1 år, medmindre du sletter dem tidligere.</Li>
            <Li>Push-notifikationstoken: Slettes ved afmelding af notifikationer eller kontosletning.</Li>
            <Li>Analysedata (Google Tag Manager): Anonymiserede data opbevares i op til 26 måneder i overensstemmelse med Google Analytics' standardindstillinger.</Li>
          </ul>
        </Section>

        {/* 7. Dine rettigheder */}
        <Section title="7. Dine rettigheder">
          <p>
            Du har følgende rettigheder i henhold til GDPR. Du kan udøve dem ved at kontakte os på <a href="mailto:kontakt@b-social.net" className="text-[#4ECDC4] underline underline-offset-2">kontakt@b-social.net</a>:
          </p>
          <div className="space-y-2 mt-1">
            <div className="glass-card rounded-xl p-3 space-y-0.5">
              <p className="text-white/80 text-xs font-medium">Ret til indsigt (art. 15)</p>
              <p className="text-white/50 text-xs">Du kan til enhver tid anmode om at se de oplysninger, vi behandler om dig.</p>
            </div>
            <div className="glass-card rounded-xl p-3 space-y-0.5">
              <p className="text-white/80 text-xs font-medium">Ret til berigtigelse (art. 16)</p>
              <p className="text-white/50 text-xs">Du kan anmode om rettelse af urigtige eller ufuldstændige oplysninger.</p>
            </div>
            <div className="glass-card rounded-xl p-3 space-y-0.5">
              <p className="text-white/80 text-xs font-medium">Ret til sletning ("retten til at blive glemt") (art. 17)</p>
              <p className="text-white/50 text-xs">Du kan anmode om sletning af dine oplysninger. Du kan også slette din konto direkte i appen under Indstillinger.</p>
            </div>
            <div className="glass-card rounded-xl p-3 space-y-0.5">
              <p className="text-white/80 text-xs font-medium">Ret til dataportabilitet (art. 20)</p>
              <p className="text-white/50 text-xs">Du kan anmode om at modtage dine data i et struktureret, maskinlæsbart format (JSON).</p>
            </div>
            <div className="glass-card rounded-xl p-3 space-y-0.5">
              <p className="text-white/80 text-xs font-medium">Ret til indsigelse (art. 21)</p>
              <p className="text-white/50 text-xs">Du kan gøre indsigelse mod behandling af dine oplysninger, der sker på grundlag af legitim interesse.</p>
            </div>
            <div className="glass-card rounded-xl p-3 space-y-0.5">
              <p className="text-white/80 text-xs font-medium">Ret til begrænsning af behandling (art. 18)</p>
              <p className="text-white/50 text-xs">Du kan anmode om, at behandlingen af dine oplysninger begrænses i visse tilfælde.</p>
            </div>
          </div>
          <p className="mt-2">
            Vi besvarer din henvendelse senest inden for 30 dage.
          </p>
        </Section>

        {/* 8. Cookies */}
        <Section title="8. Cookies og sporingsteknologier">
          <p>
            B-Social anvender cookies og lignende teknologier til at drifte platformen og forbedre brugeroplevelsen.
          </p>
          <SubSection title="Nødvendige cookies">
            <p>
              Sessionsdata og autentificeringscookies (Supabase JWT-token) er nødvendige for, at appen kan fungere. Disse kan ikke fravælges.
            </p>
          </SubSection>
          <SubSection title="Analytiske cookies (Google Tag Manager)">
            <p>
              Vi anvender Google Tag Manager (G-RKKL2TJLKK) til at indsamle anonymiserede brugsdata, som hjælper os med at forstå, hvordan platformen bruges. Disse cookies sættes kun med dit samtykke ved brug af appen.
            </p>
          </SubSection>
          <SubSection title="PWA og push-notifikationer">
            <p>
              Hvis du accepterer push-notifikationer, gemmes et enhedstoken lokalt og i vores database. Du kan til enhver tid trække dette samtykke tilbage under Indstillinger.
            </p>
          </SubSection>
        </Section>

        {/* 9. Sikkerhed */}
        <Section title="9. Datasikkerhed">
          <p>
            Vi tager beskyttelsen af dine personoplysninger alvorligt og har implementeret passende tekniske og organisatoriske sikkerhedsforanstaltninger, herunder:
          </p>
          <ul className="space-y-1.5 mt-1">
            <Li>Krypteret datatransmission via HTTPS/TLS</Li>
            <Li>Adgangskontrol og rollebaserede tilladelser i databasen (Supabase Row Level Security)</Li>
            <Li>Krypteret opbevaring i databasen</Li>
            <Li>DDoS-beskyttelse og firewall via Cloudflare</Li>
          </ul>
          <p>
            I tilfælde af et sikkerhedsbrud, der udgør en høj risiko for dine rettigheder og frihedsrettigheder, vil vi underrette dig hurtigst muligt og senest inden for 72 timer efter konstatering.
          </p>
        </Section>

        {/* 10. Børn */}
        <Section title="10. Børn og aldersgrænse">
          <p>
            B-Social er ikke rettet mod personer under 16 år. Vi indsamler ikke bevidst personoplysninger fra børn under 16 år. Hvis vi bliver opmærksomme på, at et barn under 16 år har oprettet en konto, vil vi slette oplysningerne hurtigst muligt. Kontakt os på <a href="mailto:kontakt@b-social.net" className="text-[#4ECDC4] underline underline-offset-2">kontakt@b-social.net</a>, hvis du mener dette er sket.
          </p>
        </Section>

        {/* 11. Ændringer */}
        <Section title="11. Ændringer til privatlivspolitikken">
          <p>
            Vi forbeholder os retten til at opdatere denne privatlivspolitik. Væsentlige ændringer vil blive meddelt via e-mail eller en synlig notifikation i appen mindst 14 dage, inden de træder i kraft. Dato for seneste opdatering fremgår øverst på denne side.
          </p>
        </Section>

        {/* 12. Klage */}
        <Section title="12. Tilsynsmyndighed og klage">
          <p>
            Du har ret til at indgive en klage til den kompetente tilsynsmyndighed, hvis du mener, at vi behandler dine personoplysninger i strid med GDPR:
          </p>
          <div className="glass-card rounded-xl p-3 space-y-0.5 text-white/60 text-xs mt-1">
            <p className="text-white/80 font-medium">Datatilsynet</p>
            <p>Carl Jacobsens Vej 35</p>
            <p>2500 Valby</p>
            <p>Telefon: +45 33 19 32 00</p>
            <p>
              Hjemmeside:{" "}
              <a
                href="https://www.datatilsynet.dk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4ECDC4] underline underline-offset-2"
              >
                datatilsynet.dk
              </a>
            </p>
          </div>
        </Section>

        {/* 13. Kontakt */}
        <Section title="13. Kontakt">
          <p>
            Har du spørgsmål til vores behandling af dine personoplysninger, er du altid velkommen til at kontakte os:
          </p>
          <div className="glass-card rounded-xl p-3 space-y-0.5 text-white/60 text-xs mt-1">
            <p className="text-white/80 font-medium">B-Social</p>
            <p>Aalborg, Danmark</p>
            <p>
              E-mail:{" "}
              <a href="mailto:kontakt@b-social.net" className="text-[#4ECDC4] underline underline-offset-2">
                kontakt@b-social.net
              </a>
            </p>
          </div>
        </Section>

        {/* Footer */}
        <div className="text-center pt-2 pb-8">
          <p className="text-white/20 text-[10px]">B-Social · Aalborg, Danmark · 27. marts 2026</p>
          <p className="text-white/15 text-[10px] mt-1">Denne politik er udformet i overensstemmelse med GDPR (EU 2016/679)</p>
        </div>
      </div>
    </div>
  );
}
