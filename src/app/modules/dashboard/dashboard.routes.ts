import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export default [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: ':id',
        loadChildren: () => import(
          '../schools/schools.module'
        ).then((m) => m.SchoolsModule),
      }
    ],
  },
] as Routes;
