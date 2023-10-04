import { createAction, props } from '@ngrx/store';
import { IMenuItem } from '../interfaces/menu.interface';
import { INotification } from 'src/app/interfaces/notification.interface';

export const toolbarLogoutClick = createAction(
  '[Dashboard] Toolbar Logout Click'
);

export const routerMenuUpdateEffect = createAction(
  '[Dashboard] Router Menu Update Effect',
  props<{ item?: IMenuItem }>()
);

export const clickDismissDashboardBanner = createAction(
  '[Dashboard] Click Dismiss Dashboard Banner Button',
  props<{ notification: INotification; }>()
)
