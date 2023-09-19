import { createAction, props } from '@ngrx/store';
import { IUser } from 'src/app/shared/user/user.interface';

export const setToken = createAction(
  '[Auth] Set Token',
  props<{ token: string }>()
);

export const removeToken = createAction('[Auth] Remove Token');

export const setUser = createAction(
  '[Auth] Set user',
  props<{ user: IUser }>()
);

export const login = createAction(
  '[Auth API] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccessful = createAction(
  '[Auth API] Login Successful',
  props<{ user: IUser; isLoading: boolean }>()
);

export const loginError = createAction(
  '[Auth API] Login Error',
  props<{ message: string }>()
);

export const logout = createAction('[Auth] Log Out');

// function to change isLoading
export const isLoading = createAction(
  '[Auth] Is Loading',
  props<{ isLoading: boolean }>()
);

export const isLoginSuccess = createAction(
  '[Auth API] Login Successful',
  props<{ _id: string; user: IUser }>()
);
