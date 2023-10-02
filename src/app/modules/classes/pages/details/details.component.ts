import { Component } from '@angular/core';
import {
  selectSchoolClasses,
} from '../../store/classes.selectors';
import { Store } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import { showClassStudentWarning, showClassSubjectCountWarning, showClassSubjectWarning } from 'src/app/utilities/class.utilities';
import { userClickClassExpandable } from '../../store/classes.actions';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  classes$ = this.store.select(selectSchoolClasses);

  constructor(private readonly store: Store) {}

  showsubjectcountwarning(value: IClass): boolean {
    return showClassSubjectCountWarning(value);
  }

  showsubjectwarning(value: IClass): boolean {
    return showClassSubjectWarning(value);
  }

  showstudentwarning(value: IClass): boolean {
    return showClassStudentWarning(value);
  }

  opened(value: IClass) {
    this.store.dispatch(userClickClassExpandable({ class: value }));
  }
}
