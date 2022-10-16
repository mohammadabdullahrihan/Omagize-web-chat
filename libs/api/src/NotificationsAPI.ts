import { delay, groups, notifications } from './model';
import { DateObject } from './mappers/types';
import { GroupNotification, UserNotification } from './mappers/Notifications';

export type RawNotification = {
  id: string;
  type: 'mention';
  date: DateObject;
};

export function fetchGroupNotifications(id: string): GroupNotification[] {
  return notifications;
}

export async function clearGroupNotifications() {
  await delay(3000);
}

export function fetchUserNotifications(): UserNotification[] {
  return [
    ...notifications.map((n) => ({
      ...n,
      group: groups[0].id,
    })),
    {
      id: '32423432',
      type: 'login',
      time: new Date(Date.now()),
      from: 'Hong Kong',
    },
  ];
}

export async function clearUserNotifications() {
  await delay(2000);
}
