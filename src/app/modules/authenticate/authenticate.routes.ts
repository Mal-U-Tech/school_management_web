import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { SchoolRegistrationComponent } from './components/school-registration/school-registration.component';

export default [
  {
    path: '',
    children: [
      { path: 'registration', component: RegistrationComponent },
      { path: 'login', component: LoginComponent },

      {
        path: 'school-registration',
        component: SchoolRegistrationComponent,
      },
    ],
  },
] as Routes;
