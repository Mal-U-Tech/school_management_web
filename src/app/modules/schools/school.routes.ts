import { Routes } from '@angular/router';
import { OverviewComponent } from './pages/overview/overview.component';

export default [
  {
    path: '',
    component: OverviewComponent,
    children: [
      {
        path: 'classes',
        loadChildren: () => import(
          '../classes/classes.module'
        ).then((m) => m.ClassesModule)
      },
      {
        path: 'subjects',
        loadChildren: () => import(
          '../subjects/subjects.module'
        ).then((m) => m.SubjectsModule)
      },
      {
        path: 'students',
        loadChildren: () => import(
          '../students/students.module'
        ).then((m) => m.StudentsModule)
      },
      {
        path: 'staff',
        loadChildren: () => import(
          '../staff/staff.module'
        ).then((m) => m.StaffModule)
      }
    ]
  }
] as Routes;
