import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { IClassname } from 'src/app/shared/classname/classname.interface';
import { SubjectTeacherService } from 'src/app/shared/subject-teacher/subject-teacher.service';
import { selectStreamsArray } from 'src/app/store/streams/streams.selector';

@Component({
  selector: 'app-update-subject-teacher',
  templateUrl: './update-subject-teacher.component.html',
  styleUrls: ['./update-subject-teacher.component.scss'],
})
export class UpdateSubjectTeacherComponent {
  constructor(
    public apiService: SubjectTeacherService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store
  ) {
    const subjectTeacher = data;
    this._id = subjectTeacher._id;
    this.streamSelection = {
      name: subjectTeacher.class_id.name,
      _id: subjectTeacher.class_id._id,
    };

    this.subjectSelection = {
      _id: subjectTeacher.subject_id._id,
      name: subjectTeacher.subject_id.name,
      level: subjectTeacher.subject_id.level,
    };

    this.teacherSelection = {
      _id: subjectTeacher.teacher_id._id,
      title: subjectTeacher.title,
      name: subjectTeacher.teacher_id.name,
      surname: subjectTeacher.teacher_id.surname,
    };

    this.year = subjectTeacher.year.toString();

    this.loadData();
  }

  _id = '';
  streamSelection = {
    _id: '',
    name: 'Select Grade and Stream',
  };

  subjectSelection = {
    _id: '',
    name: '',
    level: '',
  };

  teacherSelection = {
    _id: '',
    title: '',
    name: '',
    surname: '',
  };

  year = '';
  title = 'Update Subject Teacher';

  classes: IClassname[] = [];
  subjects = [];
  teachers = [];

  onClose = new EventEmitter();
  onSubmit = new EventEmitter();
  onLoadData = new EventEmitter();

  streams$ = this.store.select(selectStreamsArray);

  onCloseClicked() {
    this.onClose.emit();
  }

  onSubmitClicked() {
    this.onSubmit.emit();
  }

  onLoadDataClicked() {
    this.onLoadData.emit();
  }

  selectStream(stream: any) {
    this.streamSelection.name = stream.name;
    this.streamSelection._id = stream._id;
  }

  selectSubject(subject: any) {
    this.subjectSelection._id = subject._id;
    this.subjectSelection.name = subject.name;
    this.subjectSelection.level = subject.level;
  }

  selectTeacher(teacher: any) {
    this.teacherSelection.title = teacher.title;
    this.teacherSelection._id = teacher._id;
    this.teacherSelection.name = teacher.name;
    this.teacherSelection.surname = teacher.surname;
    console.log(this.teacherSelection);
  }

  loadData() {
    // this.classes = JSON.parse(sessionStorage.getItem('streams') || '');
    this.streams$.subscribe({
      next: (data: IClassname[]) => {
        if (data != null) {
          this.classes = data;
        }
      },
    });

    this.subjects = JSON.parse(sessionStorage.getItem('subjects') || '');

    this.teachers = JSON.parse(sessionStorage.getItem('teachers') || '');
  }

  updateSubjectTeacher() {
    const teacher = {
      _id: this._id,
      teacher_id: this.teacherSelection._id,
      class_id: this.streamSelection._id,
      subject_id: this.subjectSelection._id,
      year: this.year,
    };
    console.log(teacher);

    this.apiService.updateSubjectTeacher(this._id, teacher).subscribe({
      next: (data: any) => {
        console.log(data);
        this.apiService.successToast('Successfully updated subject teachers.');
        setTimeout(() => {
          this.onLoadDataClicked();
        }, 1000);
        this.onCloseClicked();
      },
      error: (error) => {
        this.apiService.errorToast(error);
        this.onCloseClicked();
      },
    });
  }
}
