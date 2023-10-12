import { AfterViewChecked, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { selectClassAPIComplete, selectClassAPIError, selectClassAPILoading } from '../../store/classes.selectors';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IClass } from 'src/app/interfaces/class.interface';
import { asapScheduler } from 'rxjs';
import { updateTeachersDialogClose } from '../../store/classes.actions';

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

  form = this.builder.group({
    id: [this.data.id],
    teachers: [this.data.users?.map(({ id }) => id) ?? [], [Validators.required, Validators.minLength(1)]],
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
    const data = this.form.value;
  }
}
