import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { InviteType, UserInviteDTO } from 'src/app/dtos/invite.dto';
import { ISchool } from 'src/app/interfaces/school.interface';
import { selectCurrentSchool } from 'src/app/modules/schools/store/schools.selectors';
import { selectStudentApi } from '../../store/students.selectors';
import { AddStudentActions } from '../../store/students.actions';

@Component({
  selector: 'app-add-student-dialog',
  templateUrl: './add-student-dialog.component.html',
  styleUrl: './add-student-dialog.component.scss',
})
export class AddStudentDialogComponent {
  school$ = this.store.select(selectCurrentSchool);
  api$ = this.store.select(selectStudentApi);

  form = this.builder.array<UserInviteDTO>([]);

  constructor(
    private readonly store: Store,
    private readonly builder: NonNullableFormBuilder,

    private readonly dialog: MatDialogRef<AddStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) protected readonly data: ISchool,
  ) {
    this.add();
  }

  submit(school: ISchool) {
    this.store.dispatch(AddStudentActions.submit({
      invite: {
        entity: school.id,
        type: InviteType.student,
        users: this.form.getRawValue(),
      }
    }))
  }

  close() {
    this.dialog.close();
  }

  add() {
    const student_form = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      mobile: [''],
      firstname: [''],
      lastname: ['']
    }) as AbstractControl<UserInviteDTO>;

    this.form.push(student_form as FormControl<UserInviteDTO>);
  }

  remove(index: number) {
    this.form.removeAt(index);
  }

  getemail(item: FormControl<UserInviteDTO>) {
    return (item as unknown as FormGroup).controls['email'];
  }
}
