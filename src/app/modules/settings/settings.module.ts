import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { GeneralComponent } from './components/general/general.component';
import { MatTabsModule } from '@angular/material/tabs';

import routes from './settings.routes';

@NgModule({
  declarations: [SettingsComponent, GeneralComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    MatTabsModule,
  ]
})
export class SettingsModule {}
