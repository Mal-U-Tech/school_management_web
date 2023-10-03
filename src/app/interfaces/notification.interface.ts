export interface INotification {
  id: string;

  payload: string;
  message: string;

  sender: string;
  recipient: string;

  type: 'info' | 'warning' | 'error';

  received: Date;

  created_at: Date;
  updated_at: Date;
}
