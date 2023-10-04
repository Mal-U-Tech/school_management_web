import { createFeatureSelector, createSelector } from '@ngrx/store';
import { key } from './app.reducer';
import { AppState } from './app.state';
import { EntityType, INotification } from '../interfaces/notification.interface';
import { ISchool } from '../interfaces/school.interface';
import { IClass } from '../interfaces/class.interface';
import { ISubject } from '../interfaces/subject.interface';

const selectAppState = createFeatureSelector<AppState>(key);

export const selectAppUser = createSelector(
  selectAppState,
  (state) => state.user
);

export const selectAppPermissions = createSelector(
  selectAppState,
  (state) => state.permissions
);

export const selectAppSchools = createSelector(
  selectAppState,
  (state) => state.schools
);

export const selectAppLoading = createSelector(
  selectAppState,
  (state) => state.loading,
);

const selectAppNotifications = createSelector(
  selectAppState,
  (state) => state.notifications
);

export const selectAppEntityNotifications = (entity: EntityType) => createSelector(
  selectAppNotifications,
  (notifications) => notifications
    .filter((n) => n.entity === entity)
    .map(n => {
      switch(entity) {
        case EntityType.school:
          return n as INotification<ISchool>;
        case EntityType.class:
          return n as INotification<IClass>;
        case EntityType.subject:
          return n as INotification<ISubject>;
        default:
          return n;
      }
    })
);
