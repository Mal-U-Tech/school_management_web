import { createAction, props } from '@ngrx/store';
import { IUser } from '../interfaces/user.interface';
import { IPermission } from '../interfaces/permission.interface';

export const userAppLanding = createAction('[App] User App Landing');

export const userLandingEffectSuccessful = createAction(
  '[App] User Landing Effect Successful',
  props<{ user: IUser }>()
);

export const loadPermissionEffect = createAction(
  '[App] Load Permission Effect'
);

export const loadPermissionEffectSuccess = createAction(
  '[App] Load Permission Effect Success',
  props<{ permissions: IPermission[]; }>()
)

export const loadPermissionEffectFailed = createAction(
  '[App] Load Permission Effect Failed',
  props<{ error: Error }>()
);
