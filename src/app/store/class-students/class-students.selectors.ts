import { createFeatureSelector, createSelector, select } from "@ngrx/store";
import { ClassStudentState } from "./class-students.reducer";

export const selectClassStudent = createFeatureSelector<ClassStudentState>('classStudent');

export const selectClassStudentIsLoading = createSelector(
  selectClassStudent,
  (state: ClassStudentState) => state.classStudentsIsLoading
);

export const selectClassStudentPaginatorOptions = createSelector(
  selectClassStudent,
  (state: ClassStudentState) => state.paginator
);

export const selectClassStudentErrorMessage = createSelector(
  selectClassStudent,
  (state: ClassStudentState) => state.errorMessage
);

export const selectClassStudentArray = createSelector(
  selectClassStudent,
  (state: ClassStudentState) => state.classStudents
);
