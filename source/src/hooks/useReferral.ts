import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const REF_KEY = "b_social_ref";

/**
 * Call once at app root to capture ?ref= from URL and persist it.
 * Uses localStorage so it survives page reloads.
 */
export function useReferralCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem(REF_KEY, ref);
      // Clean URL without reload
      const url = new URL(window.location.href);
      url.searchParams.delete("ref");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);
}

/**
 * Call after successful signup to permanently bind the user to the influencer.
 * Safe to call multiple times — the unique constraint on referred_user_id prevents duplicates.
 */
export async function bindReferral(userId: string): Promise<void> {
  const code = localStorage.getItem(REF_KEY);
  if (!code) return;

  // Look up the influencer by code
  const { data: influencer } = await supabase
    .from("influencers")
    .select("id")
    .eq("code", code)
    .eq("active", true)
    .single();

  if (!influencer) return;

  // Create the permanent referral binding
  const { error } = await supabase.from("referrals").insert({
    referrer_id: influencer.id,
    referred_user_id: userId,
  });

  if (!error) {
    // Clean up — binding is permanent in DB now
    localStorage.removeItem(REF_KEY);
  }
}

/**
 * Get the stored referral code (for display/debugging)
 */
export function getStoredRefCode(): string | null {
  return localStorage.getItem(REF_KEY);
}
