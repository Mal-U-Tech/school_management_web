import { AfterViewChecked, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { selectClassAPIComplete, selectClassAPIError, selectClassAPILoading } from '../../store/classes.selectors';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IClass } from 'src/app/interfaces/class.interface';
import { asapScheduler } from 'rxjs';
import { updateTeachersDialogClose, userClickUpdateTeachersSave } from '../../store/classes.actions';
import { selectCurrentSchoolUsers } from 'src/app/modules/schools/store/schools.selectors';
import { IUser } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-update-teachers-dialog',
  templateUrl: './update-teachers-dialog.component.html',
  styleUrls: ['./update-teachers-dialog.component.scss']
})
export class UpdateTeachersDialogComponent implements AfterViewChecked {
  error$ = this.store.select(selectClassAPIError);
  loading$ = this.store.select(selectClassAPILoading);
  complete$ = this.store.select(selectClassAPIComplete);
  // data selection
  users$ = this.store.select(selectCurrentSchoolUsers);

  form = this.builder.group({
    id: [this.data.id],
    users: [this.data.users?.map(({ id }) => id) ?? [], [Validators.required, Validators.minLength(1)]],
  })

  constructor(
    private readonly dialogref: MatDialogRef<UpdateTeachersDialogComponent>,
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef,
    private readonly builder: NonNullableFormBuilder,

    @Inject(MAT_DIALOG_DATA) protected readonly data: IClass,
  ) {}

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  close() {
    asapScheduler.schedule(() => this.store.dispatch(updateTeachersDialogClose()));
    this.dialogref.close();
  }

  submit() {
    const data = this.form.value as { id: string; users: string[] };

    this.store.dispatch(userClickUpdateTeachersSave(data));
  }

  getuser(item: string, users: IUser[]) {
    return users.find(i => i.id === item)!;
  }

  removeuser(user: string) {
    const users = this.form.controls.users.value.filter(v => v !== user);

    this.form.controls.users.setValue(users);
  }
}
