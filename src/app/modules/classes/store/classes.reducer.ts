import { createReducer, on } from '@ngrx/store';
import { ClassState, initial } from './classes.state';
import {
  loadClassEffect,
  loadClassStudentsEffectFailed,
  loadClassStudentsEffectSuccess,
  nameChangeDialogClose,
  removeSubjectDialogClose,
  removeTeacherDialogClose,
  updateClassEffectFailed,
  updateSubjectsDialogClose,
  updateTeachersDialogClose,
  userClickClassExpandable,
  userClickNameChangeSave,
  userClickRemoveClassSubject,
  userClickRemoveClassTeacher,
  userClickUpdateSubjectsSave,
  userClickUpdateTeachersSave,
} from './classes.actions';
import { updateAppSchoolEffect } from 'src/app/store/app.actions';

export const key = 'classes';

export const reducer = createReducer<ClassState>(
  initial,
  on(
    userClickClassExpandable,
    userClickNameChangeSave,
    userClickRemoveClassSubject,
    userClickUpdateSubjectsSave,
    userClickRemoveClassTeacher,
    userClickUpdateTeachersSave,
    (state): ClassState => ({
      ...state,
      api: {
        loading: true,
        complete: false,
        error: undefined,
      },
    })
  ),
  on(
    loadClassStudentsEffectSuccess,
    (state, { students }): ClassState => ({
      ...state,
      students,
      api: {
        loading: false,
        complete: true,
        error: undefined,
      },
    })
  ),
  on(
    loadClassStudentsEffectFailed,
    (state, { error }): ClassState => ({
      ...state,
      api: {
        loading: false,
        complete: false,
        error,
      },
    })
  ),
  on(
    loadClassEffect,
    (state, action): ClassState => ({
      ...state,
      class: action.class.id,
    })
  ),
  on(
    nameChangeDialogClose,
    removeSubjectDialogClose,
    updateSubjectsDialogClose,
    removeTeacherDialogClose,
    updateTeachersDialogClose,
    (state): ClassState => ({
      ...state,
      api: {
        loading: false,
        complete: false,
        error: undefined,
      },
    })
  ),

  on(
    updateAppSchoolEffect,
    (state): ClassState => ({
      ...state,
      api: {
        loading: false,
        complete: true,
        error: undefined,
      },
    })
  ),
  on(
    updateClassEffectFailed,
    (state, { error }): ClassState => ({
      ...state,
      api: {
        loading: false,
        complete: false,
        error,
      },
    })
  )
);
