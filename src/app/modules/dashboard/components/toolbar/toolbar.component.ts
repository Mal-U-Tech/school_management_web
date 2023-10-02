import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAppUser } from 'src/app/store/app.selectors';
import { toolbarLogoutClick } from '../../store/dashboard.actions';
import {
  ActivatedRoute,
  NavigationEnd,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
} from '@angular/router';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { IBreadCrumb } from 'src/app/interfaces/breadcrumb.interface';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  loader$ = this.router.events.pipe(
    filter(
      (event) =>
        event instanceof RouteConfigLoadStart ||
        event instanceof RouteConfigLoadEnd
    ),
    map((event) => event instanceof RouteConfigLoadStart)
  );
  crumb$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    distinctUntilChanged(),
    map(() => ToolbarComponent.render(this.router.routerState.root))
  );
  user$ = this.store.select(selectAppUser);

  constructor(private readonly store: Store, private readonly router: Router) {}

  logout() {
    this.store.dispatch(toolbarLogoutClick());
  }

  // we define a function that will format the route event into something that can be used to render a chip list
  private static render(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: Array<IBreadCrumb> = [{ label: 'Home', url: '../' }]
  ): Array<IBreadCrumb> {
    const label = route.routeConfig?.data?.['breadcrumb'];

    const path = route.routeConfig ? route.routeConfig.path : '';
    // In the routeConfig the complete path is not available,
    // so we rebuild it each time
    const nextUrl = `${url}${path}`;
    const breadcrumb = {
      label: label,
      url: nextUrl,
    };
    // we copy the bread crumbs
    const newcrumbs = [...breadcrumbs];
    // so if the new url is empty the we push it to the new crumbs to send over
    if (nextUrl.length > 0 && label) {
      newcrumbs.push(breadcrumb);
    }

    if (route.firstChild) {
      // If we are not on our current path yet,
      // there will be more children to look after, to build our breadcumb
      return this.render(route.firstChild, nextUrl, newcrumbs);
    }
    return newcrumbs;
  }
}
