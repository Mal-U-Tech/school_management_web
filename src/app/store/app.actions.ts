import { createAction, props } from '@ngrx/store';
import { IUser } from '../interfaces/user.interface';
import { IPermission } from '../interfaces/permission.interface';
import { ISchool } from '../interfaces/school.interface';
import { INotification } from '../interfaces/notification.interface';

export const userAppLanding = createAction('[App] User App Landing');

export const userLandingEffectSuccessful = createAction(
  '[App] User Landing Effect Successful',
  props<{ user: IUser }>()
);

export const loadPermissionEffectSuccess = createAction(
  '[App] Load Permission Effect Success',
  props<{ permissions: IPermission[]; }>()
)

export const loadPermissionEffectFailed = createAction(
  '[App] Load Permission Effect Failed',
  props<{ error: Error }>()
);

export const loadSchoolsEffectSuccessful = createAction(
  '[App] Load Schools Effect Successful',
  props<{ schools: ISchool[] }>()
);

export const loadSchoolsEffectFailed = createAction(
  '[App] Load Schools Effect Failed',
  props<{ error: Error }>()
);

export const loadNotificationsEffectSuccessful = createAction(
  '[App] Load Notifications Effect Successful',
  props<{ notifications: INotification[] }>()
);

export const loadNotificationsEffectFailed = createAction(
  '[App] Load Notifications Effect Failed',
  props<{ error: Error }>()
);

export const tokenExpiredLogoutEffectComplete = createAction(
  '[App] Token Expired Logout Effect Complete'
);

export const tokenExpiredLogoutEffect = createAction(
  '[App] Token Expired Logout Effect',
);

export const appInitializedEffect = createAction(
  '[App] App Initialized Effect'
)

export const updateAppSchoolEffect = createAction(
  '[App] Update App School Effect',
  props<{ school: ISchool }>()
)

export const notificationBannerObserved = createAction(
  '[Dashboard] Notification Banner Observed',
  props<{ notification: INotification }>()
);

