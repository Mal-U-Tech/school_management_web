import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { UserApiService } from '../shared/user/user-api.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { matchValidator } from '../shared/user/form.validators';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass'],
})
export class RegistrationComponent implements OnInit {
  public username = new FormControl('', [Validators.required]);
  public userSurname = new FormControl('', [Validators.required]);
  public userContact = new FormControl('', [Validators.required]);
  public userEmail = new FormControl('', [Validators.required]);
  public schoolName = new FormControl('', [Validators.required]);
  public schoolRegion = new FormControl('', [Validators.required]);
  public userRole = new FormControl('System Administrator', [
    Validators.required,
  ]);
  public passwordForm = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
      Validators.minLength(6),
      Validators.maxLength(25),
      matchValidator('confirmPassword', true),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      matchValidator('password'),
    ]),
  });
  public visible = false;
  public confirmVisible = false;
  public matcher = new MyErrorStateMatcher();

  constructor(public userApi: UserApiService, public router: Router) {}

  ngOnInit(): void {}

  public submitForm() {
    if (
      this.passwordForm.get('password')!.value !=
      this.passwordForm.get('confirmPassword')!.value
    ) {
      window.alert('Passwords do not match.');
    } else if (this.passwordForm.get('password')!.value == '') {
      window.alert('Passwords are empty.');
    } else {
      this.userApi
        .userRegister({
          name: this.username.value!.toString(),
          surname: this.userSurname.value!.toString(),
          contact: this.userContact.value!.toString(),
          email: this.userEmail.value!.toString(),
          password: this.passwordForm.get('password')!.value!.toString(),
        })
        .subscribe((data: any) => {
          console.log('Return from backend:');
          console.log(data);
          this.router.navigate([
            `/school-registration/${data._id}/${data.email}/${data.name}/${data.surname}/${data.contact}`,
          ]);
          // save user data in sessionStorage
          sessionStorage.setItem('userData', JSON.stringify(data));
        });
    }
  }

  showPassword() {
    console.log('Making password visible');
    this.visible = !this.visible;
  }

  showConfirmPassword() {
    this.confirmVisible = !this.confirmVisible;
  }

  navToLogin() {
    this.router.navigate(['/login']);
  }
}
