import { IMenu } from '../interfaces/menu.interface';

export interface DashboardState {
  menu: IMenu[];
}

export const initial: DashboardState = {
  menu: [],
};
