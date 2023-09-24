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
}
