import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthenticateState } from './authenticate.state';

export const selectAuth = createFeatureSelector<AuthenticateState>('auth');

export const selectToken = createSelector(
  selectAuth,
  (state: AuthenticateState) => state.token
);

export const selectIsAuth = createSelector(
  selectAuth,
  (state: AuthenticateState) => !!state.token
);

export const selectUserData = createSelector(
  selectAuth,
  (state: AuthenticateState) => state.user
);

export const selectIsLoading = createSelector(
  selectAuth,
  (state: AuthenticateState) => state.isLoginProgress
);
