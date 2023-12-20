import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import {
  selectClassAPIComplete,
  selectClassAPIError,
  selectClassAPILoading,
} from '../../store/classes.selectors';
import { selectCurrentSchoolStudents } from 'src/app/modules/schools/store/schools.selectors';
import { IStudent } from 'src/app/interfaces/student.interface';
import { asapScheduler } from 'rxjs';
import {
  updateStudentsDialogClose,
  userClickUpdateStudentsSave,
} from '../../store/classes.actions';

@Component({
  selector: 'app-update-students-dialog',
  templateUrl: './update-students-dialog.component.html',
  styleUrls: ['./update-students-dialog.component.scss'],
})
export class UpdateStudentsDialogComponent implements AfterViewInit {
  error$ = this.store.select(selectClassAPIError);
  loading$ = this.store.select(selectClassAPILoading);
  complete$ = this.store.select(selectClassAPIComplete);
  // data selection
  students$ = this.store.select(selectCurrentSchoolStudents);

  form = this.builder.group({
    id: [this.data.id],
    students: [
      this.data.subjects?.map(({ id }) => id) ?? [],
      [Validators.required, Validators.minLength(1)],
    ],
  });

  constructor(
    private readonly dialogref: MatDialogRef<UpdateStudentsDialogComponent>,
    private readonly builder: NonNullableFormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly store: Store,

    @Inject(MAT_DIALOG_DATA) protected readonly data: IClass
  ) {}

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  close() {
    asapScheduler.schedule(() =>
      this.store.dispatch(updateStudentsDialogClose())
    );
    this.dialogref.close();
  }

  submit() {
    const data = this.form.value;

    this.store.dispatch(
      userClickUpdateStudentsSave({
        id: data.id as string,
        students: data.students as string[],
      })
    );
  }

  getstudent(id: string, subjects: IStudent[]) {
    return subjects.find((s) => s.user_id === id)!;
  }

  removestudent(subject: string) {
    const subjects = this.form.controls.students.value.filter(
      (v) => v !== subject
    );

    this.form.controls.students.setValue(subjects);
  }
}
