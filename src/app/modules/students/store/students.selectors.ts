import { createFeatureSelector, createSelector } from '@ngrx/store';
import { key } from './students.reducer';
import { StudentsState } from './students.state';

const selectStudentState = createFeatureSelector<StudentsState>(key);

export const selectStudentFilter = createSelector(
  selectStudentState,
  (state) => state.filter
);

export const selectStudents = createSelector(
  selectStudentState,
  (state) => state.students
);

export const selectStudentApi = createSelector(
  selectStudentState,
  (state) => state.api
);

