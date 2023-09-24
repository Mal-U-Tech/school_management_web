import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OverviewComponent } from './pages/overview/overview.component';

export default [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: OverviewComponent,
      },
      {
        path: ':id',
        loadChildren: () =>
          import('../schools/schools.module').then((m) => m.SchoolsModule),
      },
    ],
  },
] as Routes;
