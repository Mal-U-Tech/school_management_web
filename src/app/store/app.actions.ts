import { createAction, props } from '@ngrx/store';
import { IUser } from '../interfaces/user.interface';

export const userAppLanding = createAction('[App] User App Landing');

export const userLandingEffectSuccessful = createAction(
  '[App] User Landing Effect Successful',
  props<{ user: IUser }>()
);
