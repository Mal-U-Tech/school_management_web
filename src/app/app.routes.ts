import { Routes } from '@angular/router';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { SchoolRegistrationComponent } from './school-registration/school-registration.component';
import { ClassnameComponent } from './classname/classname.component';
import { AddDepartmentsComponent } from './add-departments/add-departments.component';
import { AddSubjectsComponent } from './add-subjects/add-subjects.component';
import { NavDashboardComponent } from './nav-dashboard/nav-dashboard.component';
import { AcademicsComponent } from './academics/academics.component';
import { ViewStreamsTableComponent } from './classname/view-streams-table/view-streams-table.component';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { ViewSubjectsTableComponent } from './add-subjects/view-subjects-table/view-subjects-table.component';
import { ViewDepartmentsTableComponent } from './add-departments/view-departments-table/view-departments-table.component';
import { TeacherComponent } from './teacher/teacher.component';
import { ViewTeacherTableComponent } from './teacher/view-teacher-table/view-teacher-table.component';
import { ClassStudentsComponent } from './class-students/class-students.component';
import { ViewClassStudentsTableComponent } from './class-students/view-class-students-table/view-class-students-table.component';
import { SubjectTeacherComponent } from './subject-teacher/subject-teacher.component';
import { ViewSubTeacherTableComponent } from './subject-teacher/view-sub-teacher-table/view-sub-teacher-table.component';
import { ClassTeacherComponent } from './class-teacher/class-teacher.component';
import { ViewClassTeacherTableComponent } from './class-teacher/view-class-teacher-table/view-class-teacher-table.component';
import { HeadOfDeptsComponent } from './head-of-depts/head-of-depts.component';
import { ViewHodTableComponent } from './head-of-depts/view-hod-table/view-hod-table.component';
import { CreateScoresheetComponent } from './scoresheet/create-scoresheet/create-scoresheet/create-scoresheet.component';
import { AddByExcelComponent } from './class-students/add-by-excel/add-by-excel.component';
import { ViewScoresheetsComponent } from './scoresheet/view-scoresheets/view-scoresheets.component';
import { SelectClassComponent } from './scoresheet/select-class/select-class.component';
import { AddMarksComponent } from './scoresheet/create-scoresheet/add-marks/add-marks.component';
import { ClassScoresheetComponent } from './scoresheet/class-scoresheet/class-scoresheet.component';
import { PassControlsComponent } from './pass-controls/pass-controls.component';
import { ClassMarksComponent } from './scoresheet/class-marks/class-marks.component';
import { ViewReportsComponent } from './pages/view-reports/view-reports.component';
import { GenerateReportsComponent } from './pages/generate-reports/generate-reports.component';
import { ViewClassesConductComponent } from './pages/view-classes-conduct/view-classes-conduct.component';
import { AddClassConductComponent } from './pages/add-class-conduct/add-class-conduct.component';

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
  { path: 'view-reports', component: ViewReportsComponent },
  { path: 'generate-reports', component: GenerateReportsComponent },
  { path: 'view-attendance-conduct', component: ViewClassesConductComponent },
  { path: 'add-attendance-conduct', component: AddClassConductComponent },
];

export default routes;
