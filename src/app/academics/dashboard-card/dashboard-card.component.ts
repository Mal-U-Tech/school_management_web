import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { AddDepartmentsComponent } from 'src/app/add-departments/add-departments.component';
import { AddSubjectsComponent } from 'src/app/add-subjects/add-subjects.component';
import { ClassStudentsComponent } from 'src/app/class-students/class-students.component';
import { ClassTeacherComponent } from 'src/app/class-teacher/class-teacher.component';
import { ClassnameComponent } from 'src/app/classname/classname.component';
import { HeadOfDeptsComponent } from 'src/app/head-of-depts/head-of-depts.component';
import { IDepartments } from 'src/app/shared/add-departments/add-departments.interface';
import { ISubjects } from 'src/app/shared/add-subjects/add-subjects.interface';
import { IClassname } from 'src/app/shared/classname/classname.interface';
import { UserApiService } from 'src/app/shared/user/user-api.service';
import { selectDepartmentsArray } from 'src/app/store/departments/departments.selector';
import { selectStreamsArray } from 'src/app/store/streams/streams.selector';
import { selectSubjectsArray } from 'src/app/store/subjects/subjects.selector';
import { SubjectTeacherComponent } from 'src/app/subject-teacher/subject-teacher.component';
import { TeacherComponent } from 'src/app/teacher/teacher.component';

@UntilDestroy()
@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss'],
})
export class DashboardCardComponent implements AfterViewInit, OnChanges {
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
  @Input() classStreams: any[] = [];
  @Input() subjectTeachersCount = '0';
  @Input() classTeachersCount = '0';
  @Input() hodCount = '0';

  public streams$ = this.store.select(selectStreamsArray);
  public departments$ = this.store.select(selectDepartmentsArray);
  public subjects$ = this.store.select(selectSubjectsArray);

  ngAfterViewInit(): void {
    this.streams$.pipe(untilDestroyed(this)).subscribe((data: IClassname[]) => {
      if (data.length) {
        console.log(data.length);
        this.streamsCount = data.length.toString();
        // console.log('After assigning streamsCount ' + this.streamsCount);
        this.numberOfItems[1] = this.streamsCount;
      }
    });

    this.departments$
      .pipe(untilDestroyed(this))
      .subscribe((data: IDepartments[]) => {
        console.log(data);
        if (data.length) {
          // console.log(`Departments data: ${data.length}`);
          this.deptCount = data.length.toString();
          this.numberOfItems[2] = this.deptCount;
        }
      });

    this.subjects$.pipe(untilDestroyed(this)).subscribe((data: ISubjects[]) => {
      if (data.length) {
        console.log(`Subjects data: ${data.length}`);
        this.subjectCount = data.length.toString();
        this.numberOfItems[3] = this.subjectCount;
      }
    });
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
    dialogConfig.width = '85%';
    // dialogConfig.height = '80%';
    // dialogConfig.data = { name: 'Form 4A' };

    if (component == 'ClassnameComponent') {
      this.dialogRef = this.dialog.open(ClassnameComponent, dialogConfig);
      this.instance = this.dialogRef.componentInstance;

      this.instance.onClose.subscribe(() => {
        this.dialogRef.close();
      });

      this.instance.onSubmit.subscribe(() => {
        this.instance.Geeks();
        setTimeout(() => {
          if (this.instance.res === 1)
            this.numberOfItems[1] = (
              Number(this.numberOfItems[1]) + 1
            ).toString();
        }, 1000);
      });
    } else if (component == 'AddSubjectsComponent') {
      this.dialogRef = this.dialog.open(AddSubjectsComponent, dialogConfig);
      this.instance = this.dialogRef.componentInstance;

      this.instance.onClose.subscribe(() => {
        this.dialogRef.close();
      });

      this.instance.onSubmit.subscribe(() => {
        this.instance.addSubjects();
        setTimeout(() => {
          if (this.instance.res == 1) {
            this.numberOfItems[2] = (
              Number(this.numberOfItems[2]) + 1
            ).toString();
          }
        }, 1000);
      });
    } else if (component == 'AddDepartmentsComponent') {
      this.dialogRef = this.dialog.open(AddDepartmentsComponent, dialogConfig);
      this.instance = this.dialogRef.componentInstance;

      this.instance.onClose.subscribe(() => {
        this.dialogRef.close();
      });

      this.instance.onSubmit.subscribe(() => {
        this.instance.submitDepartments();
        setTimeout(() => {
          if (this.instance.res == 1) {
            this.numberOfItems[3] = (
              Number(this.numberOfItems[3]) + 1
            ).toString();
          }
        }, 1000);
      });
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

  // function to build add teacher dialog
  buildAddTeacherDialog(dialogConfig: MatDialogConfig) {
    this.dialogRef = this.dialog.open(TeacherComponent, dialogConfig);
    this.instance = this.dialogRef.componentInstance;

    this.instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    this.instance.onSubmit.subscribe(() => {
      this.instance.saveTeacher();
      setTimeout(() => {
        if (this.instance.res == 1) {
          this.numberOfItems[4] = (
            Number(this.numberOfItems[4]) + 1
          ).toString();
        }
      }, 1000);
    });
  }

  // function to build add class students dialog
  buidAddClassStudentsDialog(dialogConfig: MatDialogConfig) {
    dialogConfig.data = this.classStreams;
    this.dialogRef = this.dialog.open(ClassStudentsComponent, dialogConfig);
    this.instance = this.dialogRef.componentInstance;

    this.instance.onClose.subscribe(() => {
      this.dialogRef.close();
    });

    this.instance.onSubmit.subscribe(() => {
      this.instance.saveClassStudent();
      setTimeout(() => {
        if (this.instance.res == 1) {
          this.numberOfItems[5] = (
            Number(this.numberOfItems[5]) + 1
          ).toString();
        }
      }, 1000);
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
      setTimeout(() => {
        if (this.instance.res == 1) {
          this.numberOfItems[6] = (
            Number(this.numberOfItems[6]) + 1
          ).toString();
        }
      }, 1000);
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
      setTimeout(() => {
        if (this.instance.res == 1) {
          this.numberOfItems[7] = (
            Number(this.numberOfItems[7]) + 1
          ).toString();
        }
      }, 1000);
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
      setTimeout(() => {
        if (this.instance.res == 1) {
          this.numberOfItems[8] = (
            Number(this.numberOfItems[8]) + 1
          ).toString();
        }
      }, 1000);
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

  ngOnChanges(changes: SimpleChanges) {
    // console.log(`${changes['deptCount']}`);
    try {
      if (changes['streamsCount'].currentValue != '0') {
        this.numberOfItems[1] = changes['streamsCount'].currentValue;
      }
    } catch (error: any) {
      // console.log(`Error while getting streams count: ${error.toString()}`);
    }

    try {
      if (changes['deptCount'].currentValue != '0') {
        this.numberOfItems[2] = changes['deptCount'].currentValue;
      }
    } catch (error: any) {
      // console.log(`Error while getting departments count ${error.toString()}`);
    }

    try {
      if (changes['subjectCount'].currentValue != '0') {
        this.numberOfItems[3] = changes['subjectCount'].currentValue;
      }
    } catch (error: any) {
      // console.log(`Error while getting subjects count: ${error.toString()}`);
    }

    try {
      if (changes['teacherCount'].currentValue != '0') {
        this.numberOfItems[4] = changes['teacherCount'].currentValue;
      }
    } catch (error: any) {
      // console.log(`Error while getting teachers ${error.toString()}`);
    }

    try {
      if (changes['classStudentsCount'].currentValue != '0') {
        this.numberOfItems[5] = changes['classStudentsCount'].currentValue;
      }
    } catch (error: any) {
      // console.log(`Error while getting class students ${error.toString()}`);
    }

    try {
      if (changes['subjectTeachersCount'].currentValue != '0') {
        this.numberOfItems[6] = changes['subjectTeachersCount'].currentValue;
      }
    } catch (error: any) {
      // console.log(`Error while getting subject teachers ${error.toString()}`);
    }

    try {
      if (changes['classTeachersCount'].currentValue != '0') {
        this.numberOfItems[7] = changes['classTeachersCount'].currentValue;
      }
    } catch (error: any) {
      // console.log(`Error while getting class teachers: ${error.toString()}`);
    }

    try {
      if (changes['hodCount'].currentValue != '0') {
        this.numberOfItems[8] = changes['hodCount'].currentValue;
      }
    } catch (error: any) {
      // console.log(`Error while getting HODs: ${error.toString()}`);
    }
  }

  comingSoon() {
    this.api.successToast('Comming Soon');
  }
}
