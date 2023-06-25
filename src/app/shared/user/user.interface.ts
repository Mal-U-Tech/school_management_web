import { ISchoolInfo } from 'src/app/school-registration/models/school-info.model';

export interface IUser {
  token: string;
  _id?: string;
  name: string;
  surname: string;
  contact: string;
  email: string;
  userRole: string;
  password?: string;
}

export interface ICheckModulesResult {
  success: number;
  data: ISchoolInfo;
  missing: { name: string }[];
}
