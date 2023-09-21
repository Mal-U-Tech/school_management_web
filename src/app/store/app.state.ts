import { IUser } from '../modules/authenticate/interfaces/user.interface';

export interface AppState {
  user?: IUser;
}

export const initial = {};
