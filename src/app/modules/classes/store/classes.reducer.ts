import { createReducer, on } from '@ngrx/store';
import { ClassState, initial } from './classes.state';
import {
  loadClassEffect,
  loadClassStudentsEffectFailed,
  loadClassStudentsEffectSuccess,
  nameChangeDialogClose,
  updateClassEffectFailed,
  updateClassEffectSuccessful,
  userClickClassExpandable,
  userClickNameChangeSave,
} from './classes.actions';

export const key = 'classes';

export const reducer = createReducer<ClassState>(
  initial,
  on(
    userClickClassExpandable,
    userClickNameChangeSave,
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
    updateClassEffectSuccessful,
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
