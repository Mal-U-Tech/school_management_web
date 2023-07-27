import { createReducer, on } from '@ngrx/store';
import { IPassControls } from 'src/app/pass-controls/models/pass-controls.model';
import {
  deletePassControlsError,
  deletePassControlsRequest,
  deletePassControlsSuccess,
  getPassControlsByScoresheetError,
  getPassControlsByScoresheetRequest,
  getPassControlsByScoresheetSuccess,
  getPassControlsError,
  getPassControlsRequest,
  getPassControlsSuccess,
  passControlsIsLoading,
  postPassControlsError,
  postPassControlsRequest,
  postPassControlsSuccess,
  resetPassControls,
  updatePassControlsError,
  updatePassControlsRequest,
  updatePassControlsSuccess,
} from './pass-control.action';

export interface PassControlState {
  passControls: IPassControls[];
  errorMessage: string;
  passControlsIsLoading: boolean;
}

export const initialState: PassControlState = {
  passControls: [],
  errorMessage: '',
  passControlsIsLoading: false,
};

export const passControlsReduer = createReducer(
  initialState,
  on(
    passControlsIsLoading,
    (state, { isLoading }): PassControlState => ({
      ...state,
      passControlsIsLoading: isLoading,
    }),
  ),
  on(
    resetPassControls,
    (state): PassControlState => ({
      ...state,
      passControls: [] as IPassControls[],
    }),
  ),

  // post pass controls reducer
  on(
    postPassControlsRequest,
    (state, { passControls }): PassControlState => ({ ...state }),
  ),
  on(
    postPassControlsSuccess,
    (state, { passControls }): PassControlState => ({
      ...state,
      passControls: [...state.passControls, passControls],
      errorMessage: '',
    }),
  ),
  on(
    postPassControlsError,
    (state, { message }): PassControlState => ({
      ...state,
      errorMessage: message,
    }),
  ),

  // get pass controls reducer
  on(getPassControlsRequest, (state): PassControlState => ({ ...state })),
  on(
    getPassControlsSuccess,
    (state, { passControls }): PassControlState => ({
      ...state,
      passControls: [...passControls],
      errorMessage: '',
    }),
  ),
  on(
    getPassControlsError,
    (state, { message }): PassControlState => ({
      ...state,
      errorMessage: message,
    }),
  ),

  // get pass controls by scoresheet reducer
  on(
    getPassControlsByScoresheetRequest,
    (state, { id }): PassControlState => ({ ...state }),
  ),
  on(
    getPassControlsByScoresheetSuccess,
    (state, { passControls }): PassControlState => ({
      ...state,
      passControls: passControls,
      errorMessage: '',
    }),
  ),
  on(
    getPassControlsByScoresheetError,
    (state, { message }): PassControlState => ({
      ...state,
      errorMessage: message,
    }),
  ),

  // update pass controls reducer
  on(updatePassControlsRequest, (state): PassControlState => ({ ...state })),
  on(updatePassControlsSuccess, (state, { passControl }): PassControlState => {
    const index = state.passControls.findIndex(
      (control) => control._id || '' === passControl._id || '',
    );
    const newArr = state.passControls;
    newArr[index] = passControl;

    return {
      ...state,
      passControls: [...newArr],
      errorMessage: '',
    };
  }),
  on(
    updatePassControlsError,
    (state, { message }): PassControlState => ({
      ...state,
      errorMessage: message,
    }),
  ),

  // delete pass controls reducer
  on(
    deletePassControlsRequest,
    (state, { id }): PassControlState => ({
      ...state,
    }),
  ),
  on(deletePassControlsSuccess, (state, { id }): PassControlState => {
    const newArr = state.passControls.filter((control) => control._id! !== id);

    return {
      ...state,
      passControls: [...newArr],
      errorMessage: '',
    };
  }),
  on(
    deletePassControlsError,
    (state, { message }): PassControlState => ({
      ...state,
      errorMessage: message,
    }),
  ),
);
