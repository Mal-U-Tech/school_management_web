import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentSchool } from 'src/app/modules/schools/store/schools.selectors';

@Component({
  selector: 'app-add-student-dialog',
  templateUrl: './add-student-dialog.component.html',
  styleUrl: './add-student-dialog.component.scss',
})
export class AddStudentDialogComponent {
  school$ = this.store.select(selectCurrentSchool);

  constructor(private readonly store: Store) {}
}
