import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import { EntityType } from 'src/app/interfaces/notification.interface';
import { ISchool } from 'src/app/interfaces/school.interface';
import { IStudent } from 'src/app/interfaces/student.interface';
import {
  selectAppEntityNotifications,
  selectAppLoading,
  selectAppSchools,
  selectAppUser,
} from 'src/app/store/app.selectors';
import { showClassWarning } from 'src/app/utilities/class.utilities';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  user$ = this.store.select(selectAppUser);
  schools$ = this.store.select(selectAppSchools);
  loading$ = this.store.select(selectAppLoading);
  notifications$ = this.store.select(selectAppEntityNotifications(EntityType.school));

  constructor(private readonly store: Store) {}

  showschoolwarning(school: ISchool) {
    return school.classes?.some((c) => this.showclasswarning(c)) ?? false;
  }

  showclasswarning(data: IClass) {
    return showClassWarning(data);
  }

  orderbylastupdated<T extends { updated_at: Date }>(data: T[] | undefined) {
    const copy = data ? [...data] : undefined;

    return copy?.sort((a, b) => {
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });
  }

  getfreestudents(school: ISchool) {
    const studentslist =
      school.classes?.reduce((a, c) => {
        return a.concat(c.students ?? []);
      }, [] as Array<IStudent>) ?? [];

    return (
      (school.students?.length ?? 0) -
      new Set(studentslist.map((s) => s.user_id)).size
    );
  }
}
