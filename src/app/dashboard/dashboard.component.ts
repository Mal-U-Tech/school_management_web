import { Component, ViewChild } from '@angular/core';
import { IgxNavigationDrawerComponent } from 'igniteui-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent {
  // public schoolName = 'Masibekela High School';
  // public schoolRegion = 'HHOHHO';
  //
  // public buttons = [
  //   {
  //     title: 'Administration',
  //     link: '/administration',
  //   },
  //   {
  //     title: 'Academics',
  //     link: '/academics',
  //   },
  //   {
  //     title: 'Teacher',
  //     link: '/teacher',
  //   },
  //   {
  //     title: 'Roles',
  //     link: '/roles',
  //   },
  // ];
  //
  // public role = 'Administrator';
  // public username = 'Fanelesibonge Malaza';
  // public loaderMessage = 'Loading from dashboard';
  // public showLoader = false;
  //
  // loader() {
  //   this.showLoader = !this.showLoader;
  // }

  // nav drawer tutorial
  @ViewChild(IgxNavigationDrawerComponent, { static: true })
  public drawer!: IgxNavigationDrawerComponent;

  public navItems = [
    { name: 'account_circle', text: 'Avatar' },
    { name: 'error', text: 'Badge' },
    { name: 'group_work', text: 'Button Group' },
  ];

  public selected = 'Avatar';

  public navigate(item: any) {
    this.selected = item.text;
    this.drawer.close();
  }
}
