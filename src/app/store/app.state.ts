import { INotification } from '../interfaces/notification.interface';
import { IPermission } from '../interfaces/permission.interface';
import { ISchool } from '../interfaces/school.interface';
import { IUser } from '../interfaces/user.interface';

export interface AppState {
  user?: IUser;
  permissions: IPermission[];
  schools: ISchool[];
  notifications: INotification[];

  loading: boolean;
}

export const initial: AppState = {
  permissions: [],
  schools: [],
  notifications: [],

  loading: true,
};
