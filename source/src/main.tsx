import { createRoot } from "react-dom/client";
import "./lib/i18n";
import App from "./App";
import "./index.css";
import { supabase } from "./lib/supabase";

// Handle Supabase OAuth callback — tokens arrive as hash fragments
// e.g. #access_token=xxx&refresh_token=xxx
// Must intercept BEFORE React router sees them as routes
const hash = window.location.hash;

if (hash && hash.includes("access_token")) {
  // Let Supabase pick up the tokens from the URL
  supabase.auth.getSession().then(({ data }) => {
    // Redirect to feed after auth, removing the token hash
    if (data.session) {
      window.location.replace(window.location.origin + window.location.pathname + "#/feed");
    } else {
      window.location.replace(window.location.origin + window.location.pathname + "#/auth");
    }
  });
} else if (hash && hash.includes("error_description")) {
  // OAuth error — go to auth page
  window.location.replace(window.location.origin + window.location.pathname + "#/auth");
} else {
  // Normal app load
  if (!hash || hash === "#" || hash === "#/") {
    window.location.hash = "#/";
  }
  createRoot(document.getElementById("root")!).render(<App />);
}
