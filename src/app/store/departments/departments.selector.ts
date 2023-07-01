import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DepartmentState } from './departments.reducer';

export const selectDepartment =
  createFeatureSelector<DepartmentState>('department');

export const selectDepartmentsArray = createSelector(
  selectDepartment,
  (state: DepartmentState) => state.departments
);

export const selectDepartmentErrorMessage = createSelector(
  selectDepartment,
  (state: DepartmentState) => state.errorMessage
);

export const selectDepartmentIsLoading = createSelector(
  selectDepartment,
  (state: DepartmentState) => state.departmentsIsLoading
);

export const selectDepartmentsPaginatorOptions = createSelector(
  selectDepartment,
  (state: DepartmentState) => state.paginator
);
