import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SchoolRegApiService } from '../shared/school-registration/school-reg-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-school-registration',
  templateUrl: './school-registration.component.html',
  styleUrls: ['./school-registration.component.scss'],
})
export class SchoolRegistrationComponent implements OnInit, OnDestroy {
  public schoolName = new FormControl('');
  public schoolRegion = new FormControl('');
  public schoolEmail = new FormControl('');
  public schoolAdministrator = new FormControl('');

  constructor(
    public schoolRegApi: SchoolRegApiService,
    public router: Router,
    private _snackBar: MatSnackBar
  ) {}
  public sub: any;

  public id: any;
  public name: any;
  public surname: any;
  public contact: any;
  public email: any;
  isLoading = false;

  ngOnInit(): void {
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

    this.schoolRegApi
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
        error: (error) => {
          this.isLoading = false;
          console.log(`This is error ${error}`);
          this.openSnackBar(error, 'Close');
        },
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }
}
