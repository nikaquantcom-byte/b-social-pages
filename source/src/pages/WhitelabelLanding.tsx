import { useLocation } from "wouter";

const STATS = [
  { value: "95.000+", label: "Steder i databasen" },
  { value: "6.400+", label: "Aktive events" },
  { value: "8+", label: "Lande dækket" },
  { value: "10+", label: "Kategorier" },
];

const FEATURES = [
  {
    icon: "🧠",
    title: "Motoren bag platformen",
    desc: "En avanceret relationsdatabase der i realtid kobler brugere, steder, events, firmaer, kategorier, tags, geografiske zoner og betalingsflows sammen.",
  },
  {
    icon: "🗺️",
    title: "Interaktivt verdenskort",
    desc: "Live kortvisning med geo-clustering af 95.000+ steder fordelt over hele verden — filtreret efter land, kategori og tags.",
  },
  {
    icon: "📡",
    title: "Realtids datafeed",
    desc: "Personaliseret feed med events, nyheder og trending indhold baseret på brugerens interesser, lokation og sociale graf.",
  },
  {
    icon: "🏢",
    title: "Firma-modul",
    desc: "Komplet selvbetjening for firmaer med CVR-opslag, event-oprettelse, targeting, analytics, fakturering og rekruttering.",
  },
  {
    icon: "🔗",
    title: "Social graf & beskeder",
    desc: "Bygget-in beskedsystem, notifikationer, communities & clubs, invitationer og et fuldt henvisningsprogram med provisions-tracking.",
  },
  {
    icon: "🌍",
    title: "Multi-sprog & lokalisering",
    desc: "Fuld dansk/engelsk lokalisering med i18n-support — klar til at skalere til nye markeder under dit brand.",
  },
];

export default function WhitelabelLanding() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#080c1a] text-white overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#080c1a]/90 backdrop-blur border-b border-white/5">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
            <circle cx="20" cy="20" r="17" stroke="#4ECDC4" strokeWidth="1.5" opacity="0.6" />
            <path d="M20 8 L22.5 18 L20 16 L17.5 18 Z" fill="#4ECDC4" />
            <path d="M20 32 L17.5 22 L20 24 L22.5 22 Z" fill="rgba(255,255,255,0.4)" />
            <circle cx="20" cy="20" r="2" fill="#4ECDC4" />
          </svg>
          <span className="font-bold text-lg tracking-tight">B-Social <span className="text-[#4ECDC4]">Whitelabel</span></span>
        </div>
        <a
          href="mailto:kontakt@b-social.net"
          className="px-5 py-2 rounded-xl bg-[#4ECDC4] text-[#080c1a] font-semibold text-sm hover:bg-[#3dbdb5] transition-colors"
        >
          Book demo
        </a>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6 flex flex-col items-center text-center overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(78,205,196,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#4ECDC4]/30 bg-[#4ECDC4]/10 text-[#4ECDC4] text-xs font-semibold uppercase tracking-widest mb-6">
          Whitelabel Platform
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight max-w-3xl mb-6">
          Din platform.
          <br />
          <span className="text-[#4ECDC4]">Dit brand.</span>
          <br />
          Vores motor.
        </h1>
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Få en komplet social oplevelses-platform i dit eget navn — bygget på B-Socials
          kraftfulde infrastruktur med 95.000+ steder og 6.400+ events på tværs af 8+ lande.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:kontakt@b-social.net"
            className="px-8 py-4 rounded-2xl bg-[#4ECDC4] text-[#080c1a] font-bold text-base hover:bg-[#3dbdb5] transition-colors shadow-lg shadow-[#4ECDC4]/20"
          >
            Kontakt os for en demo
          </a>
          <button
            onClick={() => setLocation("/")}
            className="px-8 py-4 rounded-2xl border border-white/20 text-white/70 font-medium text-base hover:bg-white/5 hover:text-white transition-colors"
          >
            Se platformen live
          </button>
        </div>
      </section>

      {/* STATS */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-center text-center"
            >
              <span className="text-3xl font-extrabold text-[#4ECDC4] mb-1">{s.value}</span>
              <span className="text-white/50 text-sm">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* DATABASE / MOTOR SEKTION */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Hjernen bag platformen
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Bag hver skærm ligger en kompleks relationsdatabase der i realtid håndterer
              tusindvis af datapunkter — fra personaliserede feeds til live kortvisning
              med 95.000+ steder over hele verden.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-[#4ECDC4]/40 hover:bg-white/8 transition-all"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HVAD DU FÅR */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto rounded-3xl border border-[#4ECDC4]/20 bg-gradient-to-br from-[#4ECDC4]/10 to-transparent p-10">
          <h2 className="text-3xl font-bold mb-6 text-center">Alt inkluderet — under dit brand</h2>
          <ul className="space-y-3 text-white/70 text-sm mb-8">
            {[
              "Dit eget domæne og visuel identitet (logo, farver, fonts)",
              "Komplet platform med alle B-Social features fra dag 1",
              "Adgang til hele den eksisterende database — eller afgrænset til dit marked",
              "Dedikeret opsætning, onboarding og teknisk support",
              "Løbende hosting, vedligeholdelse og nye features automatisk",
              "Firma-modul med selvbetjening, analytics og fakturering",
              "Multi-sprog support og klar til internationale markeder",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-[#4ECDC4] mt-0.5 shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PRIS */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Enkel, transparent prismodel</h2>
          <p className="text-white/50">Du betaler kun i takt med at din platform vokser.</p>
        </div>
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Setup */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col items-center text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Engangsbetaling</span>
            <span className="text-5xl font-extrabold text-white mb-1">€80.000</span>
            <span className="text-white/40 text-sm mb-6">Setup-fee</span>
            <p className="text-white/60 text-sm leading-relaxed">
              Komplet whitelabel-opsætning inkl. branding, domæne, konfiguration, datamigration og onboarding.
            </p>
          </div>
          {/* Revenue share */}
          <div className="rounded-3xl border border-[#4ECDC4]/30 bg-[#4ECDC4]/10 p-8 flex flex-col items-center text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#4ECDC4]/70 mb-3">Løbende</span>
            <span className="text-5xl font-extrabold text-[#4ECDC4] mb-1">5%</span>
            <span className="text-[#4ECDC4]/60 text-sm mb-6">af omsætningen</span>
            <p className="text-white/60 text-sm leading-relaxed">
              Ingen månedlige faste omkostninger. Du betaler en andel af det din platform genererer.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Klar til at bygge din platform?</h2>
          <p className="text-white/50 mb-8">
            Kontakt os for en uforpligtende demo og se hvad B-Social-motoren kan gøre for dit brand.
          </p>
          <a
            href="mailto:kontakt@b-social.net"
            className="inline-block px-10 py-4 rounded-2xl bg-[#4ECDC4] text-[#080c1a] font-bold text-base hover:bg-[#3dbdb5] transition-colors shadow-lg shadow-[#4ECDC4]/20"
          >
            Kontakt os
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-white/30 text-xs">
        © 2026 B-Social · Alle rettigheder forbeholdes ·{" "}
        <button onClick={() => setLocation("/privatlivspolitik")} className="hover:text-white/60 transition-colors">
          Privatlivspolitik
        </button>
      </footer>
    </div>
  );
}
