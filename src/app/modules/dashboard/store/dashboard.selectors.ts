import { createFeatureSelector, createSelector } from '@ngrx/store';
import { key } from './dashboard.reducer';
import { DashboardState } from './dashboard.state';

const selectDashboardState = createFeatureSelector<DashboardState>(key);

export const selectDashboardMenu = createSelector(
  selectDashboardState,
  (state) => state.menu
);

export const selectDashboardMenuLoading = createSelector(
  selectDashboardMenu,
  (menu) => menu.length < 1
)
