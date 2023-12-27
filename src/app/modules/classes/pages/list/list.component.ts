import { Component } from '@angular/core';
import {
  selectSchoolClasses,
} from '../../store/classes.selectors';
import { Store } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import { showClassStudentWarning, showClassSubjectCountWarning, showClassSubjectWarning } from 'src/app/utilities/class.utilities';
import { notificationBannerObserved } from 'src/app/store/app.actions';
import { selectAppEntityNotifications } from 'src/app/store/app.selectors';
import { EntityType, INotification } from 'src/app/interfaces/notification.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
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

  getclassnotifications(notifications: INotification[], data: IClass) {
    return notifications.filter((n) => n.payload.id === data.id);
  }

  observed(notification: INotification) {
    this.store.dispatch(notificationBannerObserved({ notification }))
  }
}
