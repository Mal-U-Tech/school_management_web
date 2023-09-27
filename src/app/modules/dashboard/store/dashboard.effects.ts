import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { selectDashboardMenu } from './dashboard.selectors';
import { IMenu, IMenuItem } from '../interfaces/menu.interface';
import { routerMenuUpdateEffect } from './dashboard.actions';

@Injectable()
export class DashboardEffects {

  constructor(
    private readonly actions$: Actions,

    private readonly store: Store,
  ) {}

  $menu = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      // get the latest menu items from the dashboard store
      concatLatestFrom(
        () => this.store.select(selectDashboardMenu),
      ),
      // map the router state url to routes
      map(([{ payload }, menu]) => {
        const { url } = payload.routerState;
        const [, ...routes] = url.split('/');

        return [routes, menu] as [string[], IMenu[]];
      }),
      // filter out blanks on the routes
      filter(([routes]) => routes?.length > 0),
      // find the active menu item
      map(([routes, menu]) => {
        const serialized = JSON.stringify(routes);

        const active = menu.reduce<IMenuItem | undefined>((a, c) => {
          const item = c.items.find((i) => {
            return JSON.stringify(i.route) === serialized;
          });

          if (item) {
            return item;
          }
          return a;
        }, undefined);

        return routerMenuUpdateEffect({ item: active });
      })
    );
  });
}
