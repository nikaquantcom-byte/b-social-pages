import { createRoot } from "react-dom/client";
import "./lib/i18n";
import App from "./App";
import "./index.css";
import { supabase } from "./lib/supabase";

// ── Step 1: Unregister any old Service Workers ──
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    for (const r of regs) r.unregister();
  });
  if ("caches" in window) {
    caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
  }
}

// ── Step 2: Handle PKCE OAuth callback ──
// With PKCE flow, Supabase returns ?code=xxx in the URL.
// We must let Supabase exchange the code BEFORE cleaning the URL.
const searchParams = new URLSearchParams(window.location.search);
const code = searchParams.get("code");
const returnTo = searchParams.get("returnTo");
const errorDescription = searchParams.get("error_description");

async function bootstrap() {
  if (code) {
    // PKCE callback: let Supabase exchange the code for a session
    // This reads ?code= from window.location and persists the session to localStorage
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[Auth] Code exchange failed:", error.message);
    }
    // NOW clean the URL (code has been consumed)
    const dest = returnTo || "/feed";
    window.history.replaceState(null, "", dest);
  } else if (errorDescription) {
    window.history.replaceState(null, "", "/auth");
  } else {
    // Normal app load — path routing, no hash needed
    // Redirect old hash URLs to clean paths for returning users
    const rawHash = window.location.hash;
    if (rawHash && rawHash.startsWith("#/")) {
      const cleanPath = rawHash.slice(1); // "#/feed" → "/feed"
      window.history.replaceState(null, "", cleanPath);
    }
  }

  // Mount React — session is now in localStorage, AuthContext will find it
  createRoot(document.getElementById("root")!).render(<App />);
}

bootstrap();
