import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISubject } from '../add-subjects/models/subject.model';
import { PassControlsService } from '../shared/pass-controls/pass-controls.service';
import { ScoresheetService } from '../shared/scoresheet/scoresheet.service';
import { IPassControls } from './models/pass-controls.model';

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
    @Inject(MAT_DIALOG_DATA) public dialogData: IPassControls
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
  subjects: ISubject[] = [];
  scoresheetId = '';
  title = 'Pass Controls';
  dummy?: IPassControls;

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

  passingSubjectSelected(subject: ISubject) {
    this.name = subject.name;
    this.level = subject.level;
    this.mark = subject.pass_mark;
  }

  loadData() {
    const subs = JSON.parse(sessionStorage.getItem('subjects') || '');
    // console.log(subs);
    this.subjects = subs;

    // add data if dialogData is not empty
    if (this.dialogData !== undefined) {
      if (this.dialogData !== null) {
        console.log(this.dialogData);
        this.name = this.dialogData.passing_subject.name;
        this.mark = this.dialogData.passing_subject.mark;
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
      passing_subject: {
        name: this.name,
        mark: this.mark,
      },
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
