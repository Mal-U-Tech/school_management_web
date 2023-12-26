import { Component } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectCurrentSchool } from 'src/app/modules/schools/store/schools.selectors';
import { StudentListPageActions, showAddStudentDialog } from '../../store/students.actions';
import { debounceTime, map } from 'rxjs';
import { selectStudentApi, selectStudents } from '../../store/students.selectors';
import { PERMISSIONS } from 'src/app/constants/permissions.constant';
import { POLICY } from 'src/app/constants/policy.constant';
import { selectUserHasPermission } from 'src/app/store/app.selectors';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {
  school$ = this.store.select(selectCurrentSchool);
  students$ = this.store.select(selectStudents);
  api$ = this.store.select(selectStudentApi);
  add_student_permission$ = this.store.select(selectUserHasPermission(PERMISSIONS.school, POLICY.update));

  form = this.builder.group({
    search: ['']
  });
  columns = ['avatar', 'name', 'contact'];

  // internal observables
  search$ = this.form.controls.search.valueChanges.pipe(
    debounceTime(1000),
    map((search) => this.store.dispatch(StudentListPageActions.search({ search })))
  );

  constructor(
    private readonly store: Store,
    private readonly builder: NonNullableFormBuilder,
  ) {}

  addstudents() {
    this.store.dispatch(showAddStudentDialog());
  }
}
