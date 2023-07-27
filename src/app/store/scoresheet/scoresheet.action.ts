import { createAction, props } from '@ngrx/store';
import { ISubjects } from 'src/app/shared/add-subjects/add-subjects.interface';
import { IClassname } from 'src/app/shared/classname/classname.interface';
import { IScoresheet } from 'src/app/shared/scoresheet/scoresheet.interface';

// general actions
export const scoresheetIsLoading = createAction(
  '[Scoresheet] Scoresheet is loading',
  props<{ isLoading: boolean }>(),
);

export const setSelectedScoresheet = createAction(
  '[Scoresheet] Set selected scoresheet',
  props<{ selectedScoresheet: IScoresheet }>(),
);

export const resetSelectedScoresheet = createAction(
  '[Scoresheet] Reset selected scoresheet',
);

export const setSelectedStream = createAction(
  '[Scoresheet] Set selected stream',
  props<{ selectedStream: IClassname }>(),
);

export const setSelectedSubject = createAction(
  '[Scoresheet] Set selected subject',
  props<{ selectedSubject: ISubjects }>(),
);

// post scoresheet actions
export const postScoresheetRequest = createAction(
  '[Scoresheet] Post scoresheet request',
  props<{ scoresheet: IScoresheet }>(),
);

export const postScoresheetSuccess = createAction(
  '[Scoresheet] Post scoresheet success',
  props<{ scoresheet: IScoresheet }>(),
);

export const postScoresheetError = createAction(
  '[Scoresheet] Post scoresheet error',
  props<{ message: string }>(),
);

// get scoresheet actions
export const getScoresheetRequest = createAction(
  '[Scoresheet] Get scoresheet request',
);

export const getScoresheetSuccess = createAction(
  '[Scoresheet] Get scoresheet success',
  props<{ scoresheets: IScoresheet[] }>(),
);

export const getScoresheetError = createAction(
  '[Scoresheet] Get scoresheet error',
  props<{ message: string }>(),
);

// get Streams from scoresheet actions
export const getStreamsFromScoresheetRequest = createAction(
  '[Scoresheet] Get streams from scoresheet request',
  props<{ scoresheet_id: string }>(),
);

export const getStreamsFromScoresheetSuccess = createAction(
  '[Scoresheet] Get streams from scoresheet success',
  props<{ scoresheet: IScoresheet }>(),
);

export const getStreamsFromScoresheetError = createAction(
  '[Scoresheet] Get streams from scoresheet error',
  props<{ message: string }>(),
);

// get one scoresheet actions
export const getOneScoresheetRequest = createAction(
  '[Scoresheet] Get one scoresheet request',
  props<{ id: string }>(),
);

export const getOneScoresheetSuccess = createAction(
  '[Scoresheet] Get one scoresheet success',
  props<{ scoresheet: IScoresheet }>(),
);

export const getOneScoresheetError = createAction(
  '[Scoresheet] Get one scoresheet error',
  props<{ messge: string }>(),
);

// update scoresheet actions
export const updateScoresheetRequest = createAction(
  '[Scoresheet] Update scoresheet request',
  props<{ id: string; scoresheet: IScoresheet }>(),
);

export const updateScoresheetSuccess = createAction(
  '[Scoresheet] Update scoresheet success',
  props<{ scoresheet: IScoresheet }>(),
);

export const updateScoresheetError = createAction(
  '[Scoresheet] Update scoresheet error',
  props<{ message: string }>(),
);

// delete scoresheet actions
export const deleteScoresheetRequest = createAction(
  '[Scoresheet] Delete scoresheet request',
  props<{ id: string }>(),
);

export const deleteScoresheetSuccess = createAction(
  '[Scoresheet] Delete scoresheet success',
  props<{ id: string }>(),
);

export const deleteScoresheetError = createAction(
  '[Scoresheet] Delete scoresheet error',
  props<{ message: string }>(),
);
