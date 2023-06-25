import { EventEmitter } from '@angular/core';
import { createAction, props } from '@ngrx/store';
import {
  IClassname,
  IClassnameArray,
} from 'src/app/shared/classname/classname.interface';

export const streamPaginatorOptions = createAction(
  '[Streams] Streams Paginator Options',
  props<{ currentPage: number; pageSize: number }>()
);

// get streams using school id, current page and page size
export const getStreamsRequest = createAction(
  '[Streams] Get Streams API',
  props<{ schoolId: string; currentPage: number; pageSize: number }>()
);

// add streams to store
// export const addStreamsToStore = createAction(
//   '[Streams] Add Streams',
//   props<{ streams: IClassname[] }>()
// );

// is loading
export const streamsIsLoading = createAction(
  '[Streams] Is Loading',
  props<{ streamsIsLoading: boolean }>()
);

// get streams success
export const getStreamsSuccess = createAction(
  '[Streams API] Get Streams Success',
  props<{ streams: IClassname[] }>()
);

// get streams error
export const getStreamsError = createAction(
  '[Streams API] Get Streams Error',
  props<{ message: string }>()
);

/**
 *    UPDATE STREAMS ACTIONS
 * */

// update stream request
export const updateStreamRequest = createAction(
  '[Streams API] Update Stream Request',
  props<{ id: string; classname: IClassname }>()
);

// update stream Success
export const updateStreamSuccess = createAction(
  '[Streams] Update Stream Success',
  props<{ classname: IClassname }>()
);

// update stream error
export const updateStreamError = createAction(
  '[Streams] Update Stream Error',
  props<{ message: string }>()
);

/**
 *    POST STREAMS ACTIONS
 * */

// post stream request
export const postStreamRequest = createAction(
  '[Streams API] Post Streams Request',
  props<{ classname: IClassname }>()
);

// post stream success
export const postStreamRequestSuccess = createAction(
  '[Streams] Post Stream Success',
  props<{ classname: IClassname }>()
);

// post stream error
export const postStreamRequestError = createAction(
  '[Streams] Post Streams Error',
  props<{ message: string }>()
);

/**
 *    POST STREAMS ARRAY ACTIONS
 * */

// post stream array request
export const postStreamArrayRequest = createAction(
  '[Streams API] Post Streams Array Request',
  props<{ classnames: IClassnameArray; postSuccess: boolean }>()
);

export const postSuccessAction = createAction(
  '[Streams] Post success action',
  props<{ postSuccess: boolean }>()
);

// post streams array success
export const postStreamArraySuccess = createAction(
  '[Streams] Post Streams Array Success',
  props<{ classnames: IClassnameArray }>()
);

// post streams array error
export const postStreamArrayError = createAction(
  '[Streams] Post Streams Array Error',
  props<{ message: string }>()
);

/**
 *    DELETE STREAMS ACTIONS
 * */

// delete stream request
export const deleteStreamRequest = createAction(
  '[Streams API] Delete Streams Request',
  props<{ id: string }>()
);

// delete stream success
export const deleteStreamSuccess = createAction(
  '[Streams] Delete Stream Success',
  props<{ id: string }>()
);

// delete stream error
export const deleteStreamError = createAction(
  '[Streams] Delete Stream Error',
  props<{ message: string }>()
);
