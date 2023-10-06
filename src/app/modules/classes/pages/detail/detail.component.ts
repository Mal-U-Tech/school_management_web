import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCurrentClass } from '../../store/classes.selectors';
import { IClass } from 'src/app/interfaces/class.interface';
import { MatDialog } from '@angular/material/dialog';
import { NameDialogComponent } from '../../components/name-dialog/name-dialog.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  class$ = this.store.select(selectCurrentClass);

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
}
