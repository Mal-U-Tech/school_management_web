import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './user.states';

export const selectAuthFeature = createFeatureSelector<AuthState>('auth');

export const selectUserData = createSelector(
  selectAuthFeature,
  (state) => state.user
);
