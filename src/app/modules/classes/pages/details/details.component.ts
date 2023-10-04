import { Component } from '@angular/core';
import {
  selectSchoolClasses,
} from '../../store/classes.selectors';
import { Store } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import { showClassStudentWarning, showClassSubjectCountWarning, showClassSubjectWarning } from 'src/app/utilities/class.utilities';
import { notificationBannerObserved, userClickClassExpandable } from '../../store/classes.actions';
import { selectAppEntityNotifications } from 'src/app/store/app.selectors';
import { EntityType, INotification } from 'src/app/interfaces/notification.interface';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  classes$ = this.store.select(selectSchoolClasses);
  notifications$ = this.store.select(selectAppEntityNotifications(EntityType.class));

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

  getclassnotifications(notifications: INotification[], data: IClass) {
    return notifications.filter((n) => n.payload.id === data.id);
  }

  observed(notification: INotification) {
    this.store.dispatch(notificationBannerObserved({ notification }))
  }
}
