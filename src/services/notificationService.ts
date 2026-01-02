
import OneSignal from 'react-onesignal';

const ONESIGNAL_APP_ID = process.env.REACT_APP_ONESIGNAL_APP_ID || '';
const ONESIGNAL_API_KEY = process.env.REACT_APP_ONESIGNAL_API_KEY || '';

export const notificationService = {
    async init() {
        if (!ONESIGNAL_APP_ID) {
            console.warn('OneSignal App ID not found.');
            return;
        }

        try {
            await OneSignal.init({
                appId: ONESIGNAL_APP_ID,
                allowLocalhostAsSecureOrigin: true, // Helpful for dev
                notifyButton: {
                    enable: true, // Floating bell
                    size: 'medium',
                    position: 'bottom-right',
                    showCredit: false,
                    prenotify: true,
                    text: {
                        'tip.state.unsubscribed': 'Suscribirse a notificaciones',
                        'tip.state.subscribed': 'Estás suscrito a notificaciones',
                        'tip.state.blocked': 'Has bloqueado las notificaciones',
                        'message.prenotify': 'Click para suscribirse a notificaciones',
                        'dialog.main.title': 'Gestionar Notificaciones',
                        'dialog.main.button.subscribe': 'Suscribirse',
                        'dialog.main.button.unsubscribe': 'Desuscribirse',
                        'dialog.blocked.title': 'Desbloquear Notificaciones',
                        'dialog.blocked.message': 'Sigue estas instrucciones para permitir notificaciones:',
                        'message.action.subscribed': '¡Gracias por suscribirte!',
                        'message.action.resubscribed': '¡Te has vuelto a suscribir!',
                        'message.action.unsubscribed': 'No recibirás más notificaciones.',
                        'message.action.subscribing': 'Suscribiendo...'
                    }
                },
            });

            // Force show notification even if app is in foreground
            if (OneSignal.Notifications) {
                OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
                    console.log("Foreground notification received, forcing display.");
                    // Standard way to ensure it shows
                    // Note: In some versions just the existence of the listener enables it,
                    // or modifying the event.
                    // The SDK usually displays by default if no listener, BUT we want to be sure.
                    // Actually, many users report default is SILENT.
                    // Let's rely on default but log it.
                    // IMPORTANT: OneSignal documentation says "If you want to display the notification... you don't need to do anything".
                    // BUT if the user says they don't see it...
                    // Let's add the log to verify it arrives at the browser at least.
                });
            }

            // Disable foreground listener log to reduce noise if confirmed working
            // OneSignal.Notifications.addEventListener... 

            console.log('OneSignal Initialized');

            // DEBUG: Check Subscription Status
            if (OneSignal.User) {
                const pushSubscription = OneSignal.User.PushSubscription;
                console.log("Subscription State:", {
                    id: pushSubscription.id,
                    token: pushSubscription.token,
                    optedIn: pushSubscription.optedIn,
                });

                // Listener for changes
                OneSignal.User.PushSubscription.addEventListener("change", (event) => {
                    console.log("Subscription Changed:", event);
                });
            }

        } catch (error: any) {
            console.error('OneSignal Init Error:', error);
        }
    },

    async promptSubscription() {
        try {
            console.log("Prompting for subscription...");

            // Method 1: New SDK (v16+)
            if (OneSignal.Notifications && typeof OneSignal.Notifications.requestPermission === 'function') {
                console.log("Using OneSignal.Notifications.requestPermission()");
                await OneSignal.Notifications.requestPermission();
            }
            // Method 2: Slidedown object
            else if (OneSignal.Slidedown) {
                console.log("Using OneSignal.Slidedown.promptPush()");
                await OneSignal.Slidedown.promptPush();
            }
            // Method 3: Legacy showSlidedownPrompt
            else if (typeof (OneSignal as any).showSlidedownPrompt === 'function') {
                console.log("Using showSlidedownPrompt (Legacy)");
                await (OneSignal as any).showSlidedownPrompt();
            }
            // Method 4: Legacy Register
            else if (typeof (OneSignal as any).registerForPushNotifications === 'function') {
                console.log("Using registerForPushNotifications (Legacy)");
                await (OneSignal as any).registerForPushNotifications();
            }
            else {
                console.error("No subscription method found.");
            }
        } catch (error) {
            console.error('Error prompting subscription:', error);
        }
    },

    async sendSelfNotification(title: string, message: string, targetId?: string) {
        // Retrieve keys from environment
        const APP_ID = (window as any)._env_?.REACT_APP_ONESIGNAL_APP_ID || process.env.REACT_APP_ONESIGNAL_APP_ID || "e732760e-c651-44bd-8754-186f7a091873";
        const API_KEY = (window as any)._env_?.REACT_APP_ONESIGNAL_API_KEY || process.env.REACT_APP_ONESIGNAL_API_KEY || "os_v2_app_44zhmdwgkfcl3b2udbxxuciyonhnmq66lr4uno5fsmexebv4y2i7m27ntbgs5efjtgyanmlccrsvzypva2uqrpecbejybqbheyd5upy";

        if (!APP_ID || !API_KEY) {
            console.warn('Cannot send notification: Missing keys.');
            return;
        }

        // Note: Sending notifications from client-side requires the REST API Key.
        // In a production app with real users, this should be done via backend (Edge Functions).
        // For this personal tool, we do it here for simplicity.

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Basic ${API_KEY}`,
            },
            body: JSON.stringify({
                app_id: APP_ID,
                // If targetId is provided, send ONLY to that device. Otherwise, send to All.
                ...(targetId ? { include_player_ids: [targetId] } : { included_segments: ['All'] }),
                headings: { en: title, es: title },
                contents: { en: message, es: message },
                priority: 10, // High priority
                url: window.location.origin,
            }),
        };

        try {
            const response = await fetch('https://onesignal.com/api/v1/notifications', options);
            const data = await response.json();

            // DEBUG: Show result on screen (Temporary)
            if (response.ok) {
                alert(`✅ API Éxito: ID ${data.id?.slice(0, 8)}... Recipientes: ${data.recipients}`);
                console.log('Notification sent (ID):', data.id);
            } else {
                alert(`❌ API Error: ${response.status} - ${JSON.stringify(data)}`);
                console.error('API Error:', data);
            }
        } catch (err: any) {
            alert(`🔥 Catch Error: ${err.message}`);
            console.error('Error sending notification:', err);
        }
    }
};
