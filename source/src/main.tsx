import { createRoot } from "react-dom/client";
import "./lib/i18n";
import App from "./App";
import "./index.css";
import { supabase } from "./lib/supabase";

// ── Step 1: Unregister any old Service Workers ──
// This must happen FIRST, before any other logic, to prevent
// stale SW from intercepting auth callbacks or serving old HTML.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const reg of registrations) {
      reg.unregister().then(() => {
        console.log("[SW] Unregistered:", reg.scope);
      });
    }
  });
  // Also clear all caches left behind by old SW
  if ("caches" in window) {
    caches.keys().then((names) => {
      for (const name of names) {
        caches.delete(name);
        console.log("[Cache] Deleted:", name);
      }
    });
  }
}

// ── Step 2: Handle Supabase OAuth callback ──
// Tokens arrive as hash fragments: #access_token=xxx&refresh_token=xxx
// We must intercept BEFORE React router sees them as routes.
const hash = window.location.hash;

if (hash && hash.includes("access_token")) {
  // Let Supabase client pick up the tokens from the URL hash
  supabase.auth
    .getSession()
    .then(({ data }) => {
      if (data.session) {
        // Successfully authenticated — redirect to feed
        window.location.replace(
          window.location.origin + window.location.pathname + "#/feed"
        );
      } else {
        // Session not established — try setting session from URL explicitly
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        if (accessToken && refreshToken) {
          supabase.auth
            .setSession({ access_token: accessToken, refresh_token: refreshToken })
            .then(({ data: sessionData }) => {
              if (sessionData.session) {
                window.location.replace(
                  window.location.origin + window.location.pathname + "#/feed"
                );
              } else {
                window.location.replace(
                  window.location.origin + window.location.pathname + "#/auth"
                );
              }
            });
        } else {
          window.location.replace(
            window.location.origin + window.location.pathname + "#/auth"
          );
        }
      }
    })
    .catch(() => {
      window.location.replace(
        window.location.origin + window.location.pathname + "#/auth"
      );
    });
} else if (hash && hash.includes("error_description")) {
  // OAuth error — go to auth page
  window.location.replace(
    window.location.origin + window.location.pathname + "#/auth"
  );
} else {
  // Normal app load — mount React immediately
  if (!hash || hash === "#" || hash === "#/") {
    window.location.hash = "#/";
  }
  createRoot(document.getElementById("root")!).render(<App />);
}
