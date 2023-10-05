import { createReducer, on } from '@ngrx/store';
import { ClassState, initial } from './classes.state';
import { loadClassEffect, loadClassStudentsEffectFailed, loadClassStudentsEffectSuccess, userClickClassExpandable } from './classes.actions';

export const key = 'classes';

export const reducer = createReducer<ClassState>(
  initial,
  on(
    userClickClassExpandable,
    (state): ClassState => ({
      ...state,
      api: {
        loading: true,
        error: undefined,
      }
    })
  ),
  on(
    loadClassStudentsEffectSuccess,
    (state, { students }): ClassState => ({
      ...state,
      students,
      api: {
        loading: false,
        error: undefined,
      }
    })
  ),
  on(
    loadClassStudentsEffectFailed,
    (state, { error }): ClassState => ({
      ...state,
      api: {
        loading: false,
        error
      }
    })
  ),
  on(
    loadClassEffect,
    (state, action): ClassState => ({
      ...state,
      class: action.class
    }),
  ),
);
