import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { bindReferral } from "@/hooks/useReferral";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (mode === "login") {
      const { error: authError } = await signIn(email, password);
      if (authError) {
        setError("Forkert e-mail eller adgangskode. Pr\u00f8v igen.");
        setLoading(false);
      } else {
        setLocation("/feed");
      }
    } else {
      if (!name.trim()) {
        setError("Skriv dit navn");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError("Adgangskode skal v\u00e6re mindst 6 tegn");
        setLoading(false);
        return;
      }

      const { error: authError, needsConfirmation } = await signUp(email, password, name);
      if (authError) {
        const msg = authError.message;
        if (msg.includes("already registered")) {
          setError("Denne e-mail er allerede registreret. Pr\u00f8v at logge ind.");
        } else {
          setError(msg);
        }
        setLoading(false);
      } else if (needsConfirmation) {
        setSuccessMsg("Tjek din e-mail for at bekr\u00e6fte din konto, og log derefter ind.");
        setMode("login");
        setLoading(false);
      } else {
        // Auto-logged in -> bind referral then go to onboarding
        // Get user from auth state
        const { data: { user } } = await (await import("@/lib/supabase")).supabase.auth.getUser();
        if (user) {
          await bindReferral(user.id);
        }
        setLocation("/onboarding");
      }
    }
  };

  return (
    <div
      className="relative min-h-svh flex flex-col"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(10,14,35,0.60) 0%, rgba(10,14,35,0.80) 100%),
          url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&auto=format&fit=crop')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      data-testid="auth-page"
    >
      {/* Back button */}
      <div className="pt-12 px-5">
        <button
          onClick={() => window.history.back()}
          className="w-9 h-9 rounded-full glass-card flex items-center justify-center"
          data-testid="button-back"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 pb-16">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl glass-card-strong flex items-center justify-center mb-4">
            <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10" aria-label="B-Social logo">
              <circle cx="20" cy="20" r="17" stroke="#4ECDC4" strokeWidth="1.5" opacity="0.6" />
              <path d="M20 8 L22.5 18 L20 16 L17.5 18 Z" fill="#4ECDC4" />
              <path d="M20 32 L17.5 22 L20 24 L22.5 22 Z" fill="rgba(255,255,255,0.4)" />
              <circle cx="20" cy="20" r="2" fill="#4ECDC4" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold">
            {mode === "login" ? "Log ind" : "Opret konto"}
          </h1>
          <p className="text-white/50 text-sm mt-1">
            {mode === "login"
              ? "Velkommen tilbage til B-Social"
              : "Bliv en del af B-Social"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center" data-testid="error-message">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-[#4ECDC4]/20 border border-[#4ECDC4]/30 text-[#4ECDC4] text-sm text-center" data-testid="success-message">
              {successMsg}
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-white/60 text-xs font-medium pl-1">Navn</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dit navn"
                required
                className="w-full px-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/60 focus:border-[#4ECDC4]/40 transition-all"
                data-testid="input-name"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-white/60 text-xs font-medium pl-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.dk"
              required
              className="w-full px-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/60 focus:border-[#4ECDC4]/40 transition-all"
              data-testid="input-email"
            />
          </div>

          <div className="space-y-1">
            <label className="text-white/60 text-xs font-medium pl-1">Adgangskode</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                required
                minLength={6}
                className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#4ECDC4]/60 focus:border-[#4ECDC4]/40 transition-all"
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                data-testid="button-toggle-password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {mode === "signup" && (
              <p className="text-white/30 text-xs pl-1">Mindst 6 tegn</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#4ECDC4] text-white font-semibold text-base hover:bg-[#3dbdb5] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#4ECDC4]/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            data-testid="button-submit-auth"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading
              ? (mode === "login" ? "Logger ind..." : "Opretter...")
              : (mode === "login" ? "Log ind" : "Opret konto")}
          </button>
        </form>

        {/* Toggle mode */}
        <p className="text-center text-white/50 text-sm mt-5">
          {mode === "login" ? "Har du ikke en konto? " : "Har du allerede en konto? "}
          <span
            className="text-[#4ECDC4] font-semibold cursor-pointer hover:underline"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
              setSuccessMsg(null);
            }}
            data-testid="link-toggle-mode"
          >
            {mode === "login" ? "Opret konto" : "Log ind"}
          </span>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/30 text-xs">eller</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Continue without login */}
        <button
          onClick={() => setLocation("/feed")}
          className="w-full py-3.5 rounded-2xl glass-card text-white/60 font-medium text-sm hover:text-white hover:bg-white/10 transition-all"
          data-testid="button-continue-without-login"
        >
          Forts\u00e6t uden login
        </button>

        <p className="text-center text-white/30 text-xs mt-6 leading-relaxed">
          Ved at oprette en konto accepterer du vores{" "}
          <span className="text-white/50 underline cursor-pointer">vilk\u00e5r</span> og{" "}
          <span className="text-white/50 underline cursor-pointer">privatlivspolitik</span>
        </p>
      </div>
    </div>
  );
}
