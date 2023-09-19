import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthenticateState } from './authenticate.state';
import { key } from './authenticate.reducer';

export const selectAuth = createFeatureSelector<AuthenticateState>(key);

export const selectUser = createSelector(
  selectAuth,
  (state) => state.user
);

const selectAPI = createSelector(
  selectAuth,
  (state) => state.api
)

export const selectToken = createSelector(
  selectUser,
  (user) => user?.token
);

export const selectAuthLoading = createSelector(
  selectAPI,
  (api) => api.loading
);

export const selectAuthError = createSelector(
  selectAPI,
  (api) => api.error
);
