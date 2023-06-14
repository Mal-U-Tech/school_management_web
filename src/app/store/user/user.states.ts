import { IUser } from 'src/app/shared/user/user.interface';

export interface AuthState {
  user: IUser | null;
}

export const initialState: AuthState = {
  user: null,
};
