import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SplashComponent } from './components/splash/splash.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer, key } from './store/authenticate.reducer';
import { AuthenticateEffects } from './store/authenticate.effects';
import { UserService } from './services/user/user.service';

import routes from './authenticate.routes';

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    SplashComponent,
  ],
  imports: [
    // core imports
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(key, reducer),
    EffectsModule.forFeature([AuthenticateEffects]),

    // material imports
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,

    // angular imports
    ReactiveFormsModule,
  ],
  providers: [
    UserService
  ],
})
export class AuthenticateModule { }
