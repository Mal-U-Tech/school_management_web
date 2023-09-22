export interface IUser {
  id: string;

  email: string;
  mobile: string;
  password?: string;

  firstname: string;
  lastname: string;
  avatar: string;

  groups: {
    id: string;
    name: string;
  }[];

  token: string;
}
