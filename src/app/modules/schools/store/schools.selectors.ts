import { createFeatureSelector, createSelector } from '@ngrx/store';
import { key } from './schools.reducer';
import { SchoolsState } from './schools.state';
import { selectAppSchools } from 'src/app/store/app.selectors';

const selectSchoolState = createFeatureSelector<SchoolsState>(key);

export const selectSchoolCurrentTab = createSelector(
  selectSchoolState,
  (state) => state.tab
);

export const selectCurrentSchool = createSelector(
  selectAppSchools,
  selectSchoolState,
  (schools, { school }) => schools.find(s => s.id === school)
)

export const selectCurrentSchoolSubjects = createSelector(
  selectCurrentSchool,
  (school) => school?.subjects ?? []
);
