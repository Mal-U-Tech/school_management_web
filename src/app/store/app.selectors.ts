import { createFeatureSelector, createSelector } from '@ngrx/store';
import { key } from './app.reducer';
import { AppState } from './app.state';

const selectAppState = createFeatureSelector<AppState>(key);

export const selectAppUser = createSelector(
  selectAppState,
  (state) => state.user
);

export const selectAppPermissions = createSelector(
  selectAppState,
  (state) => state.permissions
);

export const selectAppSchools = createSelector(
  selectAppState,
  (state) => state.schools
);

export const selectAppLoading = createSelector(
  selectAppState,
  (state) => state.loading,
);
