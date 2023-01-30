import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserApiService } from '../shared/user/user-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  public snackbarMessage = 'This is a snackbar message';
  public itemsContainerStyles = {
    width: '50%',
    height: '50%',
    backgroundColor: 'cornflowerblue',
    position: 'relative',
    animationName: '',
    animationDuration: '',
    animationFillMode: '',
  };
  public loginButtonStyles = {
    animationName: '',
    animationDuration: '',
    animationFillMode: '',
    zIndex: '',
    position: 'absolute',
  };
  public registerButtonStyles = {
    animationName: '',
    animationDuration: '',
    animationFillMode: '',
  };
  public splashTitleStyles = {
    animationName: '',
    animationDuration: '',
    animationFillMode: '',
  };
  public formContainerStyles = {
    display: 'none',
    animationName: '',
    animationDuration: '',
    animationFillMode: '',
  };
  public snackBarStyle = {
    display: 'none',
    animationName: '',
    animationDuration: '',
    animationFillMode: '',
  };
  /*
   *  Form control variable : Reactive Forms
   * */
  public email = new FormControl('');
  public password = new FormControl('');
  public visible = true;

  constructor(public userApi: UserApiService, public router: Router) {}

  ngOnInit(): void {}

  public submitForm() {
    console.log(
      `Submitting form! \nEmail: ${this.email.value} \nPassword: ${this.password.value}`
    );
    this.userApi
      .userLogin(this.email.value, this.password.value)
      .subscribe((data: any) => {
        // data = JSON.stringify(data);
        // data = JSON.parse(data.toString());
        // console.log(`${typeof data}`)
        // console.log(`${data}`)

        console.log(`This is data from server: ${data._id}`);
        this.router.navigate([
          `/school-registration/${data._id}/${data.email}/${data.name}/${data.surname}/${data.contact}`,
        ]);

        // route to home, once system is done
      });
  }

  addUser() {}

  public openLoginView() {
    console.log('Opening login view');

    if (
      !this.email.value?.length &&
      this.loginButtonStyles.animationName == ''
    ) {
      this.itemsContainerStyles = {
        width: '25%',
        height: '100%',
        backgroundColor: 'cornflowerblue',
        position: 'absolute',
        animationName: 'transformLeft',
        animationDuration: '1s',
        animationFillMode: 'forwards',
      };

      this.loginButtonStyles = {
        animationName: 'buttonSlideDown',
        animationDuration: '0.5s',
        animationFillMode: 'forwards',
        zIndex: '1',
        position: 'absolute',
      };

      this.registerButtonStyles = {
        animationName: 'transformButton',
        animationDuration: '1s',
        animationFillMode: 'forwards',
      };

      this.splashTitleStyles = {
        animationName: 'transformSplashText',
        animationDuration: '0.7s',
        animationFillMode: 'forwards',
      };

      this.formContainerStyles = {
        display: 'block',
        animationName: 'fadeInForm',
        animationDuration: '2s',
        animationFillMode: 'forwards',
      };
    } else if (
      !this.email.value?.length &&
      this.loginButtonStyles.animationName ==
        'buttonSlideDown' /* && (this.snackBarStyle.animationName == "snackbarAnimation" || this.snackBarStyle.animationName == "")*/
    ) {
      // show snackbar here
      this.showSnackBar('Please fill in your Email.');
    } else if (
      !this.password.value?.length &&
      this.loginButtonStyles.animationName ==
        'buttonSlideDown' /* && (this.snackBarStyle.animationName == "snackbarAnimation" || this.snackBarStyle.animationName == "")*/
    ) {
      // show snackbar here
      this.showSnackBar('Please fill in your Password.');
    } else {
      this.submitForm();
    }
  }

  async delay(ms: number) {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), ms)).then(
      () => console.log('Fired!!')
    );
  }

  /*
   *  Function to show password in login form
   * */
  showPassword() {
    console.log('Making password visible');
    this.visible = !this.visible;
  }

  showSnackBar(msg: string) {
    this.snackbarMessage = msg;

    this.snackBarStyle = {
      display: 'inline-block',
      animationName: 'snackbarAnimation',
      animationDuration: '3s',
      animationFillMode: 'forwards',
    };

    this.delay(3000).then(() => {
      this.snackBarStyle = {
        display: 'none',
        animationName: '',
        animationDuration: '',
        animationFillMode: '',
      };
    });
  }

  public closeSnackBar() {
    this.snackBarStyle = {
      display: 'none',
      animationName: '',
      animationDuration: '',
      animationFillMode: '',
    };
  }
}
