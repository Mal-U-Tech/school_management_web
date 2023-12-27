import { AfterViewChecked, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { selectClassAPIComplete, selectClassAPIError, selectClassAPILoading } from '../../store/classes.selectors';
import { ClassUpdateTeacherActions } from '../../store/classes.actions';

@Component({
  selector: 'app-remove-teacher-dialog',
  templateUrl: './remove-teacher-dialog.component.html',
  styleUrls: ['./remove-teacher-dialog.component.scss']
})
export class RemoveTeacherDialogComponent implements AfterViewChecked {
  error$ = this.store.select(selectClassAPIError);
  loading$ = this.store.select(selectClassAPILoading);
  complete$ = this.store.select(selectClassAPIComplete);

  constructor(
    private readonly store: Store,
    private readonly dialogref: MatDialogRef<RemoveTeacherDialogComponent>,
    private readonly cdr: ChangeDetectorRef,

    @Inject(MAT_DIALOG_DATA)
    protected readonly data: {
      teacher: IUser;
      class: IClass;
    }
  ) {}

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  submit() {
    this.store.dispatch(ClassUpdateTeacherActions.submit({ class: this.data.class, teacher: this.data.teacher.id }));
  }

  close() {
    this.dialogref.close();
  }
}
