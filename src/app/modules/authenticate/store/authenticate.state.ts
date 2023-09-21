import { IUser } from "../interfaces/user.interface";

export interface AuthenticateState {
  user?: IUser;

  api: {
    loading: boolean;
    error?: Error;
  }
}

export const initial: AuthenticateState = {
  api: {
    loading: false
  }
};
