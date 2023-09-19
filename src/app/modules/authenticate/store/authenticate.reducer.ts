import { createReducer, on } from '@ngrx/store';
import {
  loginButtonClick,
  loginEffectFailed,
  loginEffectSuccessful,
} from './authenticate.actions';
import { AuthenticateState, initialState } from './authenticate.state';

export const key = 'auth';

export const reducer = createReducer(
  initialState,

  // user reduction
  on(loginButtonClick, (state): AuthenticateState => ({
    ...state,
    api: {
      loading: true,
      error: undefined
    }
  })),

  // effect reduction
  on(
    loginEffectSuccessful,
    (state, { user }): AuthenticateState => ({
      ...state,
      user: user,
      api: {
        loading: false,
      }
    })
  ),
  on(
    loginEffectFailed,
    (state, { error }): AuthenticateState => ({
      ...state,
      api: {
        loading: false,
        error
      }
    })
  ),
);
