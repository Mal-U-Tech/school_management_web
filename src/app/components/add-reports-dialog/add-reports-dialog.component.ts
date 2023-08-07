import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, takeWhile } from 'rxjs';
import { IClassname } from 'src/app/shared/classname/classname.interface';
import {
  IReports,
  IReportsCriteria,
} from 'src/app/shared/reports/reports.interface';
import { IScoresheet } from 'src/app/shared/scoresheet/scoresheet.interface';
import { postReportRequest } from 'src/app/store/reports/reports.actions';
import { selectScoresheetsArray } from 'src/app/store/scoresheet/scoresheet.selector';
// import { selectScoresheetsByYear } from 'src/app/store/scoresheet/scoresheet.selector';
import { selectStreamsArray } from 'src/app/store/streams/streams.selector';
import { selectSubjectsArray } from 'src/app/store/subjects/subjects.selector';

@Component({
  selector: 'app-add-reports-dialog',
  templateUrl: './add-reports-dialog.component.html',
  styleUrls: ['./add-reports-dialog.component.scss'],
})
export class AddReportsDialogComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store,
    private _formBuilder: FormBuilder,
  ) {}

  public reportName = new FormControl<string>('', [Validators.required]);
  public year = new FormControl<string>('', [Validators.required]);
  public process_progress = 50;
  public selectedClasses = null as any;
  public alive = true;
  public selectAllClasses = false;

  public initialScoresheetSelection = {
    name: 'Select Scoresheet',
    year: '',
  };

  public initialClassSelection = {
    name: '',
  };

  public scoresheetSelection: any = this.initialScoresheetSelection;
  // public selectedClasses: any = this.initialClassSelection;

  public reportsCriteria: IReportsCriteria = {
    scoresheets: Array<IScoresheet>(),
    classes: Array<IClassname>(),
    percentages: Array<number>(),
  };
  public percentages: string[][] = [[]];
  public reportInfo: IReports = {
    name: '',
    year: '',
    criteria: [],
  };

  public onClose = new EventEmitter();
  public onFinish = new EventEmitter();

  // ngrx variables
  classes$ = this.store.select(selectStreamsArray);
  allScoresheets$ = this.store.select(selectScoresheetsArray);

  // ng styles
  dataStyles = {
    animationName: '',
    animationDuration: '',
    animationFillMode: '',
  };

  ngOnInit(): void {
    this.resetSelectedClassesBoolean();
    console.log(
      `This is the initial progress value = ${this.process_progress}`,
    );
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  resetSelectedClassesBoolean() {
    this.classes$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IClassname[]) => {
        if (data?.length) {
          this.selectedClasses = Array(data.length).fill(false);
        }
      },
    });
  }

  onCloseClicked() {
    this.onClose.emit();
  }

  onFinishClicked() {
    // this.onFinish.emit();
    console.log(this.reportsCriteria);
    console.log(this.selectedClasses);

    // send the all criteria array to the database
    // first check if reports criteria has data
    if (
      this.reportsCriteria.scoresheets.length &&
      this.reportsCriteria.classes.length &&
      this.reportsCriteria.percentages.length
    ) {
      this.reportInfo.criteria.push(this.reportsCriteria);
      this.resetReportsCriteria();
    }

    // check if the report name and year have been added
    if(this.reportInfo.name === '' || this.reportInfo.year === ''){
      this.reportInfo.name = this.reportName.value || '';
      this.reportInfo.year = this.year.value || '';
    }

    this.onFinish.emit(this.reportInfo);
  }

  onBackClicked() {
    if (this.process_progress > 50) {
      // this.resetBackButtonStyles();

      // set animtion to slide left
      this.dataStyles = {
        animationName: 'slide-right',
        animationDuration: '2s',
        animationFillMode: 'forwards',
      };

      this.process_progress = this.process_progress - 50;
      console.log(this.process_progress);
    } else {
      console.log(`This is the beginnig of the list. ${this.process_progress}`);
    }
  }

  onNextClicked() {
    //  start transition to the right
    if (this.process_progress <= 50) {
      // this.resetNextButtonStyles();

      this.dataStyles = {
        animationName: 'slide-left',
        animationDuration: '2s',
        animationFillMode: 'forwards',
      };

      this.process_progress = this.process_progress + 50;
      console.log(this.process_progress);
    } else {
      console.log(`This is the end of the list ${this.process_progress}`);
    }
  }

  resetNextButtonStyles() {
    this.dataStyles = {
      animationName: '',
      animationDuration: '',
      animationFillMode: '',
    };
  }

  // function to reset report criteria instance
  resetReportsCriteria() {
    this.reportsCriteria = {
      scoresheets: [],
      classes: [],
      percentages: [],
    };
  }

  // function to reset the percentages array
  resetPercentagesArray() {
    this.percentages = [];
  }

  // function to reset selectedAllClasses boolean value
  resetSelectAllClasses() {
    this.selectAllClasses = false;
  }

  selectScoresheet(selection: IScoresheet) {
    this.scoresheetSelection = selection;

    // add the selected scoresheet to reportsCriteria array
    this.reportsCriteria.scoresheets.push(this.scoresheetSelection);

    // empty the scoresheetSelection variable
    this.scoresheetSelection = this.initialScoresheetSelection;
  }

  classAdded(stream: IClassname, index: number) {
    // first check if the class has been selected in the list
    const classIndex = this.reportsCriteria.classes.findIndex(
      (temp) => stream._id! === temp._id!,
    );

    console.log(classIndex);

    if (classIndex !== -1) {
      this.reportsCriteria.classes.splice(classIndex, 1);
      console.log(this.reportsCriteria.classes);
    } else {
      this.reportsCriteria.classes.push(stream);
    }

    // for (let i = 0; i < this.reportsCriteria.classes.length; i++) {
    //   const temp: IClassname = this.reportsCriteria.classes[i];
    //
    //   if (temp._id || '' === stream._id || '') {
    //     //  class exists in list
    //     // remove from list
    //     delete this.reportsCriteria.classes[i];
    //   }
    // }
  }

  selectAllClassesClicked(streams: Observable<IClassname[]>) {
    console.log(streams);
    if (this.selectAllClasses) {
      streams.subscribe({
        next: (data: IClassname[]) => {
          data.forEach((stream: IClassname) => {
            this.reportsCriteria.classes.push(stream);
          });

          // set all classes selected to true
          this.selectedClasses = [];
          this.selectedClasses = Array(data.length).fill(true);
        },
      });
    } else {
      this.reportsCriteria.classes = [];
      this.resetSelectedClassesBoolean();
    }
  }

  addNewCriteria() {
    console.log('Reseting all controls');

    if (this.reportInfo.name === '' && this.reportInfo.year === '') {
      this.reportInfo = {
        name: this.reportName.value || '',
        year: this.year.value || '',
        criteria: [this.reportsCriteria],
      };
    } else {
      // only push the new criteria
      this.reportInfo.criteria.push(this.reportsCriteria);
    }

    // reset reports criteria
    this.resetReportsCriteria();
    this.resetPercentagesArray();
    this.resetSelectAllClasses();
    this.resetSelectedClassesBoolean();
  }

  selectAndShowCriteria(crit: IReportsCriteria) {
    this.reportsCriteria = crit;

    // add selected classes boolean
  }
}
