import { IUser } from './user.interface';

export interface ISubject {
  id: string;
  name: string;
  school_id: string;

  teachers?: IUser[];

  created_at: Date;
  updated_at: Date;
}
