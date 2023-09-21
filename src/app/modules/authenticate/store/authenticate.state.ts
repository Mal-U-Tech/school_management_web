
export interface AuthenticateState {
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
