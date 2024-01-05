import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './pages/details/details.component';
import { RouterModule } from '@angular/router';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import routes from './subjects.routes';

@NgModule({
  declarations: [
    DetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),


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
    MatProgressSpinnerModule,
  ],
})
export class SubjectsModule { }
