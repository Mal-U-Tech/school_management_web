import { createAction, props } from '@ngrx/store';
import { ISchoolInfo } from 'src/app/school-registration/models/school-info.model';
import { IUser } from 'src/app/shared/user/user.interface';

// action to add school info for user
export const addSchoolInfo = createAction(
  '[School Info] Add School Info',
  props<{ school_info: ISchoolInfo }>()
);

// action to check school modules
export const checkModulesRequest = createAction(
  '[School Info API] Check School Module',
  props<{ _id: string; user: IUser }>()
);

// action to handle loading school modules
export const isSchoolInfoLoading = createAction(
  '[School Info] School Info Loading',
  props<{ isSchoolInfoLoading: boolean }>()
);

// action to handle school modules loading error
export const checkModulesError = createAction(
  '[School Info] School Info Error',
  props<{ message: string }>()
);
