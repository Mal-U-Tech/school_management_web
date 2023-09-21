import { createAction, props } from '@ngrx/store';
import { IUser } from '../modules/authenticate/interfaces/user.interface';

export const userAppLanding = createAction('[App] User App Landing');

export const userLandingEffectSuccessful = createAction(
  '[App] User Landing Effect Successful',
  props<{ user: IUser }>()
);
