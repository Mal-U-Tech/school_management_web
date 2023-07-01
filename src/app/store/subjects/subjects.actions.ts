import { createAction, props } from '@ngrx/store';
import {
  ISubjects,
  ISubjectsArray,
} from 'src/app/shared/add-subjects/add-subjects.interface';

// general actions
export const subjectsIsLoading = createAction(
  '[Subjects] Subjects is loading',
  props<{ subjectsIsLoading: boolean }>()
);

export const addSubjectsPaginatorOptions = createAction(
  '[Subjects] Subject paginator options',
  props<{
    paginator: {
      currentPage: number;
      pageSize: number;
      count: number;
    };
  }>()
);

// API GET function definitions
export const getSubjectsRequest = createAction(
  '[Subjects] Get subjects request',
  props<{ currentPage: number; pageSize: number }>()
);

export const getSubjectsSuccess = createAction(
  '[Subjects] Get subjects success',
  props<{ subjects: ISubjects[] }>()
);

export const getSubjectsError = createAction(
  '[Subjects] Get subject error',
  props<{ message: string }>()
);

// API POST function definitions
export const postSubjectArrayRequest = createAction(
  '[Subjects] Post subjects request',
  props<{ subjects: ISubjectsArray }>()
);

export const postSubjectArraySuccess = createAction(
  '[Subjects] Post subjects success',
  props<{ subjects: ISubjects[] }>()
);

export const postSubjectArrayError = createAction(
  '[Subject] Post subjects error',
  props<{ message: string }>()
);

// API UPDATE function definitions
export const updateSubjectRequest = createAction(
  '[Subjects] Update subject request',
  props<{ id: string; subjects: ISubjects }>()
);

export const updateSubjectSuccess = createAction(
  '[Subjects] Update subject success',
  props<{ id: string; subjects: ISubjects }>()
);

export const updateSubjectsError = createAction(
  '[Subjects] Update subject error',
  props<{ message: string }>()
);

// API DELETE function definitions
export const deleteSubjectRequest = createAction(
  '[Subjects] Delete subject request',
  props<{ id: string }>()
);

export const deleteSubjectSuccess = createAction(
  '[Subjects] Delete subject success',
  props<{ id: string }>()
);

export const deleteSubjectError = createAction(
  '[Subjects] Delete subject error',
  props<{ message: string }>()
);
