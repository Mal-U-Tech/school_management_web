import { createFeatureSelector, createSelector } from "@ngrx/store";
import { HodState } from "./hod.reducer";

export const selectHod = createFeatureSelector<HodState>('hod');

export const selectHodIsLoading = createSelector(
  selectHod,
  (state: HodState) => state.hodIsLoading
);

export const selectHodErrorMessage = createSelector(
  selectHod,
  (state: HodState) => state.errorMessage
);

export const selectHodsArray = createSelector(
  selectHod,
  (state: HodState) => state.hods
);
