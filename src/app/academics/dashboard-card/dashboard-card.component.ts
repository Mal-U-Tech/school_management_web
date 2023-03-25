import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddDepartmentsComponent } from 'src/app/add-departments/add-departments.component';
import { AddSubjectsComponent } from 'src/app/add-subjects/add-subjects.component';
import { ClassnameComponent } from 'src/app/classname/classname.component';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss'],
})
export class DashboardCardComponent {
  constructor(public dialog: MatDialog) {}
  @Input() title = '';
  @Input() section = '';
  @Input() index: number = 0;
  @Input() streamsCount: string = '0';
  @Input() subjectCount: string = '0';
  @Input() deptCount: string = '0';

  dialogRef: any;
  instance: any;
  numberOfItems = [
    '0',
    this.streamsCount,
    this.subjectCount,
    this.deptCount,
    '0',
    '0',
    '0',
    '0',
    '0',
    '0',
  ];

  openDialog(component: string): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.closeOnNavigation = true;
    dialogConfig.width = '45%';
    dialogConfig.height = '80%';
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
        }, 3000);
      });

      this.dialogRef.afterClosed().subscribe((result: any) => {
        console.log(`Dialog result: ${this.instance.classNames[0].name}`);
      });
    } else if (component == 'AddSubjectsComponent') {
      dialogConfig.width = '65%';
      dialogConfig.height = '80%';
      this.dialogRef = this.dialog.open(AddSubjectsComponent, dialogConfig);
      this.instance = this.dialogRef.componentInstance;

      this.instance.onClose.subscribe(() => {
        this.dialogRef.close();
      });

      this.instance.onSubmit.subscribe(() => {
        console.log('Submitting subjects to api.');
        console.log(
          `These are the current elements ${this.instance.elements[0].dept_name}`
        );
        this.instance.addSubjects();
        setTimeout(() => {
          if (this.instance.res == 1) {
            this.numberOfItems[2] = (
              Number(this.numberOfItems[2]) + 1
            ).toString();
          }
        }, 2000);
      });
    } else if (component == 'AddDepartmentsComponent') {
      dialogConfig.width = '65%';
      dialogConfig.height = '80%';
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
        });
      });
    }
  }

  navLinks = [
    { add: '', view: '' },
    { add: 'ClassnameComponent', view: '../view-streams' },
    { add: 'AddSubjectsComponent', view: '../view-subjects' },
    { add: 'AddDepartmentsComponent', view: '../view-depts' },
    { add: '', view: '' },
    { add: '', view: '' },
    { add: '', view: '' },
    { add: '', view: '' },
    { add: '', view: '' },
    { add: '', view: '' },
  ];

  warnColor = 'red';
  greyColor = 'grey';
  blackColor = 'black';
  whiteColor = 'white';

  ngOnChanges(changes: SimpleChanges) {
    console.log(`${changes['deptCount']}`);
    if (changes['streamsCount'].currentValue != '0') {
      this.numberOfItems[1] = changes['streamsCount'].currentValue;
    }

    if (changes['subjectCount'].currentValue != '0') {
      this.numberOfItems[2] = changes['subjectCount'].currentValue;
    }

    if (changes['deptCount'].currentValue != '0') {
      console.log(
        `This is departments count: ${changes['deptCount'].currentValue}`
      );
      this.numberOfItems[3] = changes['deptCount'].currentValue;
    }
  }

  // constructor(private breakpointObserver: BreakpointObserver){}
  //
  // items = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map({ matches }) => {
  //   if(matches){
  //     return
  //   }
  // });
  //

  // function to get number of streams registered
  //
}
