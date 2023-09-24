export interface IMenuItem {
  title: string;
  icon: string;
  warning: boolean;
  suffix?: string;
  route: string[];
}

export interface IMenu extends IMenuItem {
  items: IMenuItem[];
}
