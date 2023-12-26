import { createReducer, on } from '@ngrx/store';
import { StudentsState, initial } from './students.state';
import { UpdateStudentFilterActions } from './students.actions';

export const key = 'students';

export const reducer = createReducer<StudentsState>(
  initial,
  on(UpdateStudentFilterActions.update, (state, { filter }): StudentsState => ({
    ...state,
    filter,
    api: {
      loading: true,
    }
  })),
  on(UpdateStudentFilterActions.success, (state, { payload }): StudentsState => ({
    ...state,
    students: payload,
    api: {
      loading: false,
    }
  })),
  on(UpdateStudentFilterActions.failed, (state, { error }): StudentsState => ({
    ...state,
    api: {
      loading: false,
      error
    }
  }))
);
