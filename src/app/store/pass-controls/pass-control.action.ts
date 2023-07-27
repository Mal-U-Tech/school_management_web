import { createAction, props } from '@ngrx/store';
import { IPassControls } from 'src/app/pass-controls/models/pass-controls.model';

// general actions
export const passControlsIsLoading = createAction(
  '[Pass Controls] Pass controls is loading',
  props<{ isLoading: boolean }>(),
);

export const resetPassControls = createAction(
  '[Pass Controls] Reset pass controls',
);

// post pass controls actions
export const postPassControlsRequest = createAction(
  '[Pass Controls] Post pass controls request',
  props<{ passControls: IPassControls }>(),
);

export const postPassControlsSuccess = createAction(
  '[Pass Controls] Post pass controls success',
  props<{ passControls: IPassControls }>(),
);

export const postPassControlsError = createAction(
  '[Pass Controls] Post pass controls error',
  props<{ message: string }>(),
);

// get pass controls actions
export const getPassControlsRequest = createAction(
  '[Pass Controls] Get pass controls request',
);

export const getPassControlsSuccess = createAction(
  '[Pass Controls] Get pass controls success',
  props<{ passControls: IPassControls[] }>(),
);

export const getPassControlsError = createAction(
  '[Pass Controls] Get pass controls error',
  props<{ message: string }>(),
);

// get pass control by scoresheet
export const getPassControlsByScoresheetRequest = createAction(
  '[Pass Controls] Get pass controls by scoresheet request',
  props<{ id: string }>(),
);

export const getPassControlsByScoresheetSuccess = createAction(
  '[Pass Controls] Get pass controls by scoresheet success',
  props<{ passControls: IPassControls[] }>(),
);

export const getPassControlsByScoresheetError = createAction(
  '[Pass Controls] Get pass controls by scoresheet error',
  props<{ message: string }>(),
);

// update pass controls actions
export const updatePassControlsRequest = createAction(
  '[Pass Controls] Update pass controls request',
  props<{ id: string; passControls: IPassControls }>(),
);

export const updatePassControlsSuccess = createAction(
  '[Pass Controls] Update pass controls success',
  props<{ passControl: IPassControls }>(),
);

export const updatePassControlsError = createAction(
  '[Pass Controls] Update pass controls error',
  props<{ message: string }>(),
);

// delete pass controls actions
export const deletePassControlsRequest = createAction(
  '[Pass Controls] Delete pass controls request',
  props<{ id: string }>(),
);

export const deletePassControlsSuccess = createAction(
  '[Pass Controls] Delete pass controls success',
  props<{ id: string }>(),
);

export const deletePassControlsError = createAction(
  '[Pass Controls] Delete pass controls error',
  props<{ message: string }>(),
);
