import { createReducer } from '@ngrx/store';
import { initial } from './app.state';

export const key = 'app';

export const reducer = createReducer(initial);
