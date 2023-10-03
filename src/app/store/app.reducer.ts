import { createReducer, on } from '@ngrx/store';
import { AppState, initial } from './app.state';
import {
  appInitializedEffect,
  loadNotificationsEffectSuccessful,
  loadPermissionEffectSuccess,
  loadSchoolsEffectSuccessful,
  userAppLanding,
  userLandingEffectSuccessful,
} from './app.actions';
import {
  loginEffectSuccessful,
  registerEffectSuccessful,
} from '../modules/authenticate/store/authenticate.actions';
import { toolbarLogoutClick } from '../modules/dashboard/store/dashboard.actions';

export const key = 'app';

export const reducer = createReducer(
  initial,
  on(
    userAppLanding,
    (state): AppState => ({
      ...state,
      loading: true,
    })
  ),
  on(
    appInitializedEffect,
    (state): AppState => ({
      ...state,
      loading: false,
    })
  ),
  on(
    userLandingEffectSuccessful,
    loginEffectSuccessful,
    registerEffectSuccessful,
    (state, { user }): AppState => ({
      ...state,
      user,
    })
  ),

  on(
    toolbarLogoutClick,
    (state): AppState => ({
      ...state,
      user: undefined,
    })
  ),
  on(
    loadPermissionEffectSuccess,
    (state, action): AppState => ({
      ...state,
      permissions: action.permissions,
    })
  ),

  on(
    loadSchoolsEffectSuccessful,
    (state, action): AppState => ({
      ...state,
      schools: action.schools,
    })
  ),

  on(
    loadNotificationsEffectSuccessful,
    (state, action): AppState => ({
      ...state,
      notifications: action.notifications
    })
  )
);
