import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OverviewComponent } from './pages/overview/overview.component';
import { MatTabsModule } from '@angular/material/tabs';

import routes from './school.routes';

@NgModule({
  declarations: [
    OverviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    // material imports
    MatTabsModule,
  ]
})
export class SchoolsModule { }
