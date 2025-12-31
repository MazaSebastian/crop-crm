
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
            console.log('OneSignal Initialized');
        } catch (error: any) {
            console.error('OneSignal Init Error:', error);
        }
    },

    async promptSubscription() {
        try {
            console.log("Prompting for subscription...");
            // Method 1: New SDK (v16+) via react-onesignal wrapper if available
            if (OneSignal.Notifications && typeof OneSignal.Notifications.requestPermission === 'function') {
                console.log("Using OneSignal.Notifications.requestPermission()");
                await OneSignal.Notifications.requestPermission();
            }
            // Method 2: Fallback to Slidedown
            else if (OneSignal.Slidedown) {
                console.log("Using OneSignal.Slidedown.promptPush()");
                await OneSignal.Slidedown.promptPush();
            }
            // Method 3: Legacy or Direct register
            else {
                console.warn("No explicit prompt method found in this SDK version. Attempting register.");
                // Some older versions trigger on init, or via register()
            }
        } catch (error) {
            console.error('Error prompting subscription:', error);
            alert("Error al solicitar permisos: " + JSON.stringify(error));
        }
    },

    async sendSelfNotification(title: string, message: string) {
        if (!ONESIGNAL_APP_ID || !ONESIGNAL_API_KEY) {
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
                'content-type': 'application/json',
                Authorization: `Basic ${ONESIGNAL_API_KEY}`,
            },
            body: JSON.stringify({
                app_id: ONESIGNAL_APP_ID,
                included_segments: ['All'], // Sends to everyone (including self)
                headings: { en: title, es: title },
                contents: { en: message, es: message },
            }),
        };

        try {
            const response = await fetch('https://onesignal.com/api/v1/notifications', options);
            const data = await response.json();
            console.log('Notification sent:', data);
        } catch (err) {
            console.error('Error sending notification:', err);
        }
    }
};
