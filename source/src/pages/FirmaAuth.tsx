import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2, Building2, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

type Plan = "free" | "starter" | "pro" | "enterprise";

const PLANS: { id: Plan; name: string; price: string; features: string[] }[] = [
  {
    id: "free",
    name: "Gratis",
    price: "0 kr/md",
    features: ["1 aktiv event", "Basis synlighed", "Firmaprofil"],
  },
  {
    id: "starter",
    name: "Starter",
    price: "299 kr/md",
    features: ["5 events", "Målretning", "Statistik", "Prioriteret support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "799 kr/md",
    features: ["Ubegrænsede events", "Avanceret målretning", "API-adgang", "Kampagneværktøjer"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Kontakt os",
    features: ["Alt i Pro", "Dedikeret kontakt", "SLA-garanti", "Brugerdefinerede integrationer"],
  },
];

export default function FirmaAuth() {
  const [, setLocation] = useLocation();
  const { user, isLoggedIn, refreshProfile } = useAuth();

  const [companyName, setCompanyName] = useState("");
  const [cvr, setCvr] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<Plan>("free");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isLoggedIn()) {
      setError("Du skal være logget ind for at oprette en firmakonto. Log ind først.");
      return;
    }

    if (!companyName.trim()) {
      setError("Firmanavn er påkrævet");
      return;
    }
    if (!cvr.trim() || cvr.length < 8) {
      setError("Gyldigt CVR-nummer er påkrævet (8 cifre)");
      return;
    }
    if (!email.trim()) {
      setError("Firma-e-mail er påkrævet");
      return;
    }

    setLoading(true);

    try {
      // 1. Create company entry
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .insert({
          name: companyName.trim(),
          cvr: cvr.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          plan: selectedPlan,
          created_by: user!.id,
        })
        .select("id")
        .single();

      if (companyError) {
        if (companyError.message.includes("duplicate") || companyError.message.includes("unique")) {
          setError("Et firma med dette CVR-nummer findes allerede.");
        } else {
          setError("Kunne ikke oprette firma: " + companyError.message);
        }
        setLoading(false);
        return;
      }

      // 2. Create company_members entry
      const { error: memberError } = await supabase
        .from("company_members")
        .insert({
          company_id: company.id,
          user_id: user!.id,
          role: "owner",
        });

      if (memberError) {
        console.error("Company member creation error:", memberError);
      }

      // 3. Update user profile role to 'firma'
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ role: "firma" })
        .eq("id", user!.id);

      if (profileError) {
        console.error("Profile role update error:", profileError);
      }

      // 4. Refresh profile to pick up new role + companyId
      await refreshProfile();

      // 5. Redirect to firma dashboard
      setLocation("/firma");
    } catch (err) {
      setError("Der opstod en uventet fejl. Prøv igen.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-svh flex flex-col"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(10,14,35,0.85) 0%, rgba(10,14,35,0.95) 100%),
          url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Back button */}
      <div className="pt-12 px-5">
        <button
          onClick={() => window.history.back()}
          className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pb-16 pt-6 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-4">
            <Building2 size={28} className="text-[#4ECDC4]" />
          </div>
          <h1 className="text-white text-2xl font-bold">Bliv firma på B-Social</h1>
          <p className="text-white/50 text-sm mt-1 text-center">
            Opret din virksomhedsprofil og nå ud til aktive brugere
          </p>
        </div>

        {!isLoggedIn() && (
          <div className="p-4 rounded-2xl bg-yellow-500/15 border border-yellow-500/25 text-yellow-300 text-sm text-center mb-6">
            Du skal være logget ind for at oprette en firmakonto.{" "}
            <span
              className="underline cursor-pointer font-semibold"
              onClick={() => setLocation("/auth")}
            >
              Log ind her
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {/* Company info */}
          <div className="space-y-4">
            <h2 className="text-white/80 text-sm font-semibold uppercase tracking-wider">Firmaoplysninger</h2>

            <div className="space-y-1">
              <label className="text-white/60 text-xs font-medium pl-1">Firmanavn</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="F.eks. Aalborg Fitness"
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/60 focus:border-[#4ECDC4]/40 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-white/60 text-xs font-medium pl-1">CVR-nummer</label>
              <input
                type="text"
                value={cvr}
                onChange={(e) => setCvr(e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="12345678"
                required
                maxLength={8}
                className="w-full px-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/60 focus:border-[#4ECDC4]/40 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-white/60 text-xs font-medium pl-1">Firma-e-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kontakt@firma.dk"
                  required
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/60 focus:border-[#4ECDC4]/40 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-white/60 text-xs font-medium pl-1">Telefon (valgfrit)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+45 12 34 56 78"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/60 focus:border-[#4ECDC4]/40 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Plan selection */}
          <div className="space-y-3">
            <h2 className="text-white/80 text-sm font-semibold uppercase tracking-wider">Vælg plan</h2>
            <div className="grid grid-cols-2 gap-3">
              {PLANS.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-4 rounded-2xl border text-left transition-all ${
                    selectedPlan === plan.id
                      ? "bg-[#4ECDC4]/15 border-[#4ECDC4]/50 ring-1 ring-[#4ECDC4]/30"
                      : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
                  }`}
                >
                  {selectedPlan === plan.id && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#4ECDC4] flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <div className="text-white font-semibold text-sm">{plan.name}</div>
                  <div className="text-[#4ECDC4] text-xs font-medium mt-0.5">{plan.price}</div>
                  <ul className="mt-2 space-y-1">
                    {plan.features.map((f) => (
                      <li key={f} className="text-white/40 text-xs">
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !isLoggedIn()}
            className="w-full py-4 rounded-2xl bg-[#4ECDC4] text-white font-semibold text-base hover:bg-[#3dbdb5] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#4ECDC4]/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Opretter firma..." : "Opret firmakonto"}
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-6 leading-relaxed">
          Ved at oprette en firmakonto accepterer du vores{" "}
          <span
            className="text-white/50 underline cursor-pointer"
            onClick={() => setLocation("/vilkaar")}
          >
            vilkår
          </span>{" "}
          og{" "}
          <span
            className="text-white/50 underline cursor-pointer"
            onClick={() => setLocation("/privatlivspolitik")}
          >
            privatlivspolitik
          </span>
        </p>
      </div>
    </div>
  );
}
