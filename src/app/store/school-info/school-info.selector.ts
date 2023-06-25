import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SchoolInfoState } from './school-info.reducer';

export const selectSchoolInfo =
  createFeatureSelector<SchoolInfoState>('schoolInfo');

export const selectSchoolInfoObject = createSelector(
  selectSchoolInfo,
  (state: SchoolInfoState) => state.schoolInfo
);

export const selectSchoolInfoIsLoading = createSelector(
  selectSchoolInfo,
  (state: SchoolInfoState) => state.isSchoolInfoLoading
);

export const selectSchoolInfoErrorMessage = createSelector(
  selectSchoolInfo,
  (state: SchoolInfoState) => state.errorMsg
);
