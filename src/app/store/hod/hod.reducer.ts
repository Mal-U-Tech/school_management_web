import { createReducer, on } from '@ngrx/store';
import { IHOD } from 'src/app/shared/hod/hod.interface';
import {
  deleteHodError,
  deleteHodRequest,
  deleteHodSuccess,
  getHodError,
  getHodRequest,
  getHodSuccess,
  hodIsLoading,
  postHodError,
  postHodRequest,
  postHodSuccess,
  updateHodError,
  updateHodRequest,
  updateHodSuccess,
} from './hod.actions';

export interface HodState {
  hods: IHOD[];
  errorMessage: string;
  hodIsLoading: boolean;
}

export const initialState: HodState = {
  hods: null as any,
  errorMessage: '',
  hodIsLoading: false,
};

export const hodReducer = createReducer(
  initialState,
  on(
    hodIsLoading,
    (state, { hodIsLoading }): HodState => ({
      ...state,
      hodIsLoading: hodIsLoading,
    })
  ),

  // post hod actions reducer
  on(postHodRequest, (state, { hod }): HodState => ({ ...state })),
  on(
    postHodSuccess,
    (state, { hod }): HodState => ({
      ...state,
      hods: [...state.hods, hod],
      errorMessage: '',
    })
  ),
  on(
    postHodError,
    (state, { message }): HodState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // get hod actions reducer
  on(
    getHodRequest,
    (state, { currentPage, pageSize }): HodState => ({
      ...state,
    })
  ),
  on(
    getHodSuccess,
    (state, { hods }): HodState => ({
      ...state,
      hods: hods,
      errorMessage: '',
    })
  ),
  on(
    getHodError,
    (state, { message }): HodState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // update hod actions reducer
  on(updateHodRequest, (state, { id, hod }): HodState => ({ ...state })),
  on(updateHodSuccess, (state, { hod }): HodState => {
    const index = state.hods.findIndex((head) => head._id! === hod._id);

    const newArr = [...state.hods];
    newArr[index] = hod;

    return {
      ...state,
      hods: newArr,
      errorMessage: '',
    };
  }),
  on(
    updateHodError,
    (state, { message }): HodState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // delete hod actions reducer
  on(
    deleteHodRequest,
    (state, { id }): HodState => ({
      ...state,
    })
  ),
  on(deleteHodSuccess, (state, { id }): HodState => {
    const newArr = state.hods.filter((head) => head._id! !== id);

    return {
      ...state,
      hods: newArr,
      errorMessage: '',
    };
  }),
  on(
    deleteHodError,
    (state, { message }): HodState => ({
      ...state,
      errorMessage: message,
    })
  )
);
