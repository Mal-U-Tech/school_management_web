import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeWhile } from 'rxjs';
import { AttendanceConductService } from 'src/app/shared/attendance-conduct/attendance-conduct.service';
import { IClassTeacher } from 'src/app/shared/class-teacher/class-teacher.interface';
import { IClassname } from 'src/app/shared/classname/classname.interface';
import { ITeacher } from 'src/app/shared/teacher/teacher.interface';
import { IUser } from 'src/app/shared/user/user.interface';
import { selectClassTeachersArray } from 'src/app/store/class-teacher/class-teacher.selector';
import { selectStreamsArray } from 'src/app/store/streams/streams.selector';
import { selectTeacherArray } from 'src/app/store/teacher/teacher.selector';
import { selectUserData } from 'src/app/store/user/user.selector';

@Component({
  selector: 'app-view-classes-conduct',
  templateUrl: './view-classes-conduct.component.html',
  styleUrls: ['./view-classes-conduct.component.scss'],
})
export class ViewClassesConductComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store,
    private router: Router,
    public api: AttendanceConductService,
  ) {}

  ngOnInit(): void {
    this.classes$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (streams: IClassname[]) => {
        if (streams?.length) {
          for (let i = 0; i < streams.length; i++) {
            this.classes.push({
              index: `${i + 1}`,
              _id: streams[i]._id || '',
              stream: streams[i].name,
            });
          }
        }
      },
    });

    this.dataSource.data = this.classes;
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  user$ = this.store.select(selectUserData);
  classTeacher$ = this.store.select(selectClassTeachersArray);
  teachers$ = this.store.select(selectTeacherArray);
  classes$ = this.store.select(selectStreamsArray);
  classes: {
    index: string;
    _id: string;
    stream: string;
  }[] = [];

  displayedColumns: string[] = ['index', 'stream', 'actions'];
  dataSource = new MatTableDataSource<{
    index: string;
    stream: string;
    _id: string;
  }>();
  alive = true;

  reportName = '';
  reportYear = '';

  // function to navigate to add attendance conduct
  addAttendanceConduct(element: {
    index: string;
    stream: string;
    _id: string;
  }) {
    console.log(element);
    // get user_id and check if this user is a class teacher for this class
    this.classTeacher$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (teachers: IClassTeacher[]) => {
        if (teachers?.length) {
          console.log(`Class teachers found.`);
          teachers.forEach((teacher) => {
            if ((teacher.class_id as IClassname)._id === element._id) {
              console.log(`Class teacher found`);
              // class teacher found.
              // check if teacher is current user
              this.teachers$.pipe(takeWhile(() => this.alive)).subscribe({
                next: (data: ITeacher[]) => {
                  if (data?.length) {
                    console.log(`Teachers found`);
                    data.forEach((teach) => {
                      if (
                        teach._id.toString() ===
                        (teacher.teacher_id as ITeacher)._id.toString()
                      ) {
                        console.log(`Teacher found in teachers`);
                        // found class teacher
                        // check if they are the user
                        this.user$.pipe(takeWhile(() => this.alive)).subscribe({
                          next: (user: IUser) => {
                            console.log(teach);
                            console.log(user);
                            if (user._id! === (teach.user_id as IUser)._id!) {
                              console.log(`User id found for teacher`);
                              this.api.selectedClass = {
                                id: (teacher.class_id as IClassname)._id!,
                                name: (teacher.class_id as IClassname).name,
                              }
                              this.router.navigateByUrl(
                                'add-attendance-conduct',
                              );
                            }
                          },
                        });
                      }
                    });
                  }
                },
              });
            }
          });

          // notify user that they are not the class teacher

        }
      },
    });
  }
}
