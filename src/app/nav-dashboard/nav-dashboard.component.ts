import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectSchoolInfoObject } from '../store/school-info/school-info.selector';
import { selectUser } from '../modules/authenticate/store/authenticate.selectors';

@Component({
  selector: 'app-nav-dashboard',
  templateUrl: './nav-dashboard.component.html',
  styleUrls: ['./nav-dashboard.component.scss'],
})
export class NavDashboardComponent {
  date: Date = new Date();
  salutations = '';
  userName = '';
  userSurname = '';
  user$ = this.store.select(selectUser);
  schoolInfo$ = this.store.select(selectSchoolInfoObject);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store
  ) {
    setInterval(() => {
      this.date = new Date();

      const hours = this.date.getHours();

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

    this.loadUserData();
    this.schoolInfo$.subscribe({
      next: (data) => {
        console.log(data);
      }
    })
  }

  navigate(path: string) {
    this.router.navigate([{ outlets: { primary: path, sidemenu: path } }], {
      relativeTo: this.route,
    });
  }

  loadUserData() {
    this.user$.subscribe({
      next: (data) => {
        console.log(data);
      },
    });
    // const user = JSON.parse(sessionStorage.getItem('userData') || '');
    // console.log(user);
    // this.userName = user.name;
    // this.userSurname = user.surname;
  }
}
