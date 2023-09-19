import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegistrationService } from '../../services/registration/registration.service';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss'],
})
export class SchoolComponent implements OnInit, OnDestroy {
  public schoolName = new FormControl('');
  public schoolRegion = new FormControl('');
  public schoolEmail = new FormControl('');
  public schoolAdministrator = new FormControl('');
  public sub: any;
  public id: any;
  public name: any;
  public surname: any;
  public contact: any;
  public email: any;

  constructor(
    private registration: RegistrationService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}
  isLoading = false;

  ngOnInit() {
    const temp = JSON.parse(sessionStorage.getItem('userData') || '');
    this.id = temp._id;
    this.name = temp.name;
    this.surname = temp.surname;
    this.email = temp.email;
    this.contact = temp.contact;

    this.schoolAdministrator.setValue(`${this.name} ${this.surname}`);
    // this.sub = this._Activatedroute.paramMap.subscribe((params) => {
    //   console.log(params);
    //   this.id = params.get('id');
    //   this.name = params.get('name');
    //   this.surname = params.get('surname');
    //   this.contact = params.get('contact');
    //   this.email = params.get('email');
    //
    //   this.schoolAdministrator.setValue(`${this.name} ${this.surname}`);
    // });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  confirmSchoolRegistration() {

    this.isLoading = true;

    this.registration
      .postSchoolInfo({
        name: this.schoolName.value || '',
        region: this.schoolRegion.value || '',
        administrators: [{ user: this.id }],
        email: this.schoolEmail.value || '',
        teachers: [],
      })
      .subscribe({
        next: (data: any) => {
          this.isLoading = false;
          this.openSnackBar(
            'Successfully registered school information!',
            'Close'
          );
          sessionStorage.setItem('school-info', JSON.stringify(data));
          this.router.navigate([`/dashboard`]);
        },
        error: (error: any) => {
          this.isLoading = false;
          this.openSnackBar(error, 'Close');
        },
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, { duration: 3000 });
  }
}

