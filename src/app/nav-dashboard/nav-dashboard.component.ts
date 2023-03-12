import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nav-dashboard',
  templateUrl: './nav-dashboard.component.html',
  styleUrls: ['./nav-dashboard.component.scss'],
})
export class NavDashboardComponent {
  public date: any;
  public salutations: any;
  constructor(private router: Router, private route: ActivatedRoute) {
    setInterval(() => {
      this.date = new Date();
      // console.log(`This is the date: ${this.date.getHours()}`);
      let hours = this.date.getHours();

      if (hours >= 0 && hours <= 11) {
        this.salutations = 'Good Morning';
      } else if (hours >= 12 && hours <= 14) {
        this.salutations = 'Good Day';
      } else if (hours >= 15 && hours <= 17) {
        this.salutations = 'Good Afternoon';
      } else {
        this.salutations = 'Good Evening';
      }
    }, 1000);
  }

  navigate(path: any) {
    this.router.navigate([{ outlets: { primary: path, sidemenu: path } }], {
      relativeTo: this.route,
    });
  }
}
