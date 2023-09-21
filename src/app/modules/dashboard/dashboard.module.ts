import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { StoreModule } from '@ngrx/store';
import { key, reducer } from './store/dashboard.reducer';

import routes from './dashboard.routes';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    // core imports
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(key, reducer),

    // material imports
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
  ]
})
export class DashboardModule { }
