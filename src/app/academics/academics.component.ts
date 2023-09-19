import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubjectTeacherService } from '../shared/subject-teacher/subject-teacher.service';
import { ClassTeacherService } from '../shared/class-teacher/class-teacher.service';
import { HodService } from '../shared/hod/hod.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmScoresheetModulesCreatedComponent } from '../scoresheet/confirm-scoresheet-modules-created/confirm-scoresheet-modules-created.component';
import { Store } from '@ngrx/store';
import {
  getStreamsRequest,
  streamsIsLoading,
} from '../store/streams/streams.actions';
import { selectSchoolInfo } from '../store/school-info/school-info.selector';
import { SchoolInfoState } from '../store/school-info/school-info.reducer';
import { selectUserData } from '../store/user/user.selector';
import { IUser } from '../shared/user/user.interface';
import {
  departmentsIsLoading,
  getDepartmentsRequest,
} from '../store/departments/departments.actions';
import {
  getSubjectsRequest,
  subjectsIsLoading,
} from '../store/subjects/subjects.actions';
import { getTeachersRequest } from '../store/teacher/teacher.actions';
import {
  classStudentsIsLoading,
  getClassStudentsArrayRequest,
} from '../store/class-students/class-students.actions';
import {
  getSubjectTeachersRequest,
  subjectTeacherIsLoading,
} from '../store/subject-teachers/subject-teachers.actions';
import {
  classTeacherIsLoading,
  getClassTeachersRequest,
} from '../store/class-teacher/class-teacher.actions';
import { takeWhile } from 'rxjs';
import { getHodRequest, hodIsLoading } from '../store/hod/hod.actions';
import {
  getScoresheetRequest,
  scoresheetIsLoading,
} from '../store/scoresheet/scoresheet.action';
import { getReportsRequest, reportsIsLoading } from '../store/reports/reports.actions';

interface TEACHER {
  _id: string;
  title: string;
  name: string;
  surname: string;
  contact: string;
  gender: string;
  marital_status: string;
}

@Component({
  selector: 'app-academics',
  templateUrl: './academics.component.html',
  styleUrls: ['./academics.component.scss'],
})
export class AcademicsComponent implements OnInit, OnDestroy {
  /** Based on the screen size, switch from standard to one column per row */
  // cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
  //   map(({ matches }) => {
  //     if (matches) {
  //       return [
  //         { title: 'Overview', cols: 1, rows: 1 },
  //         { title: 'Streams', cols: 1, rows: 1 },
  //         { title: 'Departments', cols: 1, rows: 1 },
  //         { title: 'Subjects', cols: 1, rows: 1 },
  //         { title: 'Teachers', cols: 1, rows: 1 },
  //         { title: 'Class Students', cols: 1, rows: 1 },
  //         { title: 'Subject Teachers', cols: 1, rows: 1 },
  //         { title: 'Teachers', cols: 1, rows: 1 },
  //         { title: 'Head of Departments', cols: 1, rows: 1 },
  //         { title: 'Committees', cols: 1, rows: 1 },
  //       ];
  //     }
  //
  //     return [
  //       { title: 'Overview', cols: 2, rows: 1 },
  //       { title: 'Streams', cols: 1, rows: 1 },
  //       { title: 'Departments', cols: 1, rows: 1 },
  //       { title: 'Subjects', cols: 1, rows: 1 },
  //       { title: 'Teachers', cols: 1, rows: 1 },
  //       { title: 'Class Students', cols: 1, rows: 1 },
  //       { title: 'Subject Teachers', cols: 1, rows: 1 },
  //       { title: 'Class Teachers', cols: 1, rows: 1 },
  //       { title: 'Head of Departments', cols: 1, rows: 1 },
  //       { title: 'Committees', cols: 1, rows: 1 },
  //     ];
  //   })
  // );

  numCols = 2;
  cards = [
    { title: 'Overview', cols: this.numCols, rows: 1 },
    { title: 'Streams', cols: 1, rows: 1 },
    { title: 'Departments', cols: 1, rows: 1 },
    { title: 'Subjects', cols: 1, rows: 1 },
    { title: 'Teachers', cols: 1, rows: 1 },
    { title: 'Class Students', cols: 1, rows: 1 },
    { title: 'Subject Teachers', cols: 1, rows: 1 },
    { title: 'Class Teachers', cols: 1, rows: 1 },
    { title: 'Head of Departments', cols: 1, rows: 1 },
    { title: 'Committees', cols: 1, rows: 1 },
  ];
  private alive = true;

  constructor(
    private subjectTeacherApi: SubjectTeacherService,
    private classTeacherApi: ClassTeacherService,
    private hodApi: HodService,
    private router: Router,
    private dialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.numCols = window.innerWidth <= 768 ? 2 : 1;

    // assign user data
    this.user$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data) => {
        if (data) {
          this.user = data;
        }
      },
    });

    this.getStreams();
    this.getSubjects();
    this.getDepartments();
    this.getTeachers();
    this.getClassStudents();
    this.getSubjectTeachers();
    this.getClassTeachers();
    this.getHOD();
    this.getScoresheet();
    this.getReports();
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  onResize(event: any) {
    console.log('Resizing ' + event.target.innerWidth);
    this.numCols = event.target.innerWidth <= 768 ? 2 : 1;
  }

  public larger = '350px';
  public smaller = '150px';
  public streamsCount = '0';
  public subjectCount = '0';
  public deptCount = '0';
  public teacherCount = '0';
  public classStudentsCount = '0';
  public classStreams: any[] = [];
  public subjectTeachersCount = '0';
  public classTeachersCount = '0';
  public hodCount = '0';
  public schoolId = '';
  public user: any;
  schoolInfo$ = this.store.select(selectSchoolInfo);
  user$ = this.store.select(selectUserData);
  // teachers$ = this.store.select(selectTeacherArray);

  dispatchStreamsIsLoading() {
    this.store.dispatch(streamsIsLoading({ streamsIsLoading: true }));
  }

  dispatchDepartmentsIsLoading() {
    this.store.dispatch(departmentsIsLoading({ departmentsIsLoading: true }));
  }

  dispatchSubjectsIsLoading() {
    this.store.dispatch(subjectsIsLoading({ subjectsIsLoading: true }));
  }

  dispatchTeachersIsLoading() {
    this.store.dispatch(departmentsIsLoading({ departmentsIsLoading: true }));
  }

  dispatchClassStudentIsLoading() {
    this.store.dispatch(
      classStudentsIsLoading({ classStudentsIsLoading: true })
    );
  }

  dispatchSubjectTeacherIsLoading() {
    this.store.dispatch(
      subjectTeacherIsLoading({ subjectTeacherIsLoading: true })
    );
  }

  dispatchClassTeacherIsLoading() {
    this.store.dispatch(classTeacherIsLoading({ classTeacherIsLoading: true }));
  }

  dispatchHodIsLoading() {
    this.store.dispatch(hodIsLoading({ hodIsLoading: true }));
  }

  dispatchScoresheetIsLoading() {
    this.store.dispatch(scoresheetIsLoading({ isLoading: true }));
  }

  dispatchReportsIsLoading() {
    this.store.dispatch(reportsIsLoading({isLoading: true}));
  }

  getStreams() {
    this.schoolInfo$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: SchoolInfoState) => {
        console.log(data);
        try {
          this.schoolId = data?.schoolInfo?._id || '';
        } catch (error) {
          console.log(error);
        }

        // dispatch action to retrieve streams
        if (
          this.schoolId != null &&
          this.schoolId != '' &&
          this.schoolId != undefined
        ) {
          // dispatch action to start loading
          this.dispatchStreamsIsLoading();

          this.store.dispatch(
            getStreamsRequest({
              schoolId: this.schoolId,
              currentPage: 0,
              pageSize: 0,
            })
          );
        } else {
          console.log('There is no school id');
        }
      },
    });
  }

  getDepartments() {
    this.dispatchDepartmentsIsLoading();

    this.store.dispatch(getDepartmentsRequest({ currentPage: 0, pageSize: 0 }));
  }

  getSubjects() {
    this.dispatchSubjectsIsLoading();
    this.store.dispatch(getSubjectsRequest({ currentPage: 0, pageSize: 0 }));
  }

  getTeachers() {
    this.dispatchTeachersIsLoading();
    this.store.dispatch(getTeachersRequest({ currentPage: 0, pageSize: 0 }));
  }

  // function to assign teacher title for all teachers
  assignTeacherTitles(teachers: any[]) {
    const arr: TEACHER[] = [];
    for (let i = 0; i < teachers.length; i++) {
      const temp = teachers[i];
      arr.push({
        _id: temp._id,
        title: this.subjectTeacherApi.computeTeacherTitle(
          temp.gender,
          temp.marital_status
        ),
        name: temp.user_id.name,
        surname: temp.user_id.surname,
        gender: temp.gender,
        marital_status: temp.marital_status,
        contact: temp.user_id.contact,
      });
    }

    return arr;
  }

  getClassStudents() {
    this.dispatchClassStudentIsLoading();
    this.store.dispatch(
      getClassStudentsArrayRequest({ currentPage: 0, pageSize: 0 })
    );
  }

  getSubjectTeachers() {
    this.dispatchSubjectTeacherIsLoading();
    this.store.dispatch(
      getSubjectTeachersRequest({ currentPage: 0, pageSize: 0 })
    );
  }

  getClassTeachers() {
    this.dispatchClassTeacherIsLoading();
    this.store.dispatch(
      getClassTeachersRequest({ currentPage: 0, pageSize: 0 })
    );
  }

  getHOD() {
    this.dispatchHodIsLoading();
    this.store.dispatch(getHodRequest({ currentPage: 0, pageSize: 0 }));
  }

  getScoresheet() {
    this.dispatchScoresheetIsLoading();
    this.store.dispatch(getScoresheetRequest());
  }

  getReports() {
    this.dispatchReportsIsLoading();
    this.store.dispatch(getReportsRequest());
  }

  // function to navigate to add streams component
  navigate = (path: string): void => {
    this.router.navigate([path]);
  };

  // open modal dialog for scoresheets
  openScoresheetModalDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'scoresheet-confirmation-modal';
    dialogConfig.height = '350px';
    dialogConfig.width = '600px';
    this.dialog.open(ConfirmScoresheetModulesCreatedComponent, dialogConfig);
  }

  navigateToViewScoresheets() {
    this.navigate('view-scoresheets');
  }

  navigateToViewReports(){
    this.navigate('view-reports');
  }
}
