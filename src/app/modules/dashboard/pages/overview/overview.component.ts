import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import { selectAppLoading, selectAppSchools, selectAppUser } from 'src/app/store/app.selectors';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  user$ = this.store.select(selectAppUser);
  schools$ = this.store.select(selectAppSchools);

  loading$ = this.store.select(selectAppLoading);

  constructor(
    private readonly store: Store,
  ) {}

  showclasswarning(data: IClass) {
    return (data.subjects?.length ?? 0) < 2 || (data.users?.length ?? 0) < 2
  }

  orderbylastupdated<T extends { updated_at: Date }>(data: T[] | undefined) {
    const copy = data ? [...data] : undefined;

    return copy?.sort((a, b) => {
      return (new Date(b.updated_at)).getTime() - (new Date(a.updated_at)).getTime();
    })
  }
}
