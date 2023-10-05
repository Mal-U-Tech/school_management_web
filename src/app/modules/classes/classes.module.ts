import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './pages/list/list.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../../components/components.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { StudentsComponent } from './components/students/students.component';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeachersComponent } from './components/teachers/teachers.component';
import { StoreModule } from '@ngrx/store';
import { ClassesEffects } from './store/classes.effects';
import { EffectsModule } from '@ngrx/effects';
import { key, reducer } from './store/classes.reducer';

import routes from './classes.routes';
import { DetailComponent } from './pages/detail/detail.component';

@NgModule({
  declarations: [ListComponent, StudentsComponent, TeachersComponent, DetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(key, reducer),
    EffectsModule.forFeature([ClassesEffects]),

    // material imports
    MatExpansionModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    MatTooltipModule,

    // internal modules
    ComponentsModule,
  ],
})
export class ClassesModule {}
