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
import { SessionStorageService } from '../shared/session-state/session-storage.service';

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

  public spinner = {
    opacity: '0',
    display: 'none',
  };

  constructor(
    public userApi: UserApiService,
    public router: Router,
    private _snackBar: MatSnackBar,
    private readonly storageService: SessionStorageService
  ) {}

  ngOnInit(): void {}

  public submitForm() {
    this.userApi.userLogin(this.email.value, this.password.value).subscribe({
      next: (data: any) => {
        console.log(`This is data: ${data}`);

        // TODO: route to home, once system is done

        this.spinner = {
          opacity: '1',
          display: 'block',
        };
        // save user data for
        this.storageService.set('id', data._id);
        this.storageService.set('name', data.name);
        this.storageService.set('contact', data.contact);
        this.storageService.set('surname', data.surname);
        this.storageService.set('email', data.email);

        this.checkModules(data);
      },
      error: (error: any) => {
        console.log(`This is error: ${error}`);
        this.openSnackBar(error, 'Close');
      },
    });
  }

  public checkModules(data: any) {
    console.log(data);
    this.userApi.checkModules(data._id).subscribe({
      next: (res: any) => {
        console.log(res);

        if (res.missing.length) {
          const missing = res.missing[0].name;

          if (missing === 'school-info') {
            this.router.navigate([
              `/school-registration/${data._id}/${data.email}/${data.name}/${data.surname}/${data.contact}`,
            ]);
          } else if (missing === 'classnames') {
            this.router.navigate(['/reg-classnames']);
          }
        }

        if (res.success === 400) {
          this.router.navigate(['/dashboard']);
        } else if (res.success === 300) {
        }
      },
      error: (error: any) => {
        console.log(error);
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
