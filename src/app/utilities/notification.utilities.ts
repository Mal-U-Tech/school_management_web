import { INotification } from '../interfaces/notification.interface';

export function marknotification(
  notifications: INotification[],
  n: INotification
) {
  return notifications.map((value) => {
    if (value.id === n.id) {
      const copy = { ...value };
      copy.received = new Date();
      return copy;
    }
    return value;
  });
}
