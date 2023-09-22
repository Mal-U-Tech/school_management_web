import { IPermission } from '../interfaces/permission.interface';
import { IUser } from '../interfaces/user.interface';

export interface AppState {
  user?: IUser;
  permissions: IPermission[];
}

export const initial: AppState = {
  permissions: []
};
