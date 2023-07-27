import { createAction, props } from '@ngrx/store';
import { IHOD, IHodPost } from 'src/app/shared/hod/hod.interface';

// general actions
export const hodIsLoading = createAction(
  '[HOD] HOD is loading',
  props<{ hodIsLoading: boolean }>()
);

// post hod actions
export const postHodRequest = createAction(
  '[HOD] Post hod request',
  props<{ hod: IHodPost }>()
);

export const postHodSuccess = createAction(
  '[HOD] Post hod success',
  props<{ hod: IHOD }>()
);

export const postHodError = createAction(
  '[HOD] Post hod error',
  props<{ message: string }>()
);

// get hod actions
export const getHodRequest = createAction(
  '[HOD] Get hod request',
  props<{ currentPage: number; pageSize: number }>()
);

export const getHodSuccess = createAction(
  '[HOD] Get hod success',
  props<{ hods: IHOD[] }>()
);

export const getHodError = createAction(
  '[HOD] Get hod error',
  props<{ message: string }>()
);

// update hod actions
export const updateHodRequest = createAction(
  '[HOD] Update hod request',
  props<{ id: string; hod: IHodPost }>()
);

export const updateHodSuccess = createAction(
  '[HOD] Update hod success',
  props<{ hod: IHOD }>()
);

export const updateHodError = createAction(
  '[HOD] Update hod error',
  props<{ message: string }>()
);

// delete hod actions
export const deleteHodRequest = createAction(
  '[HOD] Delete hod request',
  props<{ id: string }>()
);

export const deleteHodSuccess = createAction(
  '[HOD] Delete hod success',
  props<{ id: string }>()
);

export const deleteHodError = createAction(
  '[HOD] Delete hod error',
  props<{ message: string }>()
);
