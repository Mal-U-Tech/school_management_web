import { createReducer, on } from '@ngrx/store';
import { ISchoolInfo } from 'src/app/school-registration/models/school-info.model';
import {
  addSchoolInfo,
  checkModulesError,
  checkModulesRequest,
  isSchoolInfoLoading,
} from './school-info.actions';

export interface SchoolInfoState {
  schoolInfo: ISchoolInfo;
  isSchoolInfoLoading: boolean;
  errorMsg: string;
}

export const initialState: SchoolInfoState = {
  schoolInfo: null as any,
  isSchoolInfoLoading: false,
  errorMsg: '',
};

export const schoolInfoReducer = createReducer(
  initialState,
  on(checkModulesRequest, (state, { _id }): SchoolInfoState => ({ ...state })),
  on(
    addSchoolInfo,
    (state, { school_info }): SchoolInfoState => ({
      ...state,
      schoolInfo: school_info,
    })
  ),
  on(
    isSchoolInfoLoading,
    (state, { isSchoolInfoLoading }): SchoolInfoState => ({
      ...state,
      isSchoolInfoLoading: isSchoolInfoLoading,
    })
  ),
  on(
    checkModulesError,
    (state, { message }): SchoolInfoState => ({
      ...state,
      errorMsg: message,
    })
  )
);
