import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SchoolRegApiService } from '../shared/school-registration/school-reg-api.service';

@Component({
  selector: 'app-school-registration',
  templateUrl: './school-registration.component.html',
  styleUrls: ['./school-registration.component.sass'],
})
export class SchoolRegistrationComponent implements OnInit {
  public schoolName = new FormControl('');
  public schoolRegion = new FormControl('');
  public schoolEmail = new FormControl('');
  public schoolAdministrator = new FormControl('');

  constructor(
    private _Activatedroute: ActivatedRoute,
    public schoolRegApi: SchoolRegApiService,
    public router: Router
  ) {}
  public sub: any;

  public id: any;
  public name: any;
  public surname: any;
  public contact: any;
  public email: any;

  ngOnInit(): void {
    this.sub = this._Activatedroute.paramMap.subscribe((params) => {
      console.log(params);
      this.id = params.get('id');
      this.name = params.get('name');
      this.surname = params.get('surname');
      this.contact = params.get('contact');
      this.email = params.get('email');

      this.schoolAdministrator.setValue(`${this.name} ${this.surname}`);
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  confirmSchoolRegistration() {
    console.log(
      `${this.schoolName.value} ${this.schoolRegion.value} ${this.schoolEmail.value} ${this.schoolAdministrator.value}`
    );

    let body = {
      name: this.schoolName.value,
      region: this.schoolRegion.value,
      administrators: { user: this.id },
      email: this.schoolEmail.value,
    };

    console.log(JSON.stringify(body));
    this.schoolRegApi.postSchoolInfo(body).subscribe((data: any) => {
      console.log(data);
      this.router.navigate([`/reg-classnames`]);
    });
  }
}
