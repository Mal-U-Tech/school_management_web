import { IUser } from 'src/app/shared/user/user.interface';

export interface AuthState {
  token?: string;
  user?: IUser;
  status: 'pending' | 'loading' | 'error' | 'success';
  error?: string;
  isLoginProgress: boolean;
}

export const initialState: AuthState = {
  status: 'pending',
  isLoginProgress: false,
};
