import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { StoreModule } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToolbarService } from './services/toolbar.service';
import { DrawerComponent } from './components/drawer/drawer.component';
import { SectionComponent } from './components/section/section.component';
import { MatRippleModule } from '@angular/material/core';
import { OverviewComponent } from './pages/overview/overview.component';
import { TitleComponent } from './components/title/title.component';
import { ContentComponent } from './components/content/content.component';
import { ComponentsModule } from '../../components/components.module';
import { key, reducer } from './store/dashboard.reducer';

import routes from './dashboard.routes';
import { EffectsModule } from '@ngrx/effects';
import { DashboardEffects } from './store/dashboard.effects';

@NgModule({
  declarations: [
    DashboardComponent,
    ToolbarComponent,
    DrawerComponent,
    SectionComponent,
    OverviewComponent,
    TitleComponent,
    ContentComponent,
  ],
  imports: [
    // core imports
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(key, reducer),
    EffectsModule.forFeature([DashboardEffects]),

    // material imports
    MatSidenavModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatRippleModule,
    MatChipsModule,

    // internal imports
    ComponentsModule,
  ],
  providers: [
    ToolbarService
  ]
})
export class DashboardModule { }
