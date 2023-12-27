import { createReducer, on } from '@ngrx/store';
import { ClassState, initial } from './classes.state';
import {
  ClassStudentsEffectActions,
  ClassUpdateEffectActions,
  ClassUpdateStudentActions,
  ClassUpdateSubjectActions,
  ClassUpdateTeacherActions,
} from './classes.actions';
import { updateAppSchoolEffect } from 'src/app/store/app.actions';

export const key = 'classes';

export const reducer = createReducer<ClassState>(
  initial,
  on(
    ClassUpdateEffectActions.init,
    ClassUpdateEffectActions.update,
    (state): ClassState => ({
      ...state,
      api: {
        loading: true,
        complete: false,
      },
    })
  ),
  on(
    ClassUpdateTeacherActions.remove,
    ClassUpdateTeacherActions.update,
    ClassUpdateSubjectActions.remove,
    ClassUpdateSubjectActions.update,
    ClassUpdateStudentActions.remove,
    ClassUpdateStudentActions.update,
    (state): ClassState => ({
      ...state,
      api: {
        loading: false,
        complete: false,
      }
    })
  ),
  on(
    ClassStudentsEffectActions.success,
    (state, { students }): ClassState => ({
      ...state,
      students,
    })
  ),
  on(
    ClassUpdateEffectActions.init,
    (state, action): ClassState => ({
      ...state,
      class: action.class.id,
    })
  ),

  on(
    updateAppSchoolEffect,
    ClassStudentsEffectActions.success,
    (state): ClassState => ({
      ...state,
      api: {
        loading: false,
        complete: true,
      },
    })
  ),
  on(
    ClassUpdateEffectActions.failed,
    ClassStudentsEffectActions.failed,
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
