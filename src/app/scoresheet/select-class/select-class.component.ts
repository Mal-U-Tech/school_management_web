import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeWhile } from 'rxjs';
import { selectUser } from 'src/app/modules/authenticate/store/authenticate.selectors';
import { IPassControls } from 'src/app/pass-controls/models/pass-controls.model';
import { PassControlsComponent } from 'src/app/pass-controls/pass-controls.component';
import { AddSubjectsService } from 'src/app/shared/add-subjects/add-subjects.service';
import { IClassStudent } from 'src/app/shared/class-students/class-students.interface';
import { ClassStudentsService } from 'src/app/shared/class-students/class-students.service';
import { MarksService } from 'src/app/shared/marks/marks.service';
import { IScoresheet } from 'src/app/shared/scoresheet/scoresheet.interface';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';
import { SubjectTeacherService } from 'src/app/shared/subject-teacher/subject-teacher.service';
import { ITeacher } from 'src/app/shared/teacher/teacher.interface';
import {
  getPassControlsByScoresheetRequest,
  passControlsIsLoading,
  resetPassControls,
} from 'src/app/store/pass-controls/pass-control.action';
import {
  selectPassControlIsLoading,
  selectPassControlsArray,
} from 'src/app/store/pass-controls/pass-control.selectors';
import {
  selectChosenScoresheet,
  selectScoresheetIsLoading,
  selectStreamsForScoresheet,
} from 'src/app/store/scoresheet/scoresheet.selector';
import { selectTeacherArray } from 'src/app/store/teacher/teacher.selector';

@Component({
  selector: 'app-select-class',
  templateUrl: './select-class.component.html',
  styleUrls: ['./select-class.component.scss'],
})
export class SelectClassComponent implements OnDestroy {
  constructor(
    public service: ScoresheetService,
    public subjects: AddSubjectsService,
    public subjectTeacher: SubjectTeacherService,
    public router: Router,
    public marksService: MarksService,
    private dialog: MatDialog,
    private classStudentsService: ClassStudentsService,
    private store: Store,
  ) {
    this.title = this.service.name + ' Scoresheet';
    this.loadPassControls();

    // assign year from selected scoresheet
    this.selectedScoresheetId$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IScoresheet) => {
        this.globalSelectedYear = data.year;
        this.globalSelectedScoresheetId = data._id || '';
      },
    });
  }

  teachers$ = this.store.select(selectTeacherArray);
  user$ = this.store.select(selectUser);
  scoresheetStreams$ = this.store.select(selectStreamsForScoresheet);
  passControlsIsLoading$ = this.store.select(selectPassControlIsLoading);
  scoresheetIsLoading$ = this.store.select(selectScoresheetIsLoading);
  passControls$ = this.store.select(selectPassControlsArray);
  selectedScoresheetId$ = this.store.select(selectChosenScoresheet);

  ngOnDestroy(): void {
    this.alive = false;
  }

  // ngAfterViewInit(): void {}

  secondaryRegEx = new RegExp('^Form [1-3].');
  highSchoolRegEx = new RegExp('^Form [4-5].');
  classes: any[] = [];
  selectedClass = 0;
  passControls: IPassControls[] = [];
  // isLoadingPassControls = true;
  isScoresheetLoading = false;
  title = '';
  alive = true;

  globalSelectedYear = '';
  globalSelectedScoresheetId = '';

  setSelectedClass(index: number) {
    this.selectedClass = index;
  }

  nextClass() {
    this.selectedClass++;
  }

  prevClass() {
    this.selectedClass--;
  }

  checkTeacher(subjectId: string, classId: string) {
    let currentUser: any; // JSON.parse(sessionStorage.getItem('user') || '');
    let selectedYear = '';
    this.user$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data) => {
        if (data) {
          currentUser = data;
        }
      },
    });

    // get teacher id from teachers
    // compare the current user's id and the user id from the teachers array for each teacher
    let teacherId = '';
    this.teachers$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: ITeacher[]) => {
        data.forEach((teacher: ITeacher) => {
          if (teacher.user_id._id == currentUser._id) {
            teacherId = teacher._id;
          }
        });
      },
    });

    console.log(currentUser);

    // assign year from selected scoresheet
    this.selectedScoresheetId$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IScoresheet) => {
        selectedYear = data.year;
        this.globalSelectedYear = data.year;
        this.globalSelectedYear = data._id || '';
      },
    });

    this.subjectTeacher
      .getTeacherForSubject(subjectId, teacherId, classId, selectedYear)
      .subscribe({
        next: (data: any) => {
          sessionStorage.setItem(
            'selected-class-scoresheet',
            JSON.stringify(data),
          );

          this.subjectTeacher.successToast('Successfully retrieved students');
          this.router.navigateByUrl('add-marks');
        },
        error: (error) => {
          this.subjectTeacher.errorToast(
            'Please correctly choose the class you teach',
          );
        },
      });
  }

  // function to take user to the full scoresheet view of the class
  viewScoresheet(stream: any) {
    console.log(stream);
    // const selectedStream = this.classes[this.selectedClass];

    this.isScoresheetLoading = true;
    // first get the class students
    this.classStudentsService
      .getAllLearnersByClassYear(stream.class_id, '2023', 0, 0)
      .subscribe({
        next: (data: IClassStudent[]) => {
          sessionStorage.setItem('scoresheet-students', JSON.stringify(data));
        },
        error: (error) => {
          console.log(error);
          this.classStudentsService.errorToast(error);
        },
      });

    const finalSubjectsArray: any[] = [];

    const allSubMarks: any[] = [];

    // set selected scoresheet
    // get subjects marks
    this.selectedScoresheetId$.subscribe({
      next: (data: IScoresheet) => {
        if (data) {
          console.log(`Selected scoresheet:`);
          console.table(data);
          console.table(stream);
          this.marksService
            .getSubjectMarksWithArray(
              data.year,
              data._id || '',
              stream.subjects,
              0,
              7,
            )
            .subscribe({
              next: (res1) => {
                // console.log('I have retrieved marks');
                console.log(res1);
                res1.forEach((dat) => {
                  allSubMarks.push(dat);
                });

                // get the rest of the marks here
                this.marksService
                  .getSubjectMarksWithArray(
                    data.year,
                    data._id || '',
                    stream.subjects,
                    7,
                    stream.subjects.length,
                  )
                  .subscribe({
                    next: (res2) => {
                      console.log(res2);
                      this.isScoresheetLoading = false;
                      res2.forEach((dat) => {
                        allSubMarks.push(dat);
                      });

                      for (let i = 0; i < allSubMarks.length; i++) {
                        const temp = allSubMarks[i];
                        const subjects: any = [];
                        if (temp.length != 0) {
                          temp.forEach((mark: any) => {
                            if (
                              mark.subject_teacher_id.class_id ==
                              stream.class_id
                            ) {
                              subjects.push(mark);
                            }
                          });
                        }

                        const subObj: any = {};
                        subObj[stream.subjects[i].name] = subjects;
                        finalSubjectsArray.push(subObj);
                      }
                      // console.log(finalSubjectsArray);
                      sessionStorage.setItem(
                        'scoresheet-subjects',
                        JSON.stringify(finalSubjectsArray),
                      );
                      this.service.className = stream.name;
                      this.marksService.selectedClass = {
                        class_id: stream.class_id,
                        name: stream.name,
                      };
                      this.router.navigateByUrl('class-scoresheet');
                    },
                    error: (error) => {
                      this.marksService.errorToast(error);
                    },
                  });
              },
              error: (error) => {
                this.isScoresheetLoading = false;
                // console.log(error);
              },
            });
        }
      },
    });
  }

  // function navigate to pass controls
  openPassControls(controls?: IPassControls) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = false;

    if (controls !== undefined) {
      dialogConfig.data = controls;
    }

    const dialog = this.dialog.open(PassControlsComponent, dialogConfig);
    const instance = dialog.componentInstance;

    instance.onCloseDialog.subscribe((value: IPassControls) => {
      dialog.close();
      for (let i = 0; i < this.passControls.length; i++) {
        if (this.passControls[i]._id === value._id) {
          this.passControls[i] = value;
        }
      }
    });
    instance.onConfirmControls.subscribe(() => {
      instance.submitPassControls();
      dialog.close();
    });
  }

  // function to retrieve pass controls for the current scoresheet
  private loadPassControls() {
    this.resetPassControls();
    this.dispatchPassControlsIsLoading(true);

    this.selectedScoresheetId$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IScoresheet) => {
        this.title = data.name + ' Scoresheet';
        this.store.dispatch(
          getPassControlsByScoresheetRequest({ id: data._id || '' }),
        );
      },
    });
  }

  // function to navigate to class marks
  navigateToClassMarks(stream: any) {
    console.log(stream);

    const allSubMarks: any[] = [];
    // first i have to retrieve the marks data
    // get subjects marks
    this.marksService
      .getSubjectMarksWithArray(
        this.globalSelectedYear,
        this.globalSelectedScoresheetId,
        stream.subjects,
        0,
        7,
      )
      .subscribe({
        next: (data) => {
          // console.log('I have retrieved marks');
          console.log(data);
          data.forEach((dat) => {
            allSubMarks.push(dat);
          });

          // get the rest of the marks here
          this.marksService
            .getSubjectMarksWithArray(
              this.globalSelectedYear,
              this.globalSelectedScoresheetId,
              stream.subjects,
              7,
              stream.subjects.length,
            )
            .subscribe({
              next: (data) => {
                console.log(data);
                this.isScoresheetLoading = false;
                data.forEach((dat) => {
                  allSubMarks.push(dat);
                });

                const finalArray = this.getClassStudentsAndMarks(
                  allSubMarks,
                  stream,
                );
                console.log(finalArray);
                this.service.className = stream.name;
                this.marksService.selectedClass = {
                  class_id: stream.class_id,
                  name: stream.name,
                };

                sessionStorage.setItem(
                  'class-marks',
                  JSON.stringify(finalArray),
                );
                this.router.navigateByUrl('class-marks');
              },
              error: (error) => {
                this.marksService.errorToast(error);
              },
            });
        },
        error: (error) => {
          this.marksService.errorToast(error);
        },
      });
  }

  // function to get class marks and students
  getClassStudentsAndMarks(allSubMarks: any[], selectedStream: any) {
    const finalSubjectsArray: any[] = [];
    for (let i = 0; i < allSubMarks.length; i++) {
      const temp = allSubMarks[i];
      const subjects: any = [];
      if (temp.length != 0) {
        temp.forEach((mark: any) => {
          if (mark.subject_teacher_id.class_id == selectedStream.class_id) {
            subjects.push(mark);
          }
        });
      }

      const subObj: any = {};
      subObj[selectedStream.subjects[i].name] = subjects;
      finalSubjectsArray.push(subObj);
    }

    return finalSubjectsArray;
  }

  // function to reset pass controls
  resetPassControls() {
    this.store.dispatch(resetPassControls());
  }

  // function to dispacth loading pass controls
  dispatchPassControlsIsLoading(state: boolean) {
    this.store.dispatch(passControlsIsLoading({ isLoading: state }));
  }
}
