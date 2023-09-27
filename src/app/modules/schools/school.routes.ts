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
      }
    ]
  }
] as Routes;
