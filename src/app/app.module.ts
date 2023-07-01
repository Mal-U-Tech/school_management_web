import { NgModule, isDevMode } from '@angular/core';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NavDashboardComponent } from './nav-dashboard/nav-dashboard.component';
import { DashboardCardComponent } from './academics/dashboard-card/dashboard-card.component';
import { ViewStreamsTableComponent } from './classname/view-streams-table/view-streams-table.component';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { DialogConfirmDeleteComponent } from './classname/dialog-confirm-delete/dialog-confirm-delete.component';
import { ViewSubjectsTableComponent } from './add-subjects/view-subjects-table/view-subjects-table.component';
import { DialogConfirmSubjectDeleteComponent } from './add-subjects/dialog-confirm-subject-delete/dialog-confirm-subject-delete.component';
import { ViewDepartmentsTableComponent } from './add-departments/view-departments-table/view-departments-table.component';
import { DialogConfirmDeptDeleteComponent } from './add-departments/dialog-confirm-dept-delete/dialog-confirm-dept-delete.component';
import { TeacherComponent } from './teacher/teacher.component';
import { ViewTeacherTableComponent } from './teacher/view-teacher-table/view-teacher-table.component';
import { DialogConfirmTeacherDeleteComponent } from './teacher/dialog-confirm-teacher-delete/dialog-confirm-teacher-delete.component';
import { ClassStudentsComponent } from './class-students/class-students.component';
import { ViewClassStudentsTableComponent } from './class-students/view-class-students-table/view-class-students-table.component';
import { DialogConfirmClassStudentDeleteComponent } from './class-students/dialog-confirm-class-student-delete/dialog-confirm-class-student-delete.component';
import { SubjectTeacherComponent } from './subject-teacher/subject-teacher.component';
import { ViewSubTeacherTableComponent } from './subject-teacher/view-sub-teacher-table/view-sub-teacher-table.component';
import { DialogConfirmSubTeacherDeleteComponent } from './subject-teacher/dialog-confirm-sub-teacher-delete/dialog-confirm-sub-teacher-delete.component';
import { ClassTeacherComponent } from './class-teacher/class-teacher.component';
import { ViewClassTeacherTableComponent } from './class-teacher/view-class-teacher-table/view-class-teacher-table.component';
import { DialogConfirmClassTeacherDeleteComponent } from './class-teacher/dialog-confirm-class-teacher-delete/dialog-confirm-class-teacher-delete.component';
import { HeadOfDeptsComponent } from './head-of-depts/head-of-depts.component';
import { ViewHodTableComponent } from './head-of-depts/view-hod-table/view-hod-table.component';
import { DialogConfirmHODDeleteComponent } from './head-of-depts/dialog-confirm-hod-delete/dialog-confirm-hod-delete.component';
import { CommitteesComponent } from './committees/committees.component';
import { ConfirmScoresheetModulesCreatedComponent } from './scoresheet/confirm-scoresheet-modules-created/confirm-scoresheet-modules-created.component';
import { DetailsComponent } from './scoresheet/create-scoresheet/details/details.component';
import { ClassesComponent } from './scoresheet/create-scoresheet/classes/classes.component';
import { AddMarksComponent } from './scoresheet/create-scoresheet/add-marks/add-marks.component';
import { CreateScoresheetComponent } from './scoresheet/create-scoresheet/create-scoresheet/create-scoresheet.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AddByExcelComponent } from './class-students/add-by-excel/add-by-excel.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { ViewScoresheetsComponent } from './scoresheet/view-scoresheets/view-scoresheets.component';
import { DialogConfirmScoresheetDeleteComponent } from './scoresheet/view-scoresheets/dialog-confirm-scoresheet-delete/dialog-confirm-scoresheet-delete.component';
import { SelectClassComponent } from './scoresheet/select-class/select-class.component';
import { ClassScoresheetComponent } from './scoresheet/class-scoresheet/class-scoresheet.component';
import { PassControlsComponent } from './pass-controls/pass-controls.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UpdateDialogComponent } from './update-dialog/update-dialog.component';
import { UpdateClassStudentComponent } from './class-students/update-class-student/update-class-student.component';
import { UpdateTeacherComponent } from './teacher/update-teacher/update-teacher.component';
import { UpdateSubjectTeacherComponent } from './subject-teacher/update-subject-teacher/update-subject-teacher.component';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './store/user/user.reducer';
import { schoolInfoReducer } from './store/school-info/school-info.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ClassMarksComponent } from './scoresheet/class-marks/class-marks.component';
import { DeleteDialogComponent } from './scoresheet/class-marks/delete-dialog/delete-dialog.component';
import { AuthEffects } from './store/user/user.effects';
import { SchoolInfoEffects } from './store/school-info/school-info.effects';
import { StreamEffects } from './store/streams/streams.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { streamsReducer } from './store/streams/streams.reducer';
import { departmentsReducer } from './store/departments/departments.reducer';
import { DepartmentEffects } from './store/departments/departments.effects';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SubjectEffects } from './store/subjects/subjects.effects';
import { subjectsReducer } from './store/subjects/subjects.reducer';

const routes: Routes = [
  { path: '', redirectTo: '/splash', pathMatch: 'full' },
  { path: 'splash', component: SplashScreenComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'school-registration',
    component: SchoolRegistrationComponent,
  },
  { path: 'reg-classnames', component: ClassnameComponent },
  { path: 'add-departments', component: AddDepartmentsComponent },
  { path: 'add-subjects', component: AddSubjectsComponent },
  {
    path: 'dashboard',
    component: NavDashboardComponent,
    children: [
      {
        path: 'academics',
        component: AcademicsComponent,
        children: [],
      },
      { path: 'login', component: LoginComponent },
      { path: 'add-streams', component: ClassnameComponent },
      { path: 'view-streams', component: ViewStreamsTableComponent },
      { path: 'add-dialog/:name', component: AddDialogComponent },
      { path: 'view-subjects', component: ViewSubjectsTableComponent },
      { path: 'add-depts', component: AddDepartmentsComponent },
      { path: 'view-depts', component: ViewDepartmentsTableComponent },
      { path: 'add-teachers', component: TeacherComponent },
      { path: 'view-teachers', component: ViewTeacherTableComponent },
      { path: 'add-class-students', component: ClassStudentsComponent },
      {
        path: 'view-class-students',
        component: ViewClassStudentsTableComponent,
      },
      { path: 'add-subject-teacher', component: SubjectTeacherComponent },
      {
        path: 'view-subject-teachers',
        component: ViewSubTeacherTableComponent,
      },
      { path: 'add-class-teacher', component: ClassTeacherComponent },
      {
        path: 'view-class-teachers',
        component: ViewClassTeacherTableComponent,
      },
      { path: 'add-hod', component: HeadOfDeptsComponent },
      { path: 'view-hods', component: ViewHodTableComponent },
    ],
  },
  { path: 'create-scoresheet-steps', component: CreateScoresheetComponent },
  { path: 'add-by-excel', component: AddByExcelComponent },
  { path: 'view-scoresheets', component: ViewScoresheetsComponent },
  { path: 'select-class', component: SelectClassComponent },
  { path: 'add-marks', component: AddMarksComponent },
  { path: 'class-scoresheet', component: ClassScoresheetComponent },
  { path: 'pass-controls', component: PassControlsComponent },
  { path: 'class-marks', component: ClassMarksComponent },
];

// const materialModules = [MatTableModule, MatPaginatorModule, MatSortModule];

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
    DashboardCardComponent,
    ViewStreamsTableComponent,
    AddDialogComponent,
    DialogConfirmDeleteComponent,
    ViewSubjectsTableComponent,
    DialogConfirmSubjectDeleteComponent,
    ViewDepartmentsTableComponent,
    DialogConfirmDeptDeleteComponent,
    TeacherComponent,
    ViewTeacherTableComponent,
    DialogConfirmTeacherDeleteComponent,
    ClassStudentsComponent,
    ViewClassStudentsTableComponent,
    DialogConfirmClassStudentDeleteComponent,
    SubjectTeacherComponent,
    ViewSubTeacherTableComponent,
    DialogConfirmSubTeacherDeleteComponent,
    ClassTeacherComponent,
    ViewClassTeacherTableComponent,
    DialogConfirmClassTeacherDeleteComponent,
    HeadOfDeptsComponent,
    ViewHodTableComponent,
    DialogConfirmHODDeleteComponent,
    CommitteesComponent,
    ConfirmScoresheetModulesCreatedComponent,
    DetailsComponent,
    ClassesComponent,
    AddMarksComponent,
    CreateScoresheetComponent,
    AddByExcelComponent,
    ViewScoresheetsComponent,
    DialogConfirmScoresheetDeleteComponent,
    SelectClassComponent,
    ClassScoresheetComponent,
    PassControlsComponent,
    UpdateDialogComponent,
    UpdateClassStudentComponent,
    UpdateTeacherComponent,
    UpdateSubjectTeacherComponent,
    ClassMarksComponent,
    DeleteDialogComponent,
    SpinnerComponent,
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
    MatProgressBarModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatMenuModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatExpansionModule,
    MatFormFieldModule,
    StoreModule.forRoot({
      auth: authReducer,
      schoolInfo: schoolInfoReducer,
      stream: streamsReducer,
      department: departmentsReducer,
      subject: subjectsReducer,
    }),
    EffectsModule.forRoot([
      AuthEffects,
      SchoolInfoEffects,
      StreamEffects,
      DepartmentEffects,
      SubjectEffects,
    ]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  exports: [RouterModule],
  providers: [SessionStorageService, { provide: MatDialogRef, useValue: {} }],
  bootstrap: [AppComponent],
})
export class AppModule {}
