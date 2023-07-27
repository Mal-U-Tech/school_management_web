import { createReducer, on } from '@ngrx/store';
import { ISubjects } from 'src/app/shared/add-subjects/add-subjects.interface';
import { IClassname } from 'src/app/shared/classname/classname.interface';
import { IScoresheet } from 'src/app/shared/scoresheet/scoresheet.interface';
import {
  deleteScoresheetError,
  deleteScoresheetRequest,
  deleteScoresheetSuccess,
  getScoresheetError,
  getScoresheetRequest,
  getScoresheetSuccess,
  postScoresheetError,
  postScoresheetRequest,
  postScoresheetSuccess,
  resetSelectedScoresheet,
  scoresheetIsLoading,
  setSelectedScoresheet,
  setSelectedStream,
  setSelectedSubject,
  updateScoresheetError,
  updateScoresheetRequest,
  updateScoresheetSuccess,
} from './scoresheet.action';

export interface ScoresheetState {
  scoresheets: IScoresheet[];
  errorMessage: string;
  scoresheetIsLoading: boolean;
  selectedScoresheet: IScoresheet;
  selectedStream: IClassname;
  selectedSubject: ISubjects;
}

const initialState: ScoresheetState = {
  scoresheets: null as any,
  errorMessage: '',
  selectedScoresheet: null as any,
  scoresheetIsLoading: false,
  selectedStream: null as any,
  selectedSubject: null as any,
};

export const scoresheetReducer = createReducer(
  initialState,
  on(
    scoresheetIsLoading,
    (state, { isLoading }): ScoresheetState => ({
      ...state,
      scoresheetIsLoading: isLoading,
    }),
  ),
  on(
    setSelectedScoresheet,
    (state, { selectedScoresheet }): ScoresheetState => ({
      ...state,
      selectedScoresheet: selectedScoresheet,
      errorMessage: '',
    }),
  ),
  on(
    resetSelectedScoresheet,
    (state): ScoresheetState => ({
      ...state,
      selectedScoresheet: null as any,
    }),
  ),
  on(
    setSelectedStream,
    (state, { selectedStream }): ScoresheetState => ({
      ...state,
      selectedStream: selectedStream,
      errorMessage: '',
    }),
  ),
  on(
    setSelectedSubject,
    (state, { selectedSubject }): ScoresheetState => ({
      ...state,
      selectedSubject: selectedSubject,
      errorMessage: '',
    }),
  ),

  // post scoresheet action reducer
  on(
    postScoresheetRequest,
    (state, { scoresheet }): ScoresheetState => ({ ...state }),
  ),
  on(
    postScoresheetSuccess,
    (state, { scoresheet }): ScoresheetState => ({
      ...state,
      scoresheets: [...state.scoresheets, scoresheet],
      errorMessage: '',
    }),
  ),
  on(
    postScoresheetError,
    (state, { message }): ScoresheetState => ({
      ...state,
      errorMessage: message,
    }),
  ),

  // get scoresheet action reducer
  on(getScoresheetRequest, (state): ScoresheetState => ({ ...state })),
  on(
    getScoresheetSuccess,
    (state, { scoresheets }): ScoresheetState => ({
      ...state,
      scoresheets: scoresheets,
      errorMessage: '',
    }),
  ),
  on(
    getScoresheetError,
    (state, { message }): ScoresheetState => ({
      ...state,
      errorMessage: message,
    }),
  ),

  // update scoresheet action reducer
  on(
    updateScoresheetRequest,
    (state, { id, scoresheet }): ScoresheetState => ({ ...state }),
  ),
  on(updateScoresheetSuccess, (state, { scoresheet }): ScoresheetState => {
    const index = state.scoresheets.findIndex(
      (sheet) => sheet._id! === scoresheet._id!,
    );
    const newArr = state.scoresheets;
    newArr[index] = scoresheet;

    return {
      ...state,
      scoresheets: newArr,
      errorMessage: '',
    };
  }),
  on(
    updateScoresheetError,
    (state, { message }): ScoresheetState => ({
      ...state,
      errorMessage: message,
    }),
  ),

  // delete scoresheet action reducer
  on(
    deleteScoresheetRequest,
    (state, { id }): ScoresheetState => ({ ...state }),
  ),
  on(deleteScoresheetSuccess, (state, { id }): ScoresheetState => {
    const newArr = state.scoresheets.filter((sheet) => sheet._id! !== id);

    return {
      ...state,
      scoresheets: newArr,
      errorMessage: '',
    };
  }),
  on(
    deleteScoresheetError,
    (state, { message }): ScoresheetState => ({
      ...state,
      errorMessage: message,
    }),
  ),
);
