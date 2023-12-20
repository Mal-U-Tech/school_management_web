import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentSchool, selectSchoolCurrentTab } from '../../store/schools.selectors';
import { SCHOOL_TABS as SCHOOL_TABS } from '../../constants/tabs.constant';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  active$ = this.store.select(selectSchoolCurrentTab);
  school$ = this.store.select(selectCurrentSchool);

  tabs = SCHOOL_TABS;

  constructor(
    private readonly store: Store
  ) {}
}
