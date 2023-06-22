import { SchoolInfoState } from './school-info/school-info.reducer';
import { AuthState } from './user/user.states';

export interface AppState {
  auth: AuthState;
  schoolInfo: SchoolInfoState;
}
