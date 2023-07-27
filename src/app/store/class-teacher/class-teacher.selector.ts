import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClassTeacherState } from './class-teacher.reducer';

export const selectClassTeacher =
  createFeatureSelector<ClassTeacherState>('classTeacher');

export const selectClassTeachersArray = createSelector(
  selectClassTeacher,
  (state: ClassTeacherState) => state.classTeachers
);

export const selectErrorMessage = createSelector(
  selectClassTeacher,
  (state: ClassTeacherState) => state.errorMessage
);

export const selectClassTeacherIsLoading = createSelector(
  selectClassTeacher,
  (state: ClassTeacherState) => state.classTeachersIsLoading
);
