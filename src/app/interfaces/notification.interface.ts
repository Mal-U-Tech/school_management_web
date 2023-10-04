import { IClass } from './class.interface';
import { ISchool } from './school.interface';
import { ISubject } from './subject.interface';

export enum EntityType {
  class = 'class',
  school = 'school',
  subject = 'subject',
}

export enum NotificationType {
  info = 'info',
  warning = 'warning',
  error = 'error'
}

export interface INotification<T = IClass | ISubject | ISchool> {
  id: string;

  payload: T;
  message: string;

  sender: string;
  recipient: string;

  type: NotificationType;
  entity: EntityType;

  received: Date;

  created_at: Date;
  updated_at: Date;
}
