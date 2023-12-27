import { AfterViewChecked, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import { selectClassAPIComplete, selectClassAPIError, selectClassAPILoading } from '../../store/classes.selectors';
import { ClassUpdateStudentActions } from '../../store/classes.actions';
import { IStudent } from 'src/app/interfaces/student.interface';

@Component({
  selector: 'app-remove-student-dialog',
  templateUrl: './remove-student-dialog.component.html',
  styleUrls: ['./remove-student-dialog.component.scss']
})
export class RemoveStudentDialogComponent implements AfterViewChecked {
  error$ = this.store.select(selectClassAPIError);
  loading$ = this.store.select(selectClassAPILoading);
  complete$ = this.store.select(selectClassAPIComplete);

  constructor(
    private readonly store: Store,
    private readonly dialogref: MatDialogRef<RemoveStudentDialogComponent>,
    private readonly cdr: ChangeDetectorRef,

    @Inject(MAT_DIALOG_DATA)
    protected readonly data: {
      student: IStudent;
      class: IClass;
    }
  ) {}

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  submit() {
    this.store.dispatch(ClassUpdateStudentActions.submit({ class: this.data.class, student: this.data.student.user_id }));
  }

  close() {
    this.dialogref.close();
  }
}
