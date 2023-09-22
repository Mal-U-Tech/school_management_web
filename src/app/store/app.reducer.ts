import { createReducer, on } from '@ngrx/store';
import { AppState, initial } from './app.state';
import { userLandingEffectSuccessful } from './app.actions';
import { loginEffectSuccessful, registerEffectSuccessful } from '../modules/authenticate/store/authenticate.actions';
import { toolbarLogoutClick } from '../modules/dashboard/store/dashboard.actions';

export const key = 'app';

export const reducer = createReducer(
  initial,
  on(
    userLandingEffectSuccessful,
    loginEffectSuccessful,
    registerEffectSuccessful,
    (state, { user }): AppState => ({
      ...state,
      user
    })
  ),
  on(
    toolbarLogoutClick,
    (state): AppState => ({
      ...state,
      user: undefined,
    })
  ),
);
