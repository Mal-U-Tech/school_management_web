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
