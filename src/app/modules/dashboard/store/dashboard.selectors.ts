import { createFeatureSelector } from '@ngrx/store';
import { key } from './dashboard.reducer';
import { DashboardState } from './dashboard.state';

const selectDashboardState = createFeatureSelector<DashboardState>(key);

