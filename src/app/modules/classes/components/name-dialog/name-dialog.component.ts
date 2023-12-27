import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IClass } from 'src/app/interfaces/class.interface';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  selectClassAPIComplete,
  selectClassAPIError,
  selectClassAPILoading,
} from '../../store/classes.selectors';
import { ClassNameChangeActions } from '../../store/classes.actions';

@Component({
  selector: 'app-name-dialog',
  templateUrl: './name-dialog.component.html',
  styleUrls: ['./name-dialog.component.scss'],
})
export class NameDialogComponent implements AfterViewChecked {
  form = this.builder.group({
    name: [this.data.name, [Validators.required]],
  });

  loading$ = this.store.select(selectClassAPILoading);
  error$ = this.store.select(selectClassAPIError);
  complete$ = this.store.select(selectClassAPIComplete);

  constructor(
    private readonly dialogref: MatDialogRef<NameDialogComponent>,
    private readonly builder: NonNullableFormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly store: Store,

    @Inject(MAT_DIALOG_DATA) private readonly data: IClass
  ) {}

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  close() {
    this.dialogref.close();
  }

  submit() {
    this.store.dispatch(
      ClassNameChangeActions.submit({
        id: this.data.id,
        ...this.form.getRawValue(),
      })
    );
  }
}
