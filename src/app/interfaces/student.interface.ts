import { IUser } from "./user.interface";

export interface IStudent {
  user_id: string;
  user: IUser;

  school_id: string;

  created_at: Date;
  updated_at: Date;
}
