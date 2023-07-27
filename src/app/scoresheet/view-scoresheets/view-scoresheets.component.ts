import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IClassname } from 'src/app/shared/classname/classname.interface';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';
import {
  getScoresheetRequest,
  resetSelectedScoresheet,
  scoresheetIsLoading,
  setSelectedScoresheet,
} from 'src/app/store/scoresheet/scoresheet.action';
import { selectAllScoresheetsSortedByYear } from 'src/app/store/scoresheet/scoresheet.selector';
import { DialogConfirmScoresheetDeleteComponent } from './dialog-confirm-scoresheet-delete/dialog-confirm-scoresheet-delete.component';

export interface SCORESHEET {
  _id: string;
  index: string;
  name: string;
  year: string;
  classes: IClassname[];
}

@Component({
  selector: 'app-view-scoresheets',
  templateUrl: './view-scoresheets.component.html',
  styleUrls: ['./view-scoresheets.component.scss'],
})
export class ViewScoresheetsComponent implements OnInit {
  constructor(
    public service: ScoresheetService,
    public dialog: MatDialog,
    public router: Router,
    private store: Store,
  ) {}

  isLoading = false;
  displayedColumns: string[] = ['index', 'name', 'actions'];
  scoresheets: any[] = [];
  serviceResult: any[] = [];
  sortedScoresheets$ = this.store.select(selectAllScoresheetsSortedByYear);

  dispatchScoresheetIsLoading(state: boolean) {
    this.store.dispatch(scoresheetIsLoading({ isLoading: state }));
  }

  ngOnInit(): void {
    console.log(`Inside init`);
    // reset the data in the selected scoresheet variable
    this.dispatchResetSelectedScoresheet();
  }

  deleteRow(data: any) {
    console.log(data);
  }

  openUpdateScoresheetDialog(scoresheet: SCORESHEET) {
    console.log(scoresheet);
  }

  openDeleteScoresheetDialog(scoresheet: SCORESHEET) {
    console.log(scoresheet);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Confirm scoresheet deletion',
      name: scoresheet.name,
      year: scoresheet.year,
    };

    const dialog = this.dialog.open(
      DialogConfirmScoresheetDeleteComponent,
      dialogConfig,
    );

    const instance = dialog.componentInstance;
    instance.onCloseDialog.subscribe(() => {
      dialog.close();
    });

    instance.onConfirmDelete.subscribe(() => {
      this.deleteRow(scoresheet);
      dialog.close();
    });
  }

  selectScoresheet(selection: any) {
    console.log(selection);

        // assign selected scoresheet
    this.store.dispatch(
      setSelectedScoresheet({ selectedScoresheet: selection }),
    );
    this.router.navigateByUrl('select-class');
  }

  dispatchResetSelectedScoresheet() {
    this.store.dispatch(resetSelectedScoresheet());
  }
}
