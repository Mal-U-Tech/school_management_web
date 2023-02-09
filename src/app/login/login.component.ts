import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  public snackbarMessage = 'This is a snackbar message';
  /*
   *  Form control variable : Reactive Forms
   * */
  public email = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl('', [Validators.required]);
  public visible = false;
  public matcher = new MyErrorStateMatcher();

  constructor(
    public userApi: UserApiService,
    public router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  public submitForm() {
    this.userApi.userLogin(this.email.value, this.password.value).subscribe({
      next: (data: any) => {
        console.log(`This is data: ${data}`);
        this.router.navigate([
          `/school-registration/${data._id}/${data.email}/${data.name}/${data.surname}/${data.contact}`,
        ]);

        // TODO: route to home, once system is done
      },
      error: (error: any) => {
        console.log(`This is error: ${error}`);
        this.openSnackBar(error, 'Close');
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
    this._snackBar.open(message, action);
  }
}
