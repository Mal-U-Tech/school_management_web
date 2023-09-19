import { createReducer, on } from '@ngrx/store';
import {
  addSchoolInfo,
  checkModulesError,
  checkModulesRequest,
  isSchoolInfoLoading,
} from './school-info.actions';
import { ISchoolInfo } from 'src/app/interfaces/school.interface';

export interface SchoolInfoState {
  schoolInfo?: ISchoolInfo;
  isSchoolInfoLoading: boolean;
  errorMsg: string;
}

export const initialState: SchoolInfoState = {
  isSchoolInfoLoading: false,
  errorMsg: '',
};

export const schoolInfoReducer = createReducer(
  initialState,
  on(checkModulesRequest, (state): SchoolInfoState => ({ ...state })),
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
