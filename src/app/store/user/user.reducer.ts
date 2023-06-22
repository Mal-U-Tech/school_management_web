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
} from './user.actions';
import { AuthState, initialState } from './user.states';

export const authReducer = createReducer(
  initialState,
  on(setToken, (state, { token }): AuthState => ({ ...state, token: token })),
  on(removeToken, (state): AuthState => ({ ...state, token: '' })),
  on(setUser, (state, { user }): AuthState => ({ ...state, user: user })),
  on(login, (state, { email, password }): AuthState => ({ ...state })),
  on(
    loginSuccessful,
    (state, { user }): AuthState => ({ ...state, user: user })
  ),
  on(
    loginError,
    (state, { message }): AuthState => ({ ...state, error: message })
  ),
  on(
    isLoading,
    (state, { isLoading }): AuthState => ({
      ...state,
      isLoginProgress: isLoading,
    })
  ),
  on(
    isLoginSuccess,
    (state, { _id, user }): AuthState => ({
      ...state,
    })
  )
);
