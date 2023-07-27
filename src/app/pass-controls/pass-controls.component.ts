import { Component, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { takeWhile } from 'rxjs';
import { ISubjects } from '../shared/add-subjects/add-subjects.interface';
import { PassControlsService } from '../shared/pass-controls/pass-controls.service';
import { IScoresheet } from '../shared/scoresheet/scoresheet.interface';
import { ScoresheetService } from '../shared/scoresheet/scoresheet.service';
import {
  postPassControlsRequest,
  updatePassControlsRequest,
} from '../store/pass-controls/pass-control.action';
import { selectChosenScoresheet } from '../store/scoresheet/scoresheet.selector';
import { selectSubjectsArray } from '../store/subjects/subjects.selector';
import { IPassControls } from './models/pass-controls.model';

@Component({
  selector: 'app-pass-controls',
  templateUrl: './pass-controls.component.html',
  styleUrls: ['./pass-controls.component.scss'],
})
export class PassControlsComponent implements OnDestroy {
  constructor(
    private api: PassControlsService,
    private scoresheetSerivce: ScoresheetService,
    @Inject(MAT_DIALOG_DATA) public dialogData: IPassControls,
    private store: Store,
  ) {
    this.loadData();
  }
  name = 'Add Passing Subject';
  mark = 0;
  aggregate = 0;
  numPassedSubjects = 0;
  otherSubjectsPassMark = 0;
  passControls = [];
  checked = false;
  level = '';
  subjects: ISubjects[] = [];
  scoresheetId = '';
  title = 'Pass Controls';
  dummy?: IPassControls;
  subjects$ = this.store.select(selectSubjectsArray);
  scoresheet$ = this.store.select(selectChosenScoresheet);
  alive = true;

  // constructor(private api: PassControlsService) {}

  // Event emitters
  onConfirmControls = new EventEmitter();
  onCloseDialog = new EventEmitter();

  confirmControls() {
    this.onConfirmControls.emit();
    console.log(this.scoresheetId);
  }

  closeDialog(value?: IPassControls) {
    this.onCloseDialog.emit(value || null);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  passingSubjectSelected(subject: ISubjects) {
    this.name = subject.name;
    this.level = subject.level;
    this.mark = subject.pass_mark;
  }

  loadData() {
    let subs: ISubjects[] = [];
    // set scoresheet id
    this.scoresheet$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IScoresheet) => {
        if (data) {
          this.scoresheetId = data._id || '';
        }
      },
    });

    this.subjects$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: ISubjects[]) => {
        if (data.length) {
          subs = data;
        }
      },
    });

    // console.log(subs);
    this.subjects = subs;

    // add data if dialogData is not empty
    if (this.dialogData !== undefined) {
      if (this.dialogData !== null) {
        console.log(this.dialogData);
        this.name = this.dialogData.name;
        this.mark = this.dialogData.mark;
        this.aggregate = this.dialogData.aggregate;
        this.level = this.dialogData.level;
        this.otherSubjectsPassMark = this.dialogData.other_subjects_mark;
        this.numPassedSubjects = this.dialogData.num_passed_subject;
      }
    }
  }

  submitPassControls() {
    const controls: IPassControls = {
      scoresheet_id: this.scoresheetId,
      name: this.name,
      mark: this.mark,
      aggregate: this.aggregate,
      num_passed_subject: this.numPassedSubjects,
      other_subjects_mark: this.otherSubjectsPassMark,
      level: this.level,
    };

    if (this.dialogData !== null) {
      this.store.dispatch(
        updatePassControlsRequest({
          id: this.dialogData._id || '',
          passControls: controls,
        }),
      );

    } else {
      this.store.dispatch(postPassControlsRequest({ passControls: controls }));

    }
  }
}
