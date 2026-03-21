import { useEffect, useCallback } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

interface AppointmentForNotif {
  id: string;
  title: string;
  date: string;
  location: string;
  reminder_minutes?: number;
}

export function useNotifications() {
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (!isNative) return;
    LocalNotifications.requestPermissions();
  }, [isNative]);

  const scheduleReminders = useCallback(async (appointments: AppointmentForNotif[]) => {
    if (!isNative) return;

    // Cancel all existing scheduled notifications
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }

    const now = Date.now();
    const notifications = appointments
      .map((a, index) => {
        const apptTime = new Date(a.date).getTime();
        const delayMs = (a.reminder_minutes ?? 30) * 60 * 1000;
        if (delayMs === 0) return null;
        const reminderTime = apptTime - delayMs;

        if (reminderTime <= now) return null;

        const delayLabel = (a.reminder_minutes ?? 30) >= 1440
          ? `Dans ${Math.round((a.reminder_minutes ?? 30) / 1440)} jour(s)`
          : (a.reminder_minutes ?? 30) >= 60
            ? `Dans ${Math.round((a.reminder_minutes ?? 30) / 60)}h`
            : `Dans ${a.reminder_minutes ?? 30} min`;

        return {
          id: index + 1,
          title: `Rappel : ${a.title}`,
          body: a.location ? `${delayLabel} — ${a.location}` : delayLabel,
          schedule: { at: new Date(reminderTime) },
          smallIcon: 'ic_stat_icon',
          iconColor: '#6366f1',
        };
      })
      .filter(Boolean);

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications: notifications as any });
    }
  }, [isNative]);

  return { scheduleReminders };
}
