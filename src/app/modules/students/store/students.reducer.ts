import { createReducer, on } from '@ngrx/store';
import { StudentsState, initial } from './students.state';
import {
  AddStudentActions,
  UpdateStudentFilterActions,
} from './students.actions';

export const key = 'students';

export const reducer = createReducer<StudentsState>(
  initial,
  on(
    UpdateStudentFilterActions.update,
    (state, { filter }): StudentsState => ({
      ...state,
      filter,
    })
  ),
  on(
    UpdateStudentFilterActions.success,
    (state, { payload }): StudentsState => ({
      ...state,
      students: payload,
    })
  ),
  // put api triggering actions below
  on(
    AddStudentActions.show,
    (state): StudentsState => ({
      ...state,
      api: {
        loading: false,
        complete: false,
      }
    })
  ),
  on(
    AddStudentActions.submit,
    UpdateStudentFilterActions.update,
    (state): StudentsState => ({
      ...state,
      api: {
        loading: true,
        complete: false,
      },
    })
  ),
  on(
    AddStudentActions.success,
    UpdateStudentFilterActions.success,
    (state): StudentsState => ({
      ...state,
      api: {
        loading: false,
        complete: true,
      }
    })
  ),
  on(
    UpdateStudentFilterActions.failed,
    AddStudentActions.failed,
    (state, { error }): StudentsState => ({
      ...state,
      api: {
        loading: false,
        complete: true,
        error,
      },
    })
  )
);
