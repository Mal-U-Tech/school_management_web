import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionStorageService } from '../shared/session-state/session-storage.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.sass'],
})
export class SplashScreenComponent implements OnInit {
  constructor(
    private readonly sessionStorage: SessionStorageService,
    private router: Router
  ) {}

  public snackbarMessage = 'This is a snackbar message';

  /*
   * Style definitions
   * */
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

  public snackBarStyle = {
    display: 'none',
    animationName: '',
    animationDuration: '',
    animationFillMode: '',
  };

  async delay(ms: number) {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), ms)).then(
      () => console.log('Fired!!')
    );
  }

  public clearSnackBarAnimation() {
    this.snackBarStyle = {
      display: 'none',
      animationName: '',
      animationDuration: '',
      animationFillMode: '',
    };
  }

  public doNothing() {}

  public submitForm() {
    console.log(
      `Submitting form! \nEmail: ${this.email.value} \nPassword: ${this.password.value}`
    );
  }

  /*
   *  Form control variable : Reactive Forms
   * */
  public email = new FormControl('');
  public password = new FormControl('');
  public visible = true;

  ngOnInit(): void {
    // checking if user has logged in
    if (this.sessionStorage.get('name')) {
      // the user has logged in
      // navigate to dashboard
      this.router.navigate(['/dashboard']);
    }
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
