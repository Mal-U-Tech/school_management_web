export interface IMenuItem {
  title: string;
  icon: string;
  route: string[];
}

export interface IMenu extends IMenuItem {
  items: IMenuItem[];
}
