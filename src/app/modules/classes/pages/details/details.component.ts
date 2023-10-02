import { Component } from '@angular/core';
import { selectSchoolClasses } from '../../store/classes.selectors';
import { Store } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import { ISubject } from 'src/app/interfaces/subject.interface';

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
    const subjects = value.users?.reduce((a, c) => {
      return [...a, ...(c.subjects ?? [])];
    }, [] as ISubject[]) ?? [];

    const count = (new Set(subjects.map(({ id }) => id))).size;

    return (value.subjects?.length ?? 0) > count;
  }
}
