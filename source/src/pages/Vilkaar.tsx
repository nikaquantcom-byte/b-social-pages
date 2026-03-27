import { ArrowLeft, FileText } from "lucide-react";
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

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 w-1 h-1 rounded-full bg-[#4ECDC4] flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}

export default function Vilkaar() {
  const [, setLocation] = useLocation();

  return (
    <div
      className="relative min-h-svh pb-16"
      style={{ background: "#0D1220" }}
      data-testid="vilkaar-page"
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
        <h1 className="text-white text-xl font-bold">Vilkår og betingelser</h1>
      </div>

      <div className="px-5 mt-2 space-y-4">
        {/* Intro card */}
        <div className="glass-card-strong rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
            <FileText size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">B-Social.net</p>
            <p className="text-white/50 text-xs mt-0.5">Gældende fra: 27. marts 2026</p>
            <p className="text-white/60 text-xs mt-2 leading-relaxed">
              Disse vilkår og betingelser regulerer din brug af B-Social-platformen. Ved at oprette en konto accepterer du disse vilkår i sin helhed. Læs dem venligst omhyggeligt.
            </p>
          </div>
        </div>

        {/* 1. Om B-Social */}
        <Section title="1. Om B-Social">
          <p>
            B-Social er en dansk social platform med base i Aalborg, der forbinder mennesker via lokale sociale arrangementer. Platformen er tilgængelig som en progressiv webapp (PWA) på b-social.net.
          </p>
          <p>
            Kontakt: <a href="mailto:kontakt@b-social.net" className="text-[#4ECDC4] underline underline-offset-2">kontakt@b-social.net</a>
          </p>
        </Section>

        {/* 2. Acceptbetingelser */}
        <Section title="2. Accept af vilkår">
          <p>
            Ved at registrere dig og bruge B-Social bekræfter du, at:
          </p>
          <ul className="space-y-1.5 mt-1">
            <Li>Du er mindst 16 år gammel</Li>
            <Li>Du har læst og accepteret disse vilkår samt vores privatlivspolitik</Li>
            <Li>De oplysninger, du angiver under registrering, er korrekte og opdaterede</Li>
            <Li>Du bruger platformen i overensstemmelse med gældende dansk og EU-lovgivning</Li>
          </ul>
        </Section>

        {/* 3. Brugerkonto */}
        <Section title="3. Brugerkonto og sikkerhed">
          <p>
            Du er ansvarlig for at opretholde fortroligheden af dine loginoplysninger og for al aktivitet, der finder sted på din konto. Du skal straks underrette os på <a href="mailto:kontakt@b-social.net" className="text-[#4ECDC4] underline underline-offset-2">kontakt@b-social.net</a>, hvis du har mistanke om uautoriseret adgang til din konto.
          </p>
          <p>
            Du kan oprette konto via e-mail/adgangskode eller via Google OAuth. Ved brug af Google OAuth er Googles egne vilkår og privatlivspolitik ligeledes gældende.
          </p>
        </Section>

        {/* 4. Platformens formål */}
        <Section title="4. Platformens formål og tilladte brug">
          <p>
            B-Social er udelukkende beregnet til at facilitere sociale arrangementer og kontakt mellem mennesker. Det er tilladt at:
          </p>
          <ul className="space-y-1.5 mt-1">
            <Li>Oprette og tilmelde sig sociale arrangementer</Li>
            <Li>Kommunikere med andre brugere via platformen</Li>
            <Li>Oprette en offentlig profil med dine interesser og præferencer</Li>
          </ul>
          <p className="mt-2">Det er ikke tilladt at:</p>
          <ul className="space-y-1.5 mt-1">
            <Li>Anvende platformen til kommercielle formål uden skriftlig aftale med B-Social</Li>
            <Li>Sende spam, uopfordret markedsføring eller chikane</Li>
            <Li>Udgive sig for at være en anden person</Li>
            <Li>Offentliggøre ulovligt, stødende eller krænkende indhold</Li>
            <Li>Forsøge at omgå eller kompromittere platformens sikkerhed</Li>
            <Li>Indsamle oplysninger om andre brugere til kommercielle formål</Li>
          </ul>
        </Section>

        {/* 5. Brugerindhold */}
        <Section title="5. Brugerindhold">
          <p>
            Du bevarer ejerskabet til det indhold, du opretter og deler på platformen (herunder profiloplysninger, arrangementsbeskrivelser og beskeder). Ved at uploade indhold giver du B-Social en ikke-eksklusiv, royaltyfri licens til at vise og distribuere dette indhold på platformen med henblik på at drifte tjenesten.
          </p>
          <p>
            Du er selv ansvarlig for det indhold, du deler. Indhold, der overtræder disse vilkår, kan blive fjernet uden varsel.
          </p>
        </Section>

        {/* 6. Arrangementer */}
        <Section title="6. Arrangementer og deltagelse">
          <p>
            B-Social fungerer som en formidlingsplatform og er ikke direkte arrangør af de events, der oprettes af brugerne. Arrangørerne er selv ansvarlige for indholdet og afviklingen af deres arrangementer.
          </p>
          <p>
            B-Social påtager sig intet ansvar for skader, ulykker eller andre hændelser, der opstår i forbindelse med arrangementer formidlet via platformen. Deltagelse sker på eget ansvar.
          </p>
        </Section>

        {/* 7. Immaterialrettigheder */}
        <Section title="7. Intellektuelle rettigheder">
          <p>
            Alle rettigheder til platformen, herunder design, kode, logo og indhold produceret af B-Social, tilhører B-Social. Du må ikke kopiere, modificere, distribuere eller anvende disse til kommercielle formål uden forudgående skriftlig tilladelse.
          </p>
        </Section>

        {/* 8. Ansvarsbegrænsning */}
        <Section title="8. Ansvarsbegrænsning">
          <p>
            B-Social leveres "som den er" og "som tilgængelig". Vi stræber efter høj tilgængelighed, men garanterer ikke uafbrudt eller fejlfri drift. B-Social er ikke ansvarlig for:
          </p>
          <ul className="space-y-1.5 mt-1">
            <Li>Tab eller skade som følge af din brug af platformen</Li>
            <Li>Handlinger foretaget af andre brugere</Li>
            <Li>Midlertidige nedetider eller tekniske fejl</Li>
            <Li>Tab af data som følge af force majeure-begivenheder</Li>
          </ul>
          <p>
            B-Socials samlede ansvar over for dig er under alle omstændigheder begrænset til det beløb, du eventuelt har betalt for at bruge platformen inden for de seneste 12 måneder.
          </p>
        </Section>

        {/* 9. Opsigelse */}
        <Section title="9. Opsigelse og kontosletning">
          <p>
            Du kan til enhver tid slette din konto under Indstillinger i appen. Kontosletning medfører sletning af dine personoplysninger i overensstemmelse med vores privatlivspolitik.
          </p>
          <p>
            B-Social forbeholder sig retten til at suspendere eller slette konti, der overtræder disse vilkår, uden forudgående varsel.
          </p>
        </Section>

        {/* 10. Ændringer */}
        <Section title="10. Ændringer i vilkårene">
          <p>
            Vi kan opdatere disse vilkår med rimeligt varsel. Væsentlige ændringer vil blive meddelt via e-mail eller notifikation i appen mindst 14 dage inden ikrafttrædelse. Fortsat brug af platformen efter ikrafttrædelsen udgør accept af de opdaterede vilkår.
          </p>
        </Section>

        {/* 11. Lovvalg */}
        <Section title="11. Lovvalg og tvistløsning">
          <p>
            Disse vilkår er underlagt dansk ret. Eventuelle tvister, der opstår i forbindelse med brugen af B-Social, søges løst ved forhandling. Kan dette ikke lykkes, afgøres tvisten ved de danske domstole med Retten i Aalborg som værneting i første instans.
          </p>
          <p>
            Du kan også indgive en klage til Center for Klageløsning eller EU's online klageplatform på <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-[#4ECDC4] underline underline-offset-2">ec.europa.eu/consumers/odr</a>.
          </p>
        </Section>

        {/* 12. Kontakt */}
        <Section title="12. Kontakt">
          <p>
            Har du spørgsmål til disse vilkår, er du velkommen til at kontakte os:
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
          <p className="text-white/15 text-[10px] mt-1">Disse vilkår er underlagt dansk ret</p>
        </div>
      </div>
    </div>
  );
}
