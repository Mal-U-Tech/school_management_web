import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserApiService } from '../shared/user/user-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass'],
})
export class RegistrationComponent implements OnInit {
  public username = new FormControl('');
  public userSurname = new FormControl('');
  public userContact = new FormControl('');
  public userEmail = new FormControl('');
  public schoolName = new FormControl('');
  public schoolRegion = new FormControl('');
  public userRole = new FormControl('System Administrator');
  public password = new FormControl('');
  public confirmPassword = new FormControl('');
  public visible = true;

  constructor(public userApi: UserApiService, public router: Router) {}

  ngOnInit(): void {}

  public submitForm() {
    if (this.password.value != this.confirmPassword.value) {
      window.alert('Passwords do not match.');
    } else if (this.password.value == '') {
      window.alert('Passwords are empty.');
    } else {
      this.userApi
        .userRegister({
          name: this.username.value,
          surname: this.userSurname.value,
          contact: this.userContact.value,
          email: this.userEmail.value,
          password: this.password.value,
          userRole: this.userRole.value,
        })
        .subscribe((data: any) => {
          console.log(data.data);
          this.router.navigate([
            `/school-registration/${data.data._id}/${data.data.email}/${data.data.name}/${data.data.surname}/${data.data.contact}`,
          ]);
          // this.router.navigate(['/school-registration']);
        });
    }
  }

  showPassword() {
    console.log('Making password visible');
    this.visible = !this.visible;
  }
}
