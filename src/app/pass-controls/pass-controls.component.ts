import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { ISubjects } from '../shared/add-subjects/add-subjects.interface';
import { PassControlsService } from '../shared/pass-controls/pass-controls.service';
import { ScoresheetService } from '../shared/scoresheet/scoresheet.service';
import { selectSubjectsArray } from '../store/subjects/subjects.selector';
import { IPassControls } from './models/pass-controls.model';

@UntilDestroy()
@Component({
  selector: 'app-pass-controls',
  templateUrl: './pass-controls.component.html',
  styleUrls: ['./pass-controls.component.scss'],
  // providers: [PassControlStore],
})
export class PassControlsComponent {
  constructor(
    private api: PassControlsService,
    private scoresheetSerivce: ScoresheetService,
    @Inject(MAT_DIALOG_DATA) public dialogData: IPassControls,
    private store: Store
  ) {
    this.loadData();
    this.scoresheetId = this.scoresheetSerivce.selectedScoresheetId;
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

  // ngOnInit(): void {}

  passingSubjectSelected(subject: ISubjects) {
    this.name = subject.name;
    this.level = subject.level;
    this.mark = subject.pass_mark;
  }

  loadData() {
    let subs: ISubjects[] = []; // = JSON.parse(sessionStorage.getItem('subjects') || '');

    this.subjects$.pipe(untilDestroyed(this)).subscribe({
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
      this.api.patchPassControl(this.dialogData._id || '', controls).subscribe({
        next: (data) => {
          this.closeDialog(data);
          this.api.updatePassControl = data;
        },
        error: (error) => {
          this.api.errorToast(error);
        },
      });
    } else {
      this.api.postPassControls(controls).subscribe({
        next: (data) => {
          this.closeDialog(data);
          this.api.appendPassControls = data;
        },
        error: (error) => {
          console.log(error);
          this.api.errorToast(error);
        },
      });
    }
  }
}
