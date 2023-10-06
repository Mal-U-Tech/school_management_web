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
import { DetailComponent } from './pages/detail/detail.component';
import { MatMenuModule } from '@angular/material/menu';
import { NameDialogComponent } from './components/name-dialog/name-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClassService } from './services/class.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { key, reducer } from './store/classes.reducer';
import routes from './classes.routes';

@NgModule({
  declarations: [ListComponent, StudentsComponent, TeachersComponent, DetailComponent, NameDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,

    // internal modules
    ComponentsModule,
  ],
  providers: [
    ClassService
  ]
})
export class ClassesModule {}
