import { createAction, props } from '@ngrx/store';
import { ITeacher } from 'src/app/shared/teacher/teacher.interface';

// general actions
export const teacherIsLoading = createAction(
  '[Teacher] Teacher is loading',
  props<{ teacherIsLoading: boolean }>()
);

export const addTeacherPaginatorOptions = createAction(
  '[Teacher] Add teacher paginator options',
  props<{
    paginator: { currentPage: number; pageSize: number; count: number };
  }>()
);

// POST actions
export const postTeacherRequest = createAction(
  '[Teacher] Post teacher array request',
  props<{ teacher: ITeacher; schoolInfoId: string }>()
);

export const postTeacherSuccess = createAction(
  '[Teacher] Post teacher success',
  props<{ teacher: ITeacher }>()
);

export const postTeacherError = createAction(
  '[Teacher] Post teacher error',
  props<{ message: string }>()
);

// GET actions
export const getTeachersRequest = createAction(
  '[Teacher] Get teachers request',
  props<{ currentPage: number; pageSize: number }>()
);

export const getTeachersSuccess = createAction(
  '[Teacher] Get teachers success',
  props<{ teachers: ITeacher[] }>()
);

export const getTeachersError = createAction(
  '[Teacher] Get teachers error',
  props<{ message: string }>()
);

// UPDATE actions
export const updateTeacherRequest = createAction(
  '[Teacher] Update teacher request',
  props<{ id: string; teacher: ITeacher }>()
);

export const updateTeacherSuccess = createAction(
  '[Teacher] Update teacher success',
  props<{ teacher: ITeacher }>()
);

export const updateTeacherError = createAction(
  '[Teacher] Update teacher error',
  props<{ message: string }>()
);

// DELETE actions
export const deleteTeacherRequest = createAction(
  '[Teacher] Delete teacher request',
  props<{ id: string; schoolInfoId: string; userId: string }>()
);

export const deleteTeacherSuccess = createAction(
  '[Teacher] Delete teacher success',
  props<{ id: string }>()
);

export const deleteTeacherError = createAction(
  '[Teacher] Delete teacher error',
  props<{ message: string }>()
);
