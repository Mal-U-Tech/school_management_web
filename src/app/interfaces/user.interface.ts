import { ISubject } from "./subject.interface";

export interface IUser {
  id: string;

  email: string;
  mobile: string;
  password?: string;

  firstname?: string;
  lastname?: string;
  avatar?: string;

  groups: {
    id: string;
    name: string;
  }[];
  subjects?: ISubject[];

  token: string;
}
