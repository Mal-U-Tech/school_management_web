import { createReducer } from '@ngrx/store';
import { initial } from './dashboard.state';

export const key = 'dashboard';

export const reducer = createReducer(initial);
