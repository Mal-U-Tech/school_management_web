import { AfterViewChecked, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import { ISubject } from 'src/app/interfaces/subject.interface';
import { selectClassAPIComplete, selectClassAPIError, selectClassAPILoading } from '../../store/classes.selectors';
import { asapScheduler } from 'rxjs';
import { removeSubjectDialogClose, userClickRemoveClassSubject } from '../../store/classes.actions';

@Component({
  selector: 'app-remove-subject-dialog',
  templateUrl: './remove-subject-dialog.component.html',
  styleUrls: ['./remove-subject-dialog.component.scss'],
})
export class RemoveSubjectDialogComponent implements AfterViewChecked {
  error$ = this.store.select(selectClassAPIError);
  loading$ = this.store.select(selectClassAPILoading);
  complete$ = this.store.select(selectClassAPIComplete);

  constructor(
    private readonly store: Store,
    private readonly dialogref: MatDialogRef<RemoveSubjectDialogComponent>,
    private readonly cdr: ChangeDetectorRef,

    @Inject(MAT_DIALOG_DATA)
    protected readonly data: {
      subject: ISubject;
      class: IClass;
    }
  ) {}

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  submit() {
    this.store.dispatch(userClickRemoveClassSubject({ class: this.data.class, subject: this.data.subject.id }));
  }

  close() {
    asapScheduler.schedule(() => this.store.dispatch(removeSubjectDialogClose()));
    this.dialogref.close();
  }
}
