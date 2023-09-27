import { createFeatureSelector, createSelector } from '@ngrx/store';
import { key } from './schools.reducer';
import { SchoolsState } from './schools.state';

const selectSchoolState = createFeatureSelector<SchoolsState>(key);

export const selectSchoolCurrentTab = createSelector(
  selectSchoolState,
  (state) => state.tab
);

export const selectCurrentSchool = createSelector(
  selectSchoolState,
  ({ school }) => school
)
