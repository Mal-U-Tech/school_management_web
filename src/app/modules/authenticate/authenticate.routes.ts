import { Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { LoginComponent } from './pages/login/login.component';
import { SplashComponent } from './pages/splash/splash.component';

export default [
  {
    path: '',
    children: [
      { path: '', component: SplashComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'login', component: LoginComponent },
    ],
  },
] as Routes;
