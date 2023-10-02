import { Component } from '@angular/core';
import { selectSchoolClasses } from '../../store/classes.selectors';
import { Store } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import { showClassSubjectWarning } from 'src/app/utilities/class.utilities';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  classes$ = this.store.select(selectSchoolClasses);

  constructor(
    private readonly store: Store
  ) {}

  showsubjectwarning(value: IClass): boolean {
    return showClassSubjectWarning(value);
  }
}
