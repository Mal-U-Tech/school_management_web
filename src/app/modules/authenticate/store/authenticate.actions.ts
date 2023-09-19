import { createAction, props } from '@ngrx/store';
import { IUser } from '../interfaces/user.interface';

// user actions
export const loginButtonClick = createAction(
  '[Authenticate] Login Button Click',
  props<{ email: string; password: string }>()
);

export const logoutButtonClick = createAction('[Authenticate] Log Out Button Click');

// effect actions
export const loginEffectSuccessful = createAction(
  '[Authenticate] Login Successful',
  props<{ user: IUser }>()
);

export const loginEffectFailed = createAction(
  '[Authenticate] Login Failed',
  props<{ error: Error }>()
);

