import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectCurrentSchool } from '../../schools/store/schools.selectors';
import { IUser } from '../../../interfaces/user.interface';
import { ISubject } from '../../../interfaces/subject.interface';
import { ClassState } from './classes.state';
import { key } from './classes.reducer';

const selectClassState = createFeatureSelector<ClassState>(key);

export const selectClassGrades = createSelector(
  selectClassState,
  (state) => state.students
);

const selectClassAPI = createSelector(selectClassState, ({ api }) => api);

export const selectClassAPILoading = createSelector(
  selectClassAPI,
  ({ loading }) => loading
);

export const selectClassAPIError = createSelector(
  selectClassAPI,
  ({ error }) => error
);

export const selectClassAPIComplete = createSelector(
  selectClassAPI,
  ({ complete }) => complete
);

export const selectSchoolClasses = createSelector(
  selectCurrentSchool,
  (school) => {
    if (!school?.classes) {
      return [];
    }

    const students = school.students ?? [];
    const subjects = school.subjects ?? [];
    const users = school.users ?? [];

    return school.classes.map((c) => {
      const copy = { ...c };

      copy.users = c.users?.map((u) => {
        const clone = { ...u };
        clone.subjects = users.find((user) => user.id === u.id)
          ?.subjects as ISubject[];

        return clone;
      });
      copy.subjects = c.subjects?.map((s) => {
        const clone = { ...s };
        clone.teachers = subjects.find((subject) => subject.id === s.id)
          ?.teachers as IUser[];

        return clone;
      });

      copy.students = c.students?.map((s) => {
        const clone = { ...s };

        clone.user = students.find((student) => student.user_id === s.user_id)
          ?.user as IUser;
          return clone;
      });

      return copy;
    })
      .sort((a, b) => (new Date(b.updated_at)).getTime() - (new Date(a.updated_at)).getTime());
  }
);

export const selectCurrentClass = createSelector(
  selectSchoolClasses,
  selectClassState,
  (classes, state) => classes?.find(c => c.id === state.class)
);
