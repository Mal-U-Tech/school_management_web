export interface IMenuItem {
  title: string;
  icon: string;
  suffix?: string;
  route: string[];
}

export interface IMenu extends IMenuItem {
  items: IMenuItem[];
}
