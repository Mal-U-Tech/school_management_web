import { createReducer, on } from '@ngrx/store';
import { SchoolsState, initial } from './schools.state';
import { selectSchoolEffect, routerUpdateSchoolTabEffect } from './schools.actions';
import { updateAppSchoolEffect } from 'src/app/store/app.actions';

export const key = 'schools';

export const reducer = createReducer(
  initial,
  on(
    routerUpdateSchoolTabEffect,
    (state, action): SchoolsState => ({
      ...state,
      tab: action.tab,
    })
  ),
  on(
    selectSchoolEffect,
    updateAppSchoolEffect,
    (state, action): SchoolsState => ({
      ...state,
      school: action.school.id,
    })
  ),
);
