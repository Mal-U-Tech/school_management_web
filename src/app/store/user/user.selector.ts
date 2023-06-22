import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { AuthState } from './user.states';

export const selectAuth = createFeatureSelector<AuthState>('auth');

export const selectToken = createSelector(
  selectAuth,
  (state: AuthState) => state.token
);

export const selectIsAuth = createSelector(
  selectAuth,
  (state: AuthState) => !!state.token
);

export const selectUserData = createSelector(
  selectAuth,
  (state: AuthState) => state.user
);

export const selectIsLoading = createSelector(
  selectAuth,
  (state: AuthState) => state.isLoginProgress
);

