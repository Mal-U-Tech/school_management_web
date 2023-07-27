import { IUser } from '../user/user.interface';

export interface ITeacher {
  _id: string;
  user_id: any;
  gender: string;
  marital_status: string;
  title?: string;
}

export interface ITeacherGetResponse {
  data: ITeacher[];
  count: number;
  totalPages: number;
  pageNo: number;
  rows_per_page: number;
}
