import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { SessionStorageService } from './shared/session-state/session-storage.service';
import { AcademicsComponent } from './academics/academics.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavDashboardComponent } from './nav-dashboard/nav-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/splash', pathMatch: 'full' },
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
  {
    path: 'dashboard',
    component: NavDashboardComponent,
    children: [
      { path: 'academics', component: AcademicsComponent },
      { path: 'login', component: LoginComponent },
    ],
  },
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
    AcademicsComponent,
    NavDashboardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  exports: [RouterModule],
  providers: [SessionStorageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
