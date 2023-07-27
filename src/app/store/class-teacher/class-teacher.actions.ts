import { createAction, props } from '@ngrx/store';
import { IClassTeacher } from 'src/app/shared/class-teacher/class-teacher.interface';

// general actions
export const classTeacherIsLoading = createAction(
  '[Class Teacher] Class teacher is loading',
  props<{ classTeacherIsLoading: boolean }>()
);

// post class teacher actions
export const postClassTeacherRequest = createAction(
  '[Class Teacher] Post class teacher request',
  props<{ classTeacher: IClassTeacher }>()
);

export const postClassTeacherSuccess = createAction(
  '[Class Teacher] Post class teacher success',
  props<{ classTeacher: IClassTeacher }>()
);

export const postClassTeacherError = createAction(
  '[Class Teacher] Post class teacher error',
  props<{ message: string }>()
);

// get class teacher actions
export const getClassTeachersRequest = createAction(
  '[Class Teacher] Get class teachers request',
  props<{ currentPage: number; pageSize: number }>()
);

export const getClassTeachersSuccess = createAction(
  '[Class Teacher] Get class teachers success',
  props<{ classTeachers: IClassTeacher[] }>()
);

export const getClassTeachersError = createAction(
  '[Class Teacher] Get class teachers error',
  props<{ message: string }>()
);

// update class teacher actions
export const updateClassTeacherRequest = createAction(
  '[Class Teacher] Update class teacher request',
  props<{ id: string; classTeacher: IClassTeacher }>()
);

export const updateClassTeacherSuccess = createAction(
  '[Class Teacher] Update class teacher success',
  props<{ classTeacher: IClassTeacher }>()
);

export const updateClassTeacherError = createAction(
  '[Class Teacher] Update class teacher error',
  props<{ message: string }>()
);

// delete class teacher actions
export const deleteClassTeacherRequest = createAction(
  '[Class Teacher] Delete class teacher request',
  props<{ id: string }>()
);

export const deleteClassTeacherSuccess = createAction(
  '[Class Teacher] Delete class teacher success',
  props<{ id: string }>()
);

export const deleteClassTeacherError = createAction(
  '[Class Teacher] Delete class teacher error',
  props<{ message: string }>()
);
