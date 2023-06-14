import { createReducer, on } from '@ngrx/store';
import { setUser } from './user.actions';
import { AuthState, initialState } from './user.states';

export const authReducer = createReducer(
  initialState,
  on(setUser, (state, { user }): AuthState => ({ ...state, user }))
);
