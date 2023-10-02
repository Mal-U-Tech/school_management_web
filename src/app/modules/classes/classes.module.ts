import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './pages/details/details.component';
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

import routes from './classes.routes';
import { TeachersComponent } from './components/teachers/teachers.component';

@NgModule({
  declarations: [
    DetailsComponent,
    StudentsComponent,
    TeachersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

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
  ]
})
export class ClassesModule { }
