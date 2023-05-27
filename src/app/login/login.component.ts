import { Component } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { UserApiService } from '../shared/user/user-api.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUser } from '../shared/user/user.interface';

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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public snackbarMessage = 'This is a snackbar message';
  /*
   *  Form control variable : Reactive Forms
   * */
  public email = new FormControl<string>('', [
    Validators.required,
    Validators.email,
  ]);
  public password = new FormControl<string>('', [Validators.required]);
  public visible = false;
  public matcher = new MyErrorStateMatcher();

  public spinner = {
    opacity: '1',
    display: 'block',
  };
  isLoading = false;
  isCheckModulesLoading = false;

  constructor(
    public userApi: UserApiService,
    public router: Router,
    private _snackBar: MatSnackBar
  ) {}

  public submitForm() {
    this.isLoading = !this.isLoading;
    this.userApi
      .userLogin(this.email.value as string, this.password.value as string)
      .subscribe({
        next: (data: IUser) => {
          // TODO: route to home, once system is done
          console.log(data);
          this.isLoading = false;

          this.spinner = {
            opacity: '1',
            display: 'block',
          };
          // save user data for
          sessionStorage.setItem('userData', JSON.stringify(data));
          this.checkModules(data);
        },
        error: (error) => {
          this.isLoading = false;
          console.log(`This is error: ${error}`);
          this.userApi.errorToast(error);
        },
      });
  }

  public checkModules(data: IUser) {
    this.isCheckModulesLoading = !this.isCheckModulesLoading;
    this.userApi.checkModules(data._id || '').subscribe({
      next: (res) => {
        this.isCheckModulesLoading = false;
        sessionStorage.setItem('school-info', JSON.stringify(res.data));
        console.log(res);
        if (res.missing.length) {
          const missing = res.missing[0].name;

          if (missing === 'school-info') {
            sessionStorage.setItem('user', JSON.stringify(data));
            this.router.navigate([`/school-registration`]);
          }
        }

        if (res.success === 100) {
          this.router.navigate(['/dashboard/academics']);
        }
      },
      error: (error) => {
        this.isCheckModulesLoading = false;
        console.log(error);
        this.userApi.errorToast(error.toString());
      },
    });
  }

  public navToRegister() {
    this.router.navigate([`/registration`]);
  }

  /*
   *  Function to show password in login form
   * */
  showPassword() {
    console.log('Making password visible');
    this.visible = !this.visible;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  public saveSession(key: string, value: string) {
    localStorage.setItem(key, value);
  }
}
