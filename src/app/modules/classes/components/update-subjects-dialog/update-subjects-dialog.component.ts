import { AfterViewChecked, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { IClass } from 'src/app/interfaces/class.interface';
import { selectClassAPIComplete, selectClassAPIError, selectClassAPILoading } from '../../store/classes.selectors';
import { asapScheduler } from 'rxjs';
import { updateSubjectsDialogClose, userClickUpdateSubjectsSave } from '../../store/classes.actions';
import { selectCurrentSchoolSubjects } from 'src/app/modules/schools/store/schools.selectors';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ISubject } from 'src/app/interfaces/subject.interface';

@Component({
  selector: 'app-update-subjects-dialog',
  templateUrl: './update-subjects-dialog.component.html',
  styleUrls: ['./update-subjects-dialog.component.scss']
})
export class UpdateSubjectsDialogComponent implements AfterViewChecked {
  error$ = this.store.select(selectClassAPIError);
  loading$ = this.store.select(selectClassAPILoading);
  complete$ = this.store.select(selectClassAPIComplete);
  // data selection
  subjects$ = this.store.select(selectCurrentSchoolSubjects);

  form = this.builder.group({
    id: [this.data.id],
    subjects: [this.data.subjects?.map(({ id }) => id) ?? [], [Validators.required, Validators.minLength(1)]],
  })

  constructor(
    private readonly dialogref: MatDialogRef<UpdateSubjectsDialogComponent>,
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef,
    private readonly builder: NonNullableFormBuilder,

    @Inject(MAT_DIALOG_DATA) protected readonly data: IClass,
  ) {}

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  close() {
    asapScheduler.schedule(() => this.store.dispatch(updateSubjectsDialogClose()));
    this.dialogref.close();
  }

  submit() {
    const data = this.form.value;

    this.store.dispatch(userClickUpdateSubjectsSave({
      id: data.id as string,
      subjects: data.subjects as string[]
    }));
  }

  getsubject(id: string, subjects: ISubject[]) {
    return subjects.find(s => s.id === id)!;
  }

  removesubject(subject: string) {
    const subjects = this.form.controls.subjects.value.filter(v => v !== subject);

    this.form.controls.subjects.setValue(subjects);
  }
}
