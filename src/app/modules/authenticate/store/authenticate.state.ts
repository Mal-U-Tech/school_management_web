import { IUser } from 'src/app/shared/user/user.interface';

export interface AuthenticateState {
  token?: string;
  user?: IUser;
  status: 'pending' | 'loading' | 'error' | 'success';
  error?: string;
  isLoginProgress: boolean;
}

export const initialState: AuthenticateState = {
  status: 'pending',
  isLoginProgress: false,
};
