import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectClassAPIError,
  selectClassAPILoading,
  selectCurrentClass,
} from '../../store/classes.selectors';
import { IClass } from 'src/app/interfaces/class.interface';
import { ISubject } from 'src/app/interfaces/subject.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { IStudent } from 'src/app/interfaces/student.interface';
import { selectCurrentSchool } from 'src/app/modules/schools/store/schools.selectors';
import { POLICY } from 'src/app/constants/policy.constant';
import { PERMISSIONS } from 'src/app/constants/permissions.constant';
import { selectUserHasPermission } from 'src/app/store/app.selectors';
import {
  ClassDetailPageActions,
  ClassUpdateStudentActions,
  ClassUpdateSubjectActions,
  ClassUpdateTeacherActions,
} from '../../store/classes.actions';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent {
  class$ = this.store.select(selectCurrentClass);
  loading$ = this.store.select(selectClassAPILoading);
  error$ = this.store.select(selectClassAPIError);
  school$ = this.store.select(selectCurrentSchool);

  add_student_permission$ = this.store.select(
    selectUserHasPermission(PERMISSIONS.school, POLICY.update)
  );

  subject_columns = ['options', 'name', 'remove'];
  teacher_columns = ['options', 'name', 'contact', 'remove'];
  student_columns = ['avatar', 'name', 'contact', 'remove'];

  constructor(private readonly store: Store) {}

  getsubjecttooltip(value: IClass, subject: ISubject) {
    return `Remove ${subject.name} from ${value.name}`;
  }

  getteachertooltip(value: IClass, teacher: IUser) {
    return `Remove ${teacher.firstname} ${teacher.lastname} from ${value.name}`;
  }

  getstudenttooltip(value: IClass, student: IStudent) {
    return `Remove ${student.user?.firstname} ${student.user?.lastname} from ${value.name}`;
  }

  changename() {
    this.store.dispatch(ClassDetailPageActions.changename());
  }

  addstudents() {
    this.store.dispatch(ClassDetailPageActions.addstudent());
  }

  updatesubjects() {
    this.store.dispatch(ClassUpdateSubjectActions.update());
  }

  updateteachers() {
    this.store.dispatch(ClassUpdateTeacherActions.update());
  }

  updatestudents() {
    this.store.dispatch(ClassUpdateStudentActions.update());
  }

  removesubject(subject: ISubject) {
    this.store.dispatch(ClassUpdateSubjectActions.remove({ subject }));
  }

  removeteacher(teacher: IUser) {
    this.store.dispatch(ClassUpdateTeacherActions.remove({ teacher }));
  }

  removestudent(student: IStudent) {
    this.store.dispatch(ClassUpdateStudentActions.remove({ student }));
  }
}
