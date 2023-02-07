import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { SchoolRegistrationComponent } from './school-registration/school-registration.component';
import { ClassnameComponent } from './classname/classname.component';
import { AddDepartmentsComponent } from './add-departments/add-departments.component';
import { AddSubjectsComponent } from './add-subjects/add-subjects.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavButtonComponent } from './dashboard/nav-button/nav-button.component';
import { LoaderComponent } from './loader/loader.component';
import {
  IgxNavigationDrawerModule,
  IgxIconModule,
  IgxButtonModule,
  IgxRippleModule,
  IgxToggleModule,
} from 'igniteui-angular';
import { MatNavigationComponent } from './mat-navigation/mat-navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

const routes: Routes = [
  { path: '', redirectTo: '/mat-nav', pathMatch: 'full' },
  { path: 'splash', component: SplashScreenComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'school-registration/:id/:email/:name/:surname/:contact',
    component: SchoolRegistrationComponent,
  },
  { path: 'reg-classnames', component: ClassnameComponent },
  { path: 'add-departments', component: AddDepartmentsComponent },
  { path: 'add-subjects', component: AddSubjectsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'mat-nav', component: MatNavigationComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    SplashScreenComponent,
    RegistrationComponent,
    LoginComponent,
    SchoolRegistrationComponent,
    ClassnameComponent,
    AddDepartmentsComponent,
    AddSubjectsComponent,
    DashboardComponent,
    NavButtonComponent,
    LoaderComponent,
    MatNavigationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    IgxNavigationDrawerModule,
    IgxIconModule,
    IgxButtonModule,
    IgxRippleModule,
    IgxToggleModule,
    HammerModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
