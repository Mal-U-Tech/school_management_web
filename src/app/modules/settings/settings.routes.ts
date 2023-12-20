import { Routes } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { GeneralComponent } from './components/general/general.component';

export default [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        component: GeneralComponent,
      }
    ]
  },
] as Routes;
