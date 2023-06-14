import { createAction, props } from '@ngrx/store';
import { IUser } from 'src/app/shared/user/user.interface';

export const setUser = createAction(
  '[Auth] Set user',
  props<{ user: IUser }>()
);

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

export const loginError = createAction(
  '[Auth] Login',
  props<{ message: string }>()
);

export const logout = createAction('[Auth] Log Out');
