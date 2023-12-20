import { Component } from '@angular/core';
import { SETTINGS_TABS } from '../../constants/tabs.constant';
import { Store } from '@ngrx/store';
import { selectSchoolCurrentTab } from 'src/app/modules/schools/store/schools.selectors';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  active$ = this.store.select(selectSchoolCurrentTab);

  tabs = SETTINGS_TABS;

  constructor(
    private readonly store: Store
  ) {}
}
