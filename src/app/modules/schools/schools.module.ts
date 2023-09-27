import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OverviewComponent } from './pages/overview/overview.component';
import { MatTabsModule } from '@angular/material/tabs';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SchoolsEffects } from './store/schools.effects';
import { key, reducer } from './store/schools.reducer';

import routes from './school.routes';

@NgModule({
  declarations: [
    OverviewComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(key, reducer),
    EffectsModule.forFeature([SchoolsEffects]),

    // material imports
    MatTabsModule,
  ]
})
export class SchoolsModule { }
