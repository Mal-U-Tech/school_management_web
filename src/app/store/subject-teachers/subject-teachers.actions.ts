import { createAction, props } from '@ngrx/store';
import { ISubjectTeacher } from 'src/app/shared/subject-teacher/subject-teacher.interface';

// general actions
export const subjectTeacherIsLoading = createAction(
  '[Subject Teacher] Subject teacher is loading',
  props<{ subjectTeacherIsLoading: boolean }>()
);

// post subject teacher
export const postSubjectTeacherRequest = createAction(
  '[Subject Teacher] Post subject teacher request',
  props<{ subjectTeacher: ISubjectTeacher }>()
);

export const postSubjectTeacherSuccess = createAction(
  '[Subject Teacher] Post subject teacher success',
  props<{ subjectTeacher: ISubjectTeacher }>()
);

export const postSubjectTeacherError = createAction(
  '[Subject Teacher] Post subject teacher error',
  props<{ message: string }>()
);

// get subject teacher
export const getSubjectTeachersRequest = createAction(
  '[Subject Teacher] Get subject teachers request',
  props<{ currentPage: number; pageSize: number }>()
);

export const getSubjectTeachersSuccess = createAction(
  '[Subject Teacher] Get subject teachers success',
  props<{ subjectTeachers: ISubjectTeacher[] }>()
);

export const getSubjectTeachersError = createAction(
  '[Subject Teacher] Get subject teachers error',
  props<{ message: string }>()
);

// update subject teacher
export const updateSubjectTeacherRequest = createAction(
  '[Subject Teacher] Update subject teacher request',
  props<{ id: string; subjectTeacher: ISubjectTeacher }>()
);

export const updateSubjectTeacherSuccess = createAction(
  '[Subject Teacher] Update subject teacher success',
  props<{ subjectTeacher: ISubjectTeacher }>()
);

export const updateSubjectTeacherError = createAction(
  '[Subject Teacher ] Update subject teacher error',
  props<{ message: string }>()
);

// delete subject teacher
export const deleteSubjectTeacherRequest = createAction(
  '[Subject Teacher] Delete subject teacher request',
  props<{ id: string }>()
);

export const deleteSubjectTeacherSuccess = createAction(
  '[Subject Teacher] Delete subject teacher success',
  props<{ id: string }>()
);

export const deleteSubjectTeacherError = createAction(
  '[Subject Teacher] Delete subject teacher error',
  props<{ message: string }>()
);
