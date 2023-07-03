import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TeacherState } from './teacher.reducer';

export const selectTeacher = createFeatureSelector<TeacherState>('teacher');

export const selectTeacherArray = createSelector(
  selectTeacher,
  (state: TeacherState) => state.teachers
);

export const selectErrorMessage = createSelector(
  selectTeacher,
  (state: TeacherState) => state.errorMessage
);

export const selectTeacherIsLoading = createSelector(
  selectTeacher,
  (state: TeacherState) => state.teacherIsLoading
);

export const selectPaginatorOptions = createSelector(
  selectTeacher,
  (state: TeacherState) => state.paginator
);
