import { createAction, props } from '@ngrx/store';
import { IClassStudent } from 'src/app/shared/class-students/class-students.interface';

// general actions
export const classStudentsIsLoading = createAction(
  '[Class Students] Class students is loading',
  props<{ classStudentsIsLoading: boolean }>()
);

export const classStudentsPaginatorOptions = createAction(
  '[Class Students] Class students paginator options',
  props<{
    paginator: {
      currentPage: number;
      pageSize: number;
      count: number;
    };
  }>()
);

// Post class students array actions
export const postClassStudentsArrayRequest = createAction(
  '[Class Students] Post class students array request',
  props<{ classStudents: IClassStudent[] }>()
);

export const postClassStudentsArraySuccess = createAction(
  '[Class Students] Post class students array success',
  props<{ classStudents: IClassStudent[] }>()
);

export const postClassStudentsArrayError = createAction(
  '[Class Students] Post class students array error',
  props<{ message: string }>()
);

// Post class student object actions
export const postClassStudentObjectRequest = createAction(
  '[Class Students] Post class student object request',
  props<{ classStudent: IClassStudent }>()
);

export const postClassStudentObjectSuccess = createAction(
  '[Class Students] Post class student object success',
  props<{ classStudent: IClassStudent }>()
);

export const postClassStudentObjectError = createAction(
  '[Class Students] Post class student object error',
  props<{ message: string }>()
);

// Get class student array actions
export const getClassStudentsArrayRequest = createAction(
  '[Class Students] Get class students array request',
  props<{ currentPage: number; pageSize: number }>()
);

export const getClassStudentsArraySuccess = createAction(
  '[Class Students] Get class students array success',
  props<{ classStudents: IClassStudent[] }>()
);

export const getClassStudentsArrayError = createAction(
  '[Class Students] Get class students array error',
  props<{ message: string }>()
);

// Update class student object actions
export const updateClassStudentObjectRequest = createAction(
  '[Class Students] Update class student object request',
  props<{ id: string; classStudent: IClassStudent }>()
);

export const updateClassStudentObjectSuccess = createAction(
  '[Class Students] Update class student object success',
  props<{ classStudent: IClassStudent }>()
);

export const updateClassStudentObjectError = createAction(
  '[Class Students] Update class student object error',
  props<{ message: string }>()
);

// Delete class student object actions
export const deleteClassStudentObjectRequest = createAction(
  '[Class Students] Delete class student object request',
  props<{ id: string }>()
);

export const deleteClassStudentObjectSuccess = createAction(
  '[Class Students] Delete class student object success',
  props<{ id: string }>()
);

export const deleteClassStudentObjectError = createAction(
  '[Class Students] Delete class student object error',
  props<{ message: string }>()
);
