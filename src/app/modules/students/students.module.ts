import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './pages/details/details.component';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StudentsEffects } from './store/students.effects';
import { StoreModule } from '@ngrx/store';

import routes from './students.routes';
import { key, reducer } from './store/students.reducer';

@NgModule({
  declarations: [DetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    StoreModule.forFeature(key, reducer),
    EffectsModule.forFeature([StudentsEffects]),
  ],
})
export class StudentsModule {}
