/* ═══════════════════════════════════════════
   Web Push Notifications — subscribe/unsubscribe
   ═══════════════════════════════════════════ */

import { supabase } from "./supabase";

const VAPID_PUBLIC_KEY = "BBIu22N9FiQDq1uqT42gE-IjHWofJ-Il7Z_SRgNXdQhCdPzw5H97PPigmV7HCvtwU9BmRwqp3H04FXfg4pOBIbo";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/** Check if push is supported */
export function isPushSupported(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

/** Get current permission state */
export function getPushPermission(): NotificationPermission | "unsupported" {
  if (!isPushSupported()) return "unsupported";
  return Notification.permission;
}

/** Register service worker and subscribe to push */
export async function subscribeToPush(userId: string): Promise<boolean> {
  if (!isPushSupported()) return false;

  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return false;

    // Register the push service worker
    const registration = await navigator.serviceWorker.register("/sw-push.js", { scope: "/" });
    await navigator.serviceWorker.ready;

    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const sub = subscription.toJSON();
    if (!sub.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
      console.error("[Push] Invalid subscription object");
      return false;
    }

    // Save subscription to Supabase
    const { error } = await supabase.from("push_subscriptions").upsert(
      {
        user_id: userId,
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
      { onConflict: "user_id,endpoint" }
    );

    if (error) {
      console.error("[Push] Failed to save subscription:", error);
      return false;
    }

    console.log("[Push] Subscribed successfully");
    return true;
  } catch (err) {
    console.error("[Push] Subscription error:", err);
    return false;
  }
}

/** Unsubscribe from push */
export async function unsubscribeFromPush(userId: string): Promise<void> {
  try {
    const registration = await navigator.serviceWorker.getRegistration("/sw-push.js");
    if (registration) {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        // Remove from DB
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("user_id", userId)
          .eq("endpoint", subscription.endpoint);
      }
    }
  } catch (err) {
    console.error("[Push] Unsubscribe error:", err);
  }
}
