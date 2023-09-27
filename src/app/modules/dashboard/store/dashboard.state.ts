import { IMenu, IMenuItem } from '../interfaces/menu.interface';

export interface DashboardState {
  menu: IMenu[];
  active?: IMenuItem
}

export const initial: DashboardState = {
  menu: [],
};
