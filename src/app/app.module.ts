import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { AppService } from './services/app.service';
import { AppEffects } from './store/app.effects';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { PermissionService } from './services/permission.service';
import { SchoolService } from './services/school.service';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StudentService } from './services/student.service';
import { NotificationsService } from './services/notifications.service';

import { key, reducer } from './store/app.reducer';
import routes from './app.routes';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    StoreModule.forRoot({
      [key]: reducer,
    }),
    EffectsModule.forRoot([AppEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: isDevMode(),
      features: {
        lock: true,
        persist: true,
      }
    }),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [
    AppService,
    PermissionService,
    SchoolService,
    StudentService,
    NotificationsService,

    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
