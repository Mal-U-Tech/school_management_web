import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
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
export class AcademicsComponent {
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Overview', cols: 1, rows: 1 },
          { title: 'Streams', cols: 1, rows: 1 },
          { title: 'Departments', cols: 1, rows: 1 },
          { title: 'Subjects', cols: 1, rows: 1 },
          { title: 'Teachers', cols: 1, rows: 1 },
          { title: 'Class Students', cols: 1, rows: 1 },
          { title: 'Subject Teachers', cols: 1, rows: 1 },
          { title: 'Teachers', cols: 1, rows: 1 },
          { title: 'Head of Departments', cols: 1, rows: 1 },
          { title: 'Committees', cols: 1, rows: 1 },
        ];
      }

      return [
        { title: 'Overview', cols: 2, rows: 1 },
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
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private api: ClassnameApiService,
    private subjectsApi: AddSubjectsService,
    private deptApi: AddDepartmentsService,
    private teacherApi: TeacherService,
    private clasStudentsApi: ClassStudentsService,
    private subjectTeacherApi: SubjectTeacherService,
    private classTeacherApi: ClassTeacherService,
    private hodApi: HodService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getStreams();
    this.getSubjects();
    this.getDepartments();
    this.getTeachers();
    this.getClassStudents();
    this.getSubjectTeachers();
    this.getClassTeachers();
    this.getHOD();
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

  getStreams() {
    this.api.viewAllClasses(0, 0).subscribe({
      next: (data: any) => {
        this.classStreams = data;
        sessionStorage.setItem('streams', JSON.stringify(data));
        this.streamsCount = data.length.toString();
      },
      error: (err) => {
        this.api.errorToast(err.toString());
      },
    });
  }

  getSubjects() {
    this.subjectsApi.getAllSubjects(0, 0).subscribe({
      next: (data: any) => {
        this.subjectCount = data.length.toString();
        sessionStorage.setItem('subjects', JSON.stringify(data));
        this.subjectsApi.assignSubjectsToLevels(data);
      },
      error: (err) => {
        this.subjectsApi.errorToast(err.toString());
      },
    });
  }

  getDepartments() {
    this.deptApi.viewAllDepartments(0, 0).subscribe({
      next: (data: any) => {
        this.deptCount = data.length.toString();
        sessionStorage.setItem('departments', JSON.stringify(data));
      },
      error: (err) => {
        this.deptApi.errorToast(err.toString());
      },
    });
  }

  getTeachers() {
    this.teacherApi.getAllTeachers(0, 0).subscribe({
      next: (data: any) => {
        this.teacherCount = data.length.toString();

        // compute teacher title and store in session storage
        sessionStorage.setItem(
          'teachers',
          JSON.stringify(this.assignTeacherTitles(data))
        );
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
