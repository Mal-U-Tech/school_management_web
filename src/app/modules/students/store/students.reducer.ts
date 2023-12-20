import { createReducer } from '@ngrx/store';
import { StudentsState, initial } from './students.state';

export const key = 'students';

export const reducer = createReducer<StudentsState>(
  initial
);
