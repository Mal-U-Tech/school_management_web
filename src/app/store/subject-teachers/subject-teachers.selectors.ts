import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SubjectTeacherState } from './subject-teachers.reducer';

export const selectSubjectTeacher =
  createFeatureSelector<SubjectTeacherState>('subjectTeacher');

export const selectSubjectTeacherIsLoading = createSelector(
  selectSubjectTeacher,
  (state: SubjectTeacherState) => state.subjectTeacherIsLoading
);

export const selectSubjectTeachersArray = createSelector(
  selectSubjectTeacher,
  (state: SubjectTeacherState) => state.subjectTeachers
);

export const selectSubjectTeacherErrorMessage = createSelector(
  selectSubjectTeacher,
  (state: SubjectTeacherState) => state.errorMessage
);
