import { IStudent } from "./student.interface";
import { ISubject } from "./subject.interface";
import { IUser } from "./user.interface";

export interface IClass {
  id: string;
  name: string;
  school_id: string;

  subjects?: ISubject[];
  users?: IUser[];
  students?: IStudent[];

  created_at: Date;
  updated_at: Date;
}
