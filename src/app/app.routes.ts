import { Routes } from '@angular/router';

import { UserGuardFn } from './guards/user.guard';
import { DashboardGuardFn } from './guards/dashboard.guard';

export default [
  // the dashboard module should be first so the internal guard behavior can trigger
  {
    path: 'dashboard',
    canMatch: [UserGuardFn],
    loadChildren: () => import(
      './modules/dashboard/dashboard.module'
    ).then(m => m.DashboardModule)
  },
  {
    path: '',
    canMatch: [DashboardGuardFn],
    loadChildren: () => import(
      './modules/authenticate/authenticate.module'
    ).then(m => m.AuthenticateModule)
  },
] as Routes

