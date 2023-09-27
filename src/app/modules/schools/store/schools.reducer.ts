import { createReducer, on } from '@ngrx/store';
import { SchoolsState, initial } from './schools.state';
import { loadSchoolEffect, routerUpdateTabEffect } from './schools.actions';

export const key = 'schools';

export const reducer = createReducer(
  initial,
  on(
    routerUpdateTabEffect,
    (state, action): SchoolsState => ({
      ...state,
      tab: action.tab,
    })
  ),
  on(
    loadSchoolEffect,
    (state, action): SchoolsState => ({
      ...state,
      school: action.school,
    })
  ),
);
