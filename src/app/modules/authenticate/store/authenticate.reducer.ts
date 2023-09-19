import { createReducer, on } from '@ngrx/store';
import {
  isLoading,
  isLoginSuccess,
  login,
  loginError,
  loginSuccessful,
  removeToken,
  setToken,
  setUser,
} from './authenticate.actions';
import { AuthenticateState, initialState } from './authenticate.state';

export const key = 'auth';
export const reducer = createReducer(
  initialState,
  on(setToken, (state, { token }): AuthenticateState => ({ ...state, token: token })),
  on(removeToken, (state): AuthenticateState => ({ ...state, token: '' })),
  on(setUser, (state, { user }): AuthenticateState => ({ ...state, user: user })),
  on(login, (state, { email, password }): AuthenticateState => ({ ...state })),
  on(
    loginSuccessful,
    (state, { user }): AuthenticateState => ({ ...state, user: user })
  ),
  on(
    loginError,
    (state, { message }): AuthenticateState => ({ ...state, error: message })
  ),
  on(
    isLoading,
    (state, { isLoading }): AuthenticateState => ({
      ...state,
      isLoginProgress: isLoading,
    })
  ),
  on(
    isLoginSuccess,
    (state, { _id, user }): AuthenticateState => ({
      ...state,
    })
  )
);
