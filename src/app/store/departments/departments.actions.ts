import { createAction, props } from '@ngrx/store';
import {
  IDepartments,
  IDepartmentsArray,
} from 'src/app/shared/add-departments/add-departments.interface';

// general actions
export const departmentsIsLoading = createAction(
  '[Departments] Departments is Loading',
  props<{ departmentsIsLoading: boolean }>()
);

export const addDepartmentPaginatorOptions = createAction(
  '[Departments] Add paginator options',
  props<{
    paginator: {
      currentPage: number;
      pageSize: number;
      count: number;
    };
  }>()
);

// API GET function definitions
export const getDepartmentsRequest = createAction(
  '[Departments] Get Departments Request',
  props<{ currentPage: number; pageSize: number }>()
);

export const getDepartmentsSuccess = createAction(
  '[Departments] Get Departments Success',
  props<{ departments: IDepartments[] }>()
);

export const getDepartmentsError = createAction(
  '[Departments] Get Departments Error',
  props<{ message: string }>()
);

// API Post function definitions
export const postDepartmentsArrayRequest = createAction(
  '[Departments] Post deparments request',
  props<{ departments: IDepartmentsArray }>()
);

export const postDepartmentsArraySuccess = createAction(
  '[Departments] Post departments success',
  props<{ departments: IDepartments[] }>()
);

export const postDepartmentsArrayError = createAction(
  '[Departments] Post departments error',
  props<{ message: string }>()
);

export const postDepartmentRequest = createAction(
  '[Departments] Post department request',
  props<{ department: IDepartments }>()
);

export const postDepartmentSuccess = createAction(
  '[Departments] Post department success',
  props<{ department: IDepartments }>()
);

export const postDepartmentError = createAction(
  '[Departments] Post department error',
  props<{ message: string }>()
);

// API Update function definitions
export const updateDepartmentRequest = createAction(
  '[Departments] Update department request',
  props<{ id: string; department: IDepartments }>()
);

export const updateDepartmentSuccess = createAction(
  '[Departments] Update department success',
  props<{ id: string; department: IDepartments }>()
);

export const updateDepartmentError = createAction(
  '[Departments] Update department error',
  props<{ message: string }>()
);

// API Delete function definitions
export const deleteDepartmentRequest = createAction(
  '[Departments] Delete department request',
  props<{ id: string }>()
);

export const deleteDepartmentSuccess = createAction(
  '[Departments] Delete department success',
  props<{ id: string }>()
);

export const deleteDepartmentError = createAction(
  '[Departments] Delete department error',
  props<{ message: string }>()
);
