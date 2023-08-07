import { Location } from '@angular/common';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { takeWhile } from 'rxjs';
import {
  IAttendanceConduct,
  IAttendanceConductPostResponse,
} from 'src/app/shared/attendance-conduct/attendance-conduct.interface';
import { AttendanceConductService } from 'src/app/shared/attendance-conduct/attendance-conduct.service';
import { IClassStudent } from 'src/app/shared/class-students/class-students.interface';
import { selectClassStudentArray } from 'src/app/store/class-students/class-students.selectors';

@Component({
  selector: 'app-add-class-conduct',
  templateUrl: './add-class-conduct.component.html',
  styleUrls: ['./add-class-conduct.component.scss'],
})
export class AddClassConductComponent implements OnDestroy, AfterViewInit {
  constructor(
    private store: Store,
    public api: AttendanceConductService,
    private location: Location,
  ) {
    this.learners$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IClassStudent[]) => {
        if (data?.length) {
          console.log(data);
          console.log(this.api.selectedClass.id);
          const arr: {
            index: string;
            _id: string;
            student: string;
            attendance: string;
            conduct: string;
            comment: string;
          }[] = [];
          for (let i = 0; i < data.length; i++) {
            if (this.api.selectedClass.id === data[i].class_id) {
              console.log('in here');
              arr.push({
                index: `${i + 1}`,
                _id: data[i]._id || '',
                student: data[i].name + ' ' + data[i].surname,
                attendance: '',
                conduct: '',
                comment: '',
              });
            }
          }

          this.dataSource.data = arr;
        }
      },
    });
  }

  dataSource = new MatTableDataSource<{
    index: string;
    _id: string;
    student: any;
    attendance: string;
    conduct: string;
    comment: string;
  }>();
  alive = true;
  displayedColumns: string[] = [
    'index',
    'student',
    'attendance',
    'conduct',
    'comment',
  ];
  conductOptions: string[] = ['Very Good', 'Good', 'Improving', 'Bad'];

  learners$ = this.store.select(selectClassStudentArray);

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngAfterViewInit(): void {
    console.log('Add class conduct after view init');
    this.load();
  }

  // function to load class attendance records
  load() {
    this.api
      .getAttendanceReportClass(
        this.api.selectedReport.id,
        this.api.selectedClass.id,
      )
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (data: IAttendanceConduct[]) => {
          if (data?.length) {
            // data is present
            // add the data to the dataSource
            const arr: {
              index: string;
              _id: string;
              student: any;
              attendance: string;
              conduct: string;
              comment: string;
            }[] = [];

            // go through each data record and push to arr
            let j = 0;
            data.forEach((conduct) => {
              arr.push({
                index: `${j + 1}`,
                _id: (conduct.student as IClassStudent)._id || '',
                student:
                  (conduct.student as IClassStudent).name +
                  ' ' +
                  (conduct.student as IClassStudent).surname,
                attendance: conduct.attendance,
                conduct: conduct.conduct,
                comment: conduct.comment,
              });
              j++;
            });

            // add data to dataSource
            this.dataSource.data = arr;
          } else {
            // data is not present
            // do nothing
          }
        },
      });
  }

  postClassAttendance() {
    console.log(this.dataSource.data);
    const body: IAttendanceConduct[] = [];

    this.dataSource.data.forEach((dat) => {
      body.push({
        report: this.api.selectedReport.id,
        classname: this.api.selectedClass.id,
        student: dat._id,
        attendance: dat.attendance,
        conduct: dat.conduct,
        comment: dat.comment,
      });
    });

    this.api
      .postAttendance(body)
      .pipe(takeWhile(() => this.alive))
      .subscribe({
        next: (data: IAttendanceConductPostResponse) => {
          this.api.successToast(data.message);
          this.location.back();
        },
        error: (err) => {
          this.api.errorToast(err.toString());
        },
      });
  }
}
