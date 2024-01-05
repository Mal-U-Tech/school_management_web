import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentSchoolSubjects } from 'src/app/modules/schools/store/schools.selectors';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  subjects$ = this.store.select(selectCurrentSchoolSubjects);
  constructor(private store : Store){}
}
