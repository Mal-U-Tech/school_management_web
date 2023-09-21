import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthenticateState } from './authenticate.state';
import { key } from './authenticate.reducer';

export const selectAuthenticateState = createFeatureSelector<AuthenticateState>(key);

const selectAuthenticateAPI = createSelector(
  selectAuthenticateState,
  (state) => state.api
)

export const selectAuthenticateLoading = createSelector(
  selectAuthenticateAPI,
  (api) => api.loading
);

export const selectAuthenticateError = createSelector(
  selectAuthenticateAPI,
  (api) => api.error
);
