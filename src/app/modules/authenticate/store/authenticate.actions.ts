import { createAction, props } from '@ngrx/store';
import { IUser } from '../../../interfaces/user.interface';

// user actions
export const loginButtonClick = createAction(
  '[Authenticate] Login Button Click',
  props<{ email: string; password: string }>()
);

export const logoutButtonClick = createAction('[Authenticate] Log Out Button Click');

export const registerButtonClick = createAction('[Authenticate] Register Button Click', props<{
  user: IUser;
}>())

// effect actions
export const loginEffectSuccessful = createAction(
  '[Authenticate] Login Effect Successful',
  props<{ user: IUser }>()
);

export const loginEffectFailed = createAction(
  '[Authenticate] Login Effect Failed',
  props<{ error: Error }>()
);

export const registerEffectSuccessful = createAction(
  '[Authenticate] Register Effect Successful',
  props<{ user: IUser; }>()
);

export const registerEffectFailed = createAction(
  '[Authenticate] Register Effect Failed',
  props<{ error: Error }>()
);
