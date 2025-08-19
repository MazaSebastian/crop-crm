export interface PushSubscriptionDTO {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export async function ensurePushPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return await Notification.requestPermission();
}

export async function subscribeToPush(vapidPublicKey: string): Promise<PushSubscriptionDTO | null> {
  if (!('serviceWorker' in navigator)) return null;
  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  if (existing) return {
    endpoint: existing.endpoint,
    keys: {
      p256dh: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(existing.getKey('p256dh')!)) as any)),
      auth: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(existing.getKey('auth')!)) as any))
    }
  };
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
  });
  return {
    endpoint: sub.endpoint,
    keys: {
      p256dh: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(sub.getKey('p256dh')!)) as any)),
      auth: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(sub.getKey('auth')!)) as any))
    }
  };
}


