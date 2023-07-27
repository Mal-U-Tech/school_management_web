import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeWhile } from 'rxjs';
import { ISubjects } from '../shared/add-subjects/add-subjects.interface';
import { IClassname } from '../shared/classname/classname.interface';
import { ISubjectTeacher } from '../shared/subject-teacher/subject-teacher.interface';
import { SubjectTeacherService } from '../shared/subject-teacher/subject-teacher.service';
import { ITeacher } from '../shared/teacher/teacher.interface';
import { selectStreamsArray } from '../store/streams/streams.selector';
import {
  postSubjectTeacherRequest,
  subjectTeacherIsLoading,
} from '../store/subject-teachers/subject-teachers.actions';
import { selectSubjectsArray } from '../store/subjects/subjects.selector';
import { selectTeacherArray } from '../store/teacher/teacher.selector';

@Component({
  selector: 'app-subject-teacher',
  templateUrl: './subject-teacher.component.html',
  styleUrls: ['./subject-teacher.component.scss'],
})
export class SubjectTeacherComponent implements OnDestroy {
  constructor(public apiService: SubjectTeacherService, private store: Store) {}

  // variables for subject, teacher and streams array
  public streams: IClassname[] = [];
  public teachers: ITeacher[] = [];
  public subjects: ISubjects[] = [];
  alive = true;

  streams$ = this.store.select(selectStreamsArray);
  teachers$ = this.store.select(selectTeacherArray);
  subjects$ = this.store.select(selectSubjectsArray);

  // ngOnInit(): void {
  // this.streams = JSON.parse(sessionStorage.getItem('streams')!);

  // this.streams$.pipe(takeWhile(() => this.alive)).subscribe((data) => {
  //   if (data) {
  //     this.streams = data;
  //     console.log(this.streams);
  //   }else {
  //     console.log(`this is else in streams`);
  //   }
  // });

  // this.teachers = JSON.parse(sessionStorage.getItem('teachers')!);
  // this.teachers$.pipe(takeWhile(() => this.alive)).subscribe((data) => {
  //   if (data) {
  //     this.teachers = data;
  //
  //     // // add the title field to the teacher objects
  //     // this.teachers.forEach((teacher) => {
  //     //   (teacher as any).title = this.apiService.computeTeacherTitle(
  //     //     teacher.gender,
  //     //     teacher.marital_status
  //     //   );
  //     //
  //     //   console.log(teacher);
  //     // });
  //     console.log(`This is teachers: ${this.teachers}`);
  //   }
  // });

  // this.subjects = JSON.parse(sessionStorage.getItem('subjects')!);
  // this.subjects$.pipe(takeWhile(() => this.alive)).subscribe((data) => {
  //   if (data) {
  //     this.subjects = data;
  //   }
  // });
  // }

  ngOnDestroy(): void {
    this.alive = false;
  }

  // dialog title
  public title = 'Add Subject Teacher';
  public res = 0;

  // subject teacher schema properties
  public streamSelection: IClassname = null as any;
  public subjectSelection: ISubjects = null as any;
  public teacherSelection: ITeacher = null as any;
  public year = new Date().getFullYear().toString();

  // event emitters
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();

  // stream selection method
  selectStream(selection: any) {
    console.log(selection);
    this.streamSelection = selection;
  }

  // subject selection method
  selectSubject(selection: ISubjects) {
    console.log(selection);
    this.subjectSelection = selection;
  }

  // teacher selection method
  selectTeacher(selection: ITeacher) {
    const title = this.apiService.computeTeacherTitle(
      selection.gender,
      selection.marital_status
    );
    console.log(title);
    // selection.title = title;
    console.log(`This is teacher selection: `);
    // console.log(selection);
    this.teacherSelection = {
      _id: selection._id,
      user_id: selection.user_id,
      gender: selection.gender,
      marital_status: selection.marital_status,
      title: title,
    };
        console.log(this.teacherSelection);
  }

  // close subject teacher dialog
  closeSubjectTeacherDialog() {
    this.onClose.emit();
  }

  // submit subject teacher to database
  submitSubjectTeacher() {
    this.onSubmit.emit();
  }

  dispatchSubjectTeacherIsLoading(state: boolean) {
    this.store.dispatch(
      subjectTeacherIsLoading({ subjectTeacherIsLoading: state })
    );
  }

  // submit subject teacher to database via api
  saveSubjectTeacher() {
    this.dispatchSubjectTeacherIsLoading(true);
    const teacher: ISubjectTeacher = {
      subject_id: this.subjectSelection._id,
      class_id: this.streamSelection._id,
      teacher_id: this.teacherSelection._id,
      year: this.year,
    };

    this.store.dispatch(postSubjectTeacherRequest({ subjectTeacher: teacher }));


  }
}
