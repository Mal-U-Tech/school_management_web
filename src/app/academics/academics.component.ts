import { Component,  OnInit } from '@angular/core';
import { ClassnameApiService } from '../shared/classname/classname-api.service';
import { Router } from '@angular/router';
import { AddSubjectsService } from '../shared/add-subjects/add-subjects.service';
import { AddDepartmentsService } from '../shared/add-departments/add-departments.service';
import { TeacherService } from '../shared/teacher/teacher.service';
import { ClassStudentsService } from '../shared/class-students/class-students.service';
import { SubjectTeacherService } from '../shared/subject-teacher/subject-teacher.service';
import { ClassTeacherService } from '../shared/class-teacher/class-teacher.service';
import { HodService } from '../shared/hod/hod.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmScoresheetModulesCreatedComponent } from '../scoresheet/confirm-scoresheet-modules-created/confirm-scoresheet-modules-created.component';
import { ITeacher } from '../shared/teacher/teacher.interface';
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
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { getSubjectsRequest, subjectsIsLoading } from '../store/subjects/subjects.actions';

interface TEACHER {
  _id: string;
  title: string;
  name: string;
  surname: string;
  contact: string;
  gender: string;
  marital_status: string;
}

@UntilDestroy()
@Component({
  selector: 'app-academics',
  templateUrl: './academics.component.html',
  styleUrls: ['./academics.component.scss'],
})
export class AcademicsComponent implements OnInit {
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

  constructor(
    private api: ClassnameApiService,
    private subjectsApi: AddSubjectsService,
    private deptApi: AddDepartmentsService,
    private teacherApi: TeacherService,
    private clasStudentsApi: ClassStudentsService,
    private subjectTeacherApi: SubjectTeacherService,
    private classTeacherApi: ClassTeacherService,
    private hodApi: HodService,
    private router: Router,
    private dialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.numCols = window.innerWidth <= 768 ? 2 : 1;

    this.getStreams();
    this.getSubjects();
    this.getDepartments();
    this.getTeachers();
    this.getClassStudents();
    this.getSubjectTeachers();
    this.getClassTeachers();
    this.getHOD();
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
  schoolInfo$ = this.store.select(selectSchoolInfo);
  user$ = this.store.select(selectUserData);

  dispatchStreamsIsLoading() {
    this.store.dispatch(streamsIsLoading({ streamsIsLoading: true }));
  }

  dispatchDepartmentsIsLoading() {
    this.store.dispatch(departmentsIsLoading({ departmentsIsLoading: true }));
  }

  dispatchSubjectsIsLoading() {
    this.store.dispatch(subjectsIsLoading({subjectsIsLoading: true}));
  }

  getStreams() {
   this.schoolInfo$.pipe(untilDestroyed(this)).subscribe({
      next: (data: SchoolInfoState) => {
        console.log(data);
        this.schoolId = data.schoolInfo._id || '';

        // dispatch action to retrieve streams
        if (this.schoolId != null || this.schoolId != '') {
          // dispatch action to start loading
          this.dispatchStreamsIsLoading();

          this.store.dispatch(
            getStreamsRequest({
              schoolId: this.schoolId,
              currentPage: 0,
              pageSize: 0,
            })
          );
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
    this.store.dispatch(getSubjectsRequest({currentPage: 0, pageSize: 0}));
    // this.subjectsApi.getAllSubjects(0, 0).subscribe({
    //   next: (data: any) => {
    //     this.subjectCount = data.length.toString();
    //     sessionStorage.setItem('subjects', JSON.stringify(data));
        // this.subjectsApi.assignSubjectsToLevels(data); check this one out !!!!!!!!!!!!
    //   },
    //   error: (err) => {
    //     this.subjectsApi.errorToast(err.toString());
    //   },
    // });
  }

  getTeachers() {
    this.teacherApi
      .getAllTeachers(0, 0)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: ITeacher[]) => {
          this.teacherCount = data.length.toString();

          // get current user
          this.user$.pipe(untilDestroyed(this)).subscribe((user: IUser) => {
            // compute teacher title and store in session storage
            sessionStorage.setItem(
              'teachers',
              JSON.stringify(this.assignTeacherTitles(data))
            );

            // find out if current user is a teacher
            // console.log(data);
            data.forEach((element: any) => {
              if (element.user_id._id == user._id) {
                // console.log('I am a teacher');
                sessionStorage.setItem(
                  'user',
                  JSON.stringify({
                    _id: user._id,
                    name: user.name,
                    surname: user.surname,
                    contact: user.contact,
                    email: user.email,
                    teacher_id: element._id,
                  })
                );
              }
            });
          });
        },
        error: (err) => {
          this.teacherApi.errorToast(err.toString());
        },
      });
  }

  // function to assign teacher title for all teachers
  assignTeacherTitles(teachers: any[]) {
    const arr: TEACHER[] = [];
    for (let i = 0; i < teachers.length; i++) {
      const temp = teachers[i];
      arr.push({
        _id: temp._id,
        title: this.computeTeacherTitle(temp.gender, temp.marital_status),
        name: temp.user_id.name,
        surname: temp.user_id.surname,
        gender: temp.gender,
        marital_status: temp.marital_status,
        contact: temp.user_id.contact,
      });
    }

    return arr;
  }

  // function to compute teacher title
  computeTeacherTitle(gender: string, maritalStatus: string): string {
    if (gender === 'Male') {
      return 'Mr.';
    } else if (gender === 'Female' && maritalStatus === 'Single') {
      return 'Ms.';
    } else {
      return 'Mrs.';
    }
  }

  getClassStudents() {
    this.clasStudentsApi.getAllLearners(0, 0).subscribe({
      next: (data: any) => {
        this.classStudentsCount = data.length.toString();
      },
      error: (error) => {
        this.clasStudentsApi.errorToast(error.toString());
      },
    });
  }

  getSubjectTeachers() {
    this.subjectTeacherApi.getAllSubjectTeachers(0, 0).subscribe({
      next: (data: any) => {
        this.subjectTeachersCount = data.length.toString();
      },
      error: (error) => {
        this.subjectTeacherApi.errorToast(error.toString());
      },
    });
  }

  getClassTeachers() {
    this.classTeacherApi.getAllClassTeachers(0, 0).subscribe({
      next: (data: any) => {
        this.classTeachersCount = data.length.toString();
      },
      error: (error) => {
        this.classTeacherApi.errorToast(error.toString());
      },
    });
  }

  getHOD() {
    this.hodApi.getAllHODs(0, 0).subscribe({
      next: (data: any) => {
        this.hodCount = data.length.toString();
      },
      error: (error) => {
        this.hodApi.errorToast(error.toString());
      },
    });
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
}
