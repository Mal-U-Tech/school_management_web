import { Component } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { registerButtonClick } from '../../store/authenticate.actions';
import { IUser } from '../../interfaces/user.interface';
import { selectAuthError, selectAuthLoading } from '../../store/authenticate.selectors';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  form = this.builder.group({
    email: ['', [Validators.required, Validators.email]],
    firstname: [''],
    lastname: [''],
    mobile: [''],
    password: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(25)],
    ],
    confirm: [
      '',
      [
        Validators.required,
        (control?: FormControl<string>) => {
          if (!control) {
            return null;
          }
          if (
            (control.parent?.controls as { password: FormControl<string> })
              ?.password.value !== control.value
          ) {
            return {
              match: true,
            };
          }
          return null;
        },
      ],
    ],
    policy: [false, Validators.requiredTrue],
  });
  visible = false;

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  get email() {
    return this.form.controls.email;
  }
  get firstname() {
    return this.form.controls.firstname;
  }
  get lastname() {
    return this.form.controls.lastname;
  }
  get mobile() {
    return this.form.controls.mobile;
  }
  get password() {
    return this.form.controls.password;
  }
  get confirm() {
    return this.form.controls.confirm;
  }
  get policy() {
    return this.form.controls.policy;
  }

  constructor(
    private router: Router,
    private store: Store,
    private builder: NonNullableFormBuilder
  ) {}

  submit() {
    const data = this.form.getRawValue();
    const user = {
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      mobile: data.mobile,
      password: data.password
    } as IUser;
    this.store.dispatch(registerButtonClick({ user }))
  }

  toggle() {
    this.visible = !this.visible;
  }

  login() {
    this.router.navigate(['login']);
  }
}
