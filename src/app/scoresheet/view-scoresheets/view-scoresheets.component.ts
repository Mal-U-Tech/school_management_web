import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';
import { DialogConfirmScoresheetDeleteComponent } from './dialog-confirm-scoresheet-delete/dialog-confirm-scoresheet-delete.component';

interface SCORESHEET {
  _id: string;
  index: string;
  name: string;
  year: string;
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
    public router: Router
  ) {}

  ELEMENT_DATA: SCORESHEET[] = [];
  isLoading = false;
  displayedColumns: string[] = ['index', 'name', 'year', 'actions'];
  dataSource: MatTableDataSource<SCORESHEET> = new MatTableDataSource();
  scoresheets: any[] = [];
  serviceResult: any[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    this.service.getAllScoresheets().subscribe({
      next: (data: any) => {
        console.log(data);
        this.serviceResult = data;

        this.assignScoresheetsToYears();

        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        // this.dataSource.data = [];
        this.isLoading = false;
      },
    });
  }

  assignScoresheetsToYears() {
    this.scoresheets = [];
    let years: string[] = [];

    // first retrieve the year that are in the serviceResult array
    for (let i = 0; i < this.serviceResult.length; i++) {
      let tempYear = '0';
      let item = this.serviceResult[i];

      if (item.year == tempYear) {
        continue;
      } else if (item.year != tempYear) {
        let found = years.find((year) => year === item.year);

        if (found === undefined) {
          tempYear = item.year;
          years.push(item.year);
        }
      }
    }

    years = years.sort((n1, n2) => Number.parseInt(n2) - Number.parseInt(n1));
    years.forEach((year) => {
      const tempSheets: SCORESHEET[] = [];
      let j = 1;
      this.serviceResult.forEach((res) => {
        if (res.year == year.toString()) {
          tempSheets.push({
            _id: res._id,
            index: j.toString(),
            name: res.name,
            year: res.year,
          });

          j++;
        }
      });
      this.scoresheets.push({
        year: year.toString(),
        scoresheets: tempSheets,
      });
    });

    if (!this.scoresheets.length) {
      // handle when scores when there are no scoresheets
      this.scoresheets.push({
        year: new Date().getFullYear().toString(),
        scoresheets: [],
      });
    }
  }

  deleteRow(data: any) {
    console.log(data);
    this.service.deleteScoresheet(data._id).subscribe({
      next: (data: any) => {
        setTimeout(() => {
          this.loadData();
        }, 1000);
      },
      error: (error) => {
        console.log(error);
      },
    });
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
      dialogConfig
    );

    let instance = dialog.componentInstance;
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
    this.service.selectedScoresheetId = selection._id;
    this.service.selectedYear = selection.year;
    this.service.name = selection.name;
    this.router.navigateByUrl('select-class');
  }
}
