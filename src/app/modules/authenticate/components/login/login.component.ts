import { Component } from '@angular/core';
import {
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthError, selectAuthLoading } from '../../store/authenticate.selectors';
import { loginButtonClick } from '../../store/authenticate.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  visible = false;
  form = this.builder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.required]
  })

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  get email() {
    return this.form.controls.email;
  }
  get password() {
    return this.form.controls.password;
  }

  constructor(
    private router: Router,
    private store: Store,
    private builder: NonNullableFormBuilder,
  ) {}

  submit() {
    this.store.dispatch(
      loginButtonClick(this.form.getRawValue())
    );
  }

  register() {
    this.router.navigate(['registration']);
  }

  toggle() {
    this.visible = !this.visible;
  }
}
