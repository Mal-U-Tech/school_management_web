import { Component, Input } from '@angular/core';
import { ToolbarService } from '../../services/toolbar.service';
import { Router } from '@angular/router';
import { IMenuItem } from '../../interfaces/menu.interface';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent {
  @Input()
  expanded!: boolean;

  @Input()
  title!: string;
  @Input()
  icon!: string;
  @Input()
  route!: string[];

  @Input()
  items!: IMenuItem[];

  // we define the component bindings here
  toggled = true;

  constructor(
    private service: ToolbarService,
    private router: Router
  ) {}

  // we define a function that will link to the main parts if the interface
  main() {
    this.service.next({
      title: this.title,
      icon: this.icon,
      route: this.route,
    });
  }

  // we define a function that will run the navigation process and service update process
  link(route: { title: string; icon: string; route: string[] }) {
    // so here we are going to emit the item data so that other components are able to react to the route change
    this.service.next(route);
    return this.router.navigate([[...this.route, ...route.route].join('/')])
  }
}
