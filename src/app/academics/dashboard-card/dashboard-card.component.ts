import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { takeWhile } from 'rxjs';
import { AddDepartmentsComponent } from 'src/app/add-departments/add-departments.component';
import { AddSubjectsComponent } from 'src/app/add-subjects/add-subjects.component';
import { ClassStudentsComponent } from 'src/app/class-students/class-students.component';
import { ClassTeacherComponent } from 'src/app/class-teacher/class-teacher.component';
import { ClassnameComponent } from 'src/app/classname/classname.component';
import { HeadOfDeptsComponent } from 'src/app/head-of-depts/head-of-depts.component';
import { IDepartments } from 'src/app/shared/add-departments/add-departments.interface';
import { ISubjects } from 'src/app/shared/add-subjects/add-subjects.interface';
import { IClassStudent } from 'src/app/shared/class-students/class-students.interface';
import { IClassTeacher } from 'src/app/shared/class-teacher/class-teacher.interface';
import { IClassname } from 'src/app/shared/classname/classname.interface';
import { IHOD } from 'src/app/shared/hod/hod.interface';
import { ISubjectTeacher } from 'src/app/shared/subject-teacher/subject-teacher.interface';
import { ITeacher } from 'src/app/shared/teacher/teacher.interface';
import { UserApiService } from 'src/app/shared/user/user-api.service';
import { selectClassStudentArray } from 'src/app/store/class-students/class-students.selectors';
import { selectClassTeachersArray } from 'src/app/store/class-teacher/class-teacher.selector';
import { selectDepartmentsArray } from 'src/app/store/departments/departments.selector';
import { selectHodsArray } from 'src/app/store/hod/hod.selectors';
import { selectStreamsArray } from 'src/app/store/streams/streams.selector';
import { selectSubjectTeachersArray } from 'src/app/store/subject-teachers/subject-teachers.selectors';
import { selectSubjectsArray } from 'src/app/store/subjects/subjects.selector';
import { selectTeacherArray } from 'src/app/store/teacher/teacher.selector';
import { SubjectTeacherComponent } from 'src/app/subject-teacher/subject-teacher.component';
import { TeacherComponent } from 'src/app/teacher/teacher.component';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss'],
})
export class DashboardCardComponent
  implements AfterViewInit, /*OnChanges*/ OnDestroy
{
  constructor(
    public dialog: MatDialog,
    private api: UserApiService,
    private store: Store
  ) {}
  @Input() title = '';
  @Input() section = '';
  @Input() index = 0;
  @Input() streamsCount = '0';
  @Input() subjectCount = '0';
  @Input() deptCount = '0';
  @Input() teacherCount = '0';
  @Input() classStudentsCount = '0';
  @Input() subjectTeachersCount = '0';
  @Input() classTeachersCount = '0';
  @Input() hodCount = '0';

  public streams$ = this.store.select(selectStreamsArray);
  public departments$ = this.store.select(selectDepartmentsArray);
  public subjects$ = this.store.select(selectSubjectsArray);
  public teachers$ = this.store.select(selectTeacherArray);
  public classStudents$ = this.store.select(selectClassStudentArray);
  public subjectTeacher$ = this.store.select(selectSubjectTeachersArray);
  public classTeachers$ = this.store.select(selectClassTeachersArray);
  public hods$ = this.store.select(selectHodsArray);

  // streams variable to add in class students component
  streams: IClassname[] = [];
  alive = true;

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngAfterViewInit(): void {
    this.streams$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IClassname[]) => {
        if (data?.length) {
          this.numberOfItems[1] = data.length.toString();
          this.streams = data;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.departments$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IDepartments[]) => {
        console.log(data);
        if (data?.length) {
          this.numberOfItems[2] = data.length.toString();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.subjects$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: ISubjects[]) => {
        if (data?.length) {
          console.log(`Subjects data: ${data.length}`);
          this.numberOfItems[3] = data.length.toString();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.teachers$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: ITeacher[]) => {
        if (data?.length) {
          console.log(`Teachers data: ${data.length}`);
          this.numberOfItems[4] = data.length.toString();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.classStudents$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IClassStudent[]) => {
        if (data?.length) {
          console.log(`Class Students data: ${data.length}`);
          this.numberOfItems[5] = data.length.toString();
        }
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.subjectTeacher$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: ISubjectTeacher[]) => {
        if (data?.length) {
          {
            console.log(`Subject teachers data: ${data.length}`);
            this.numberOfItems[6] = data.length.toString();
          }
        }
      },
      error: (error) => {
        console.log(error);
      },
    });

    this.classTeachers$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IClassTeacher[]) => {
        if (data?.length) {
          console.log(`Class Teachers data: ${data.length}`);
          this.numberOfItems[7] = data.length.toString();
        }
      },
    });

    this.hods$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IHOD[]) => {
        if(data?.length){
          console.log(`Hod's data: ${data.length}`)
          this.numberOfItems[8] = data.length.toString();
        }
      }
    })
  }

  dialogRef: any;
  instance: any;
  numberOfItems = [
    '0',
    this.streamsCount,
    this.deptCount,
    this.subjectCount,
    this.teacherCount,
    this.classStudentsCount,
    this.subjectTeachersCount,
    this.classTeachersCount,
    this.hodCount,
    '0',
  ];

  openDialog(component: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '50%';

    if (component == 'ClassnameComponent') {
      this.buildAddStreamsDialog(dialogConfig);
    } else if (component == 'AddSubjectsComponent') {
      this.buildAddSubjectsDialog(dialogConfig);
    } else if (component == 'AddDepartmentsComponent') {
      this.buildAddDepartmentsDialog(dialogConfig);
    } else if (component == 'AddTeacherComponent') {
      this.buildAddTeacherDialog(dialogConfig);
    } else if (component == 'AddClassStudentComponent') {
      this.buidAddClassStudentsDialog(dialogConfig);
    } else if (component == 'AddSubjectTeacherComponent') {
      this.buildAddSubjectTeacherDialog(dialogConfig);
    } else if (component == 'AddClassTeachersComponent') {
      this.buildAddClassTeacherDialog(dialogConfig);
    } else if (component == 'AddHODComponent') {
      this.buildAddHODDialog(dialogConfig);
    }
  }

  // function to build streams dialog
  buildAddStreamsDialog(dialogConfig: MatDialogConfig) {

this.dialogRef = this.dialog.open(ClassnameComponent, dialogConfig);
      this.instance = this.dialogRef.componentInstance;

      this.instance.onClose.subscribe(() => {
        this.dialogRef.close();
      });

      this.instance.onSubmit.subscribe(() => {
        this.instance.Geeks();
        this.dialogRef.close();
      });
  }

  // function to build subjects dialog
  buildAddSubjectsDialog(dialogConfig: MatDialogConfig) {

this.dialogRef = this.dialog.open(AddSubjectsComponent, dialogConfig);
      this.instance = this.dialogRef.componentInstance;

      this.instance.onClose.subscribe(() => {
        this.dialogRef.close();
      });

      this.instance.onSubmit.subscribe(() => {
        this.instance.addSubjects();
        this.dialogRef.close();
      });
  }

  // function to build departments dialog
  buildAddDepartmentsDialog(dialogConfig: MatDialogConfig) {
 this.dialogRef = this.dialog.open(AddDepartmentsComponent, dialogConfig);
      this.instance = this.dialogRef.componentInstance;

      this.instance.onClose.subscribe(() => {
        this.dialogRef.close();
      });

      this.instance.onSubmit.subscribe(() => {
        this.instance.submitDepartments();
        this.dialogRef.close();
      });
  }

  // function to build add teacher dialog
  buildAddTeacherDialog(dialogConfig: MatDialogConfig) {
    this.dialogRef = this.dialog.open(TeacherComponent, dialogConfig);
    this.instance = this.dialogRef.componentInstance;

    this.instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    this.instance.onSubmit.subscribe(() => {
      this.instance.saveTeacher();
      this.dialogRef.close();
    });
  }

  // function to build add class students dialog
  buidAddClassStudentsDialog(dialogConfig: MatDialogConfig) {
    dialogConfig.data = this.streams;
    this.dialogRef = this.dialog.open(ClassStudentsComponent, dialogConfig);

    this.instance = this.dialogRef.componentInstance;

    this.instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    this.instance.onSubmit.subscribe(() => {
      this.instance.saveClassStudent();
      this.dialogRef.close();
    });

    this.instance.onConfirmAddByExcel.subscribe(() => {
      this.dialogRef.close();
    });
  }

  // function to build add subject teacher dialog
  buildAddSubjectTeacherDialog(dialogConfig: MatDialogConfig) {
    this.dialogRef = this.dialog.open(SubjectTeacherComponent, dialogConfig);
    this.instance = this.dialogRef.componentInstance;

    this.instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    this.instance.onSubmit.subscribe(() => {
      this.instance.saveSubjectTeacher();
      this.dialogRef.close();
    });
  }

  // function to build add class teacher dialog
  buildAddClassTeacherDialog(dialogConfig: MatDialogConfig) {
    this.dialogRef = this.dialog.open(ClassTeacherComponent, dialogConfig);
    this.instance = this.dialogRef.componentInstance;

    this.instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    this.instance.onSubmit.subscribe(() => {
      this.instance.saveClassTeacher();
      this.dialogRef.close();
    });
  }

  // function to build add HOD dialog
  buildAddHODDialog(dialogConfig: MatDialogConfig) {
    this.dialogRef = this.dialog.open(HeadOfDeptsComponent, dialogConfig);
    this.instance = this.dialogRef.componentInstance;

    this.instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    this.instance.onSubmit.subscribe(() => {
      this.instance.saveHOD();
      this.dialogRef.close();
    });
  }

  navLinks = [
    { add: '', view: '' },
    { add: 'ClassnameComponent', view: '../view-streams' },
    { add: 'AddDepartmentsComponent', view: '../view-depts' },
    { add: 'AddSubjectsComponent', view: '../view-subjects' },
    { add: 'AddTeacherComponent', view: '../view-teachers' },
    { add: 'AddClassStudentComponent', view: '../view-class-students' },
    { add: 'AddSubjectTeacherComponent', view: '../view-subject-teachers' },
    { add: 'AddClassTeachersComponent', view: '../view-class-teachers' },
    { add: 'AddHODComponent', view: '../view-hods' },
    { add: '', view: '' },
  ];

  warnColor = 'red';
  greyColor = 'grey';
  blackColor = 'black';
  whiteColor = 'white';


  comingSoon() {
    this.api.successToast('Comming Soon');
  }
}
