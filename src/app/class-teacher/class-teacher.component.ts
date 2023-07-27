import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { IClassTeacher } from '../shared/class-teacher/class-teacher.interface';
import { ClassTeacherService } from '../shared/class-teacher/class-teacher.service';
import { IClassname } from '../shared/classname/classname.interface';
import { ITeacher } from '../shared/teacher/teacher.interface';
import {
  classTeacherIsLoading,
  postClassTeacherRequest,
} from '../store/class-teacher/class-teacher.actions';
import { selectStreamsArray } from '../store/streams/streams.selector';
import { selectTeacherArray } from '../store/teacher/teacher.selector';

@Component({
  selector: 'app-class-teacher',
  templateUrl: './class-teacher.component.html',
  styleUrls: ['./class-teacher.component.scss'],
})
export class ClassTeacherComponent implements OnDestroy {
  constructor(public apiService: ClassTeacherService, private store: Store) {}

  // variables for teachers and classes
  streams$ = this.store.select(selectStreamsArray);
  teachers$ = this.store.select(selectTeacherArray);

  ngOnDestroy(): void {
    this.alive = false;
  }

  // dialog title
  public title = 'Add Class Teacher';
  public alive = true;

  public teacherSelection?: ITeacher = undefined;
  public classSelection?: IClassname = undefined;
  public year = new Date().getFullYear().toString();

  // event emitters
  onClose = new EventEmitter();
  onSubmit = new EventEmitter();

  // class selection method
  selectClass(selection: IClassname) {
    this.classSelection = selection;
  }

  // teacher selection method
  selectTeacher(selection: ITeacher) {
    this.teacherSelection = {
      _id: selection._id,
      gender: selection.gender,
      marital_status: selection.marital_status,
      title: this.apiService.computeTeacherTitle(
        selection.gender,
        selection.marital_status
      ),
      user_id: selection.user_id,
    };
  }

  // close class teacher dialog
  closeClassTeacherDialog() {
    this.onClose.emit();
  }

  // submit class teacher to database
  submitClassTeacher() {
    this.onSubmit.emit();
  }

  // to dispatch class teacher is loading
  dispatchClassTeacherIsLoading() {
    this.store.dispatch(classTeacherIsLoading({ classTeacherIsLoading: true }));
  }

  // api method to submit teacher to database
  saveClassTeacher() {
    let teacher: IClassTeacher;

    // check if selection has data
    if (
      this.teacherSelection !== undefined &&
      this.classSelection !== undefined
    ) {
      // the data is available
      // assign values to teacher variable
      teacher = {
        teacher_id: this.teacherSelection?._id || '',
        class_id: this.classSelection?._id || '',
        year: this.year,
      };

      this.dispatchClassTeacherIsLoading();
      this.store.dispatch(postClassTeacherRequest({ classTeacher: teacher }));
    } else {
      this.apiService.errorToast('Please select class and teacher.');
    }
  }
}
