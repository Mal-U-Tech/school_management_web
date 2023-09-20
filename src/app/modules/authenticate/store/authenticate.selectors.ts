import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthenticateState } from './authenticate.state';
import { key } from './authenticate.reducer';

export const selectAuthState = createFeatureSelector<AuthenticateState>(key);

export const selectAuthUser = createSelector(
  selectAuthState,
  (state) => state.user
);

const selectAuthAPI = createSelector(
  selectAuthState,
  (state) => state.api
)

export const selectAuthLoading = createSelector(
  selectAuthAPI,
  (api) => api.loading
);

export const selectAuthError = createSelector(
  selectAuthAPI,
  (api) => api.error
);
