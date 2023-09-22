import { IMenu } from '../interfaces/menu.interface';

export interface DashboardState {
  menu: IMenu[];
}

/*
const testmenu = {
  title: 'Home',
  icon: 'home',
  route: [''],

  items: [
    {
      title: 'test',
      icon: 'person',
      route: ['test'],
    },
    {
      title: 'Classes',
      icon: 'class',
      route: ['classes']
    }
  ],
};
*/

export const initial: DashboardState = {
  menu: [],
};
