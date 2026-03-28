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

// ── Step 2: Handle OAuth callback tokens in URL hash ──
// Google OAuth redirects back with #access_token=xxx&refresh_token=xxx
// We intercept these BEFORE the hash router sees them.
const rawHash = window.location.hash;

if (rawHash && rawHash.includes("access_token")) {
  // Parse tokens from the hash fragment
  const params = new URLSearchParams(rawHash.substring(1));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (accessToken && refreshToken) {
    // Set session explicitly, then do a FULL page reload so AuthContext picks it up cleanly
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .finally(() => {
        // Full reload with clean hash — guarantees AuthContext reads the persisted session
        window.location.href =
          window.location.origin + window.location.pathname + "#/feed";
        window.location.reload();
      });
  } else {
    // Tokens missing — full reload to feed
    window.location.href =
      window.location.origin + window.location.pathname + "#/feed";
    window.location.reload();
  }
} else if (rawHash && rawHash.includes("error_description")) {
  // OAuth error — mount React on auth page
  window.location.hash = "#/auth";
  createRoot(document.getElementById("root")!).render(<App />);
} else {
  // ── Step 3: Normal app load — always mount React ──
  if (!rawHash || rawHash === "#" || rawHash === "#/") {
    window.location.hash = "#/";
  }
  createRoot(document.getElementById("root")!).render(<App />);
}
