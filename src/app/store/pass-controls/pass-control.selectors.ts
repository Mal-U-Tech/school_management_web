import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PassControlState } from './pass-control.reducer';

export const selectPassControls =
  createFeatureSelector<PassControlState>('passControls');

export const selectPassControlsArray = createSelector(
  selectPassControls,
  (state: PassControlState) =>  {

    console.log(typeof state.passControls);
    return state.passControls;
  }
);

export const selectPassControlsErrorMessage = createSelector(
  selectPassControls,
  (state: PassControlState) => state.errorMessage,
);

export const selectPassControlIsLoading = createSelector(
  selectPassControls,
  (state: PassControlState) => state.passControlsIsLoading,
);
