import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentClass } from '../../store/classes.selectors';
import { IClass } from 'src/app/interfaces/class.interface';
import { MatDialog } from '@angular/material/dialog';
import { NameDialogComponent } from '../../components/name-dialog/name-dialog.component';
import { ISubject } from 'src/app/interfaces/subject.interface';
import { RemoveSubjectDialogComponent } from '../../components/remove-subject-dialog/remove-subject-dialog.component';
import { UpdateSubjectsDialogComponent } from '../../components/update-subjects-dialog/update-subjects-dialog.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  class$ = this.store.select(selectCurrentClass);

  subject_columns = ['options', 'name', 'remove']

  constructor(
    private readonly store: Store,

    private readonly dialog: MatDialog
  ) {}

  changename(value: IClass) {
    this.dialog.open(NameDialogComponent, {
      data: value,
      width: '440px'
    })
  }

  gettooltip(value: IClass, subject: ISubject) {
    return `Remove ${subject.name} from ${value.name}`
  }

  updatesubjects(value: IClass) {
    this.dialog.open(UpdateSubjectsDialogComponent, {
      data: value,
      width: '440px'
    })
  }

  remove(value:IClass, subject: ISubject) {
    this.dialog.open(RemoveSubjectDialogComponent, {
      data: {
        class: value,
        subject,
      },
      width: '440px'
    })
  }
}
