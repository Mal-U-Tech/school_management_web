import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nav-dashboard',
  templateUrl: './nav-dashboard.component.html',
  styleUrls: ['./nav-dashboard.component.scss'],
})
export class NavDashboardComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  navigate(path: any) {
    this.router.navigate([{ outlets: { primary: path, sidemenu: path } }], {
      relativeTo: this.route,
    });
  }
}
