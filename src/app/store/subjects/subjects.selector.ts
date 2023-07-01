import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SubjectsState } from './subjects.reducer';

export const selectSubject = createFeatureSelector<SubjectsState>('subject');

export const selectSubjectsArray = createSelector(
  selectSubject,
  (state: SubjectsState) => state.subjects
);

export const selectSubjectsErrorMessage = createSelector(
  selectSubject,
  (state: SubjectsState) => state.errorMessage,
);

export const selectSubjectsIsLoading = createSelector(
  selectSubject,
  (state: SubjectsState) => state.subjectsIsLoading
);

export const selectSubjectsPaginatorOptions = createSelector(
  selectSubject,
  (state: SubjectsState) => state.paginator
);
