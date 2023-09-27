import { createAction, props } from '@ngrx/store';
import { IMenuItem } from '../interfaces/menu.interface';

export const toolbarLogoutClick = createAction(
  '[Dashboard] Toolbar Logout Click'
);

export const routerMenuUpdateEffect = createAction(
  '[Dashboard] Router Menu Update Effect',
  props<{ item?: IMenuItem }>()
);
