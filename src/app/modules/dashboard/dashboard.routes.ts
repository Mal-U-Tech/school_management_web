import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export default [
  {
    path: '',
    component: DashboardComponent,
    children: [],
  },
] as Routes;
