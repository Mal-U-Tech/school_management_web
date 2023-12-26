import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './pages/details/details.component';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StudentsEffects } from './store/students.effects';
import { StoreModule } from '@ngrx/store';
import { AddStudentDialogComponent } from './components/add-student-dialog/add-student-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ComponentsModule } from 'src/app/components/components.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';

import routes from './students.routes';
import { key, reducer } from './store/students.reducer';

@NgModule({
  declarations: [DetailsComponent, AddStudentDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    StoreModule.forFeature(key, reducer),
    EffectsModule.forFeature([StudentsEffects]),

    // internal components
    ComponentsModule,

    // material imports
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
  ],
})
export class StudentsModule {}
