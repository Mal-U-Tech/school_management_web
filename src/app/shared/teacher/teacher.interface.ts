import { IUser } from '../user/user.interface';

export interface ITeacher {
  _id: string;
  user_id: string | IUser;
  gender: string;
  marital_status: string;
}
