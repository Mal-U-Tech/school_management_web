import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectClassAPIError, selectClassAPILoading, selectCurrentClass } from '../../store/classes.selectors';
import { IClass } from 'src/app/interfaces/class.interface';
import { MatDialog } from '@angular/material/dialog';
import { NameDialogComponent } from '../../components/name-dialog/name-dialog.component';
import { ISubject } from 'src/app/interfaces/subject.interface';
import { RemoveSubjectDialogComponent } from '../../components/remove-subject-dialog/remove-subject-dialog.component';
import { UpdateSubjectsDialogComponent } from '../../components/update-subjects-dialog/update-subjects-dialog.component';
import { IUser } from 'src/app/interfaces/user.interface';
import { UpdateTeachersDialogComponent } from '../../components/update-teachers-dialog/update-teachers-dialog.component';
import { RemoveTeacherDialogComponent } from '../../components/remove-teacher-dialog/remove-teacher-dialog.component';
import { IStudent } from 'src/app/interfaces/student.interface';
import { UpdateStudentsDialogComponent } from '../../components/update-students-dialog/update-students-dialog.component';
import { RemoveStudentDialogComponent } from '../../components/remove-student-dialog/remove-student-dialog.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  class$ = this.store.select(selectCurrentClass);

  subject_columns = ['options', 'name', 'remove'];
  teacher_columns = ['options', 'name', 'contact', 'remove'];
  student_columns = ['avatar', 'name', 'contact', 'remove'];

  loading$ = this.store.select(selectClassAPILoading);
  error$ = this.store.select(selectClassAPIError);

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

  getsubjecttooltip(value: IClass, subject: ISubject) {
    return `Remove ${subject.name} from ${value.name}`
  }

  getteachertooltip(value: IClass, teacher: IUser) {
    return `Remove ${teacher.firstname} ${teacher.lastname} from ${value.name}`
  }

  getstudenttooltip(value: IClass, student: IStudent) {
    return `Remove ${student.user?.firstname} ${student.user?.lastname} from ${value.name}`
  }

  updatesubjects(value: IClass) {
    this.dialog.open(UpdateSubjectsDialogComponent, {
      data: value,
      width: '540px'
    })
  }

  updateteachers(value: IClass) {
    this.dialog.open(UpdateTeachersDialogComponent, {
      data: value,
      width: '540px'
    })
  }

  updatestudents(value: IClass) {
    this.dialog.open(UpdateStudentsDialogComponent, {
      data: value,
      width: '540px',
    })
  }

  removesubject(value:IClass, subject: ISubject) {
    this.dialog.open(RemoveSubjectDialogComponent, {
      data: {
        class: value,
        subject,
      },
      width: '440px'
    })
  }

  removeteacher(value: IClass, teacher: IUser) {
    this.dialog.open(RemoveTeacherDialogComponent, {
      data: {
        class: value,
        teacher,
      },
      width: '440px'
    })
  }

  removestudent(value: IClass, student: IStudent) {
    this.dialog.open(RemoveStudentDialogComponent, {
      data: {
        class: value,
        student,
      },
      width: '440px',
    })
  }
}
