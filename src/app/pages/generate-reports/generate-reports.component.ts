import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { concatMap, from, Observable, of, takeWhile } from 'rxjs';
import { ReportExcel } from 'src/app/OOP/classes/report-excel';
import { ISubjects } from 'src/app/shared/add-subjects/add-subjects.interface';
import { IAttendanceConduct } from 'src/app/shared/attendance-conduct/attendance-conduct.interface';
import { AttendanceConductService } from 'src/app/shared/attendance-conduct/attendance-conduct.service';
import { IClassStudent } from 'src/app/shared/class-students/class-students.interface';
import { IClassTeacher } from 'src/app/shared/class-teacher/class-teacher.interface';
import { IClassname } from 'src/app/shared/classname/classname.interface';
import { IMarks } from 'src/app/shared/marks/marks.interface';
import { MarksService } from 'src/app/shared/marks/marks.service';
import {
  IReports,
  IReportsCriteria,
  IReportsData,
} from 'src/app/shared/reports/reports.interface';
import { IScoresheet } from 'src/app/shared/scoresheet/scoresheet.interface';
import { ISubjectTeacher } from 'src/app/shared/subject-teacher/subject-teacher.interface';
import { ITeacher } from 'src/app/shared/teacher/teacher.interface';
import { TeacherService } from 'src/app/shared/teacher/teacher.service';
import { IUser } from 'src/app/shared/user/user.interface';
import { selectClassStudentArray } from 'src/app/store/class-students/class-students.selectors';
import { selectClassTeachersArray } from 'src/app/store/class-teacher/class-teacher.selector';
import { selectChosenReport } from 'src/app/store/reports/reports.selector';
import {
  selectHighSchoolSubjects,
  selectSecondarySubjects,
  selectSubjectsArray,
} from 'src/app/store/subjects/subjects.selector';

@Component({
  selector: 'app-generate-reports',
  templateUrl: './generate-reports.component.html',
  styleUrls: ['./generate-reports.component.scss'],
})
export class GenerateReportsComponent implements OnDestroy, AfterViewInit {
  constructor(
    private store: Store,
    private marksApi: MarksService,
    private teacherService: TeacherService,
    private attendanceApi: AttendanceConductService,
  ) {}

  private secondaryRegEx = new RegExp('^Form [1-3].');
  private highSchoolRegEx = new RegExp('^Form [4-5].');
  classTeachers: string[] = [];
  secondarySubs: ISubjects[] = [];
  highSchoolSubs: ISubjects[] = [];
  alive = true;
  report$ = this.store.select(selectChosenReport);
  classStudents$ = this.store.select(selectClassStudentArray);
  classTeachers$ = this.store.select(selectClassTeachersArray);
  allClassesReports: IReportsData[] = [];
  subjects$ = this.store.select(selectSubjectsArray);
  secondarySubjects$ = this.store.select(selectSecondarySubjects);
  highSchoolSubjects$ = this.store.select(selectHighSchoolSubjects);

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngAfterViewInit(): void {
    this.secondarySubjects$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: ISubjects[]) => {
        if (data?.length) {
          this.secondarySubs = data;
        }
      },
    });

    this.highSchoolSubjects$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: ISubjects[]) => {
        if (data?.length) {
          this.highSchoolSubs = data;
        }
      },
    });
  }

  // function to update report instance
  updateReportInstance() {
    console.log('Updating report instance');
  }

  // function to delete report instance
  deleteReportInstance() {
    console.log('Deleting report instance');
  }

  // function to initiate the generation and computation of reports
  async generateReports() {
    this.allClassesReports = [];
    this.classTeachers = [];
    console.log('Generating reports now');
    let report: IReports = null as any;
    let learners: IClassStudent[] = [];
    const classes = [];
    // let reportName = '';
    // let scoresheetsWrapper: any[][] = [];
    // let numStudents = 0;
    // let classTeacher = '';

    // get report instance meta-data
    this.report$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IReports) => {
        if (data) {
          console.log(data);
          report = data;
        }
      },
    });

    // get learners for the class in question
    report.criteria.forEach((crit) => {
      for (let i = 0; i < crit.classes.length; i++) {
        const temp = crit.classes[i];

        // set class information
        this.allClassesReports.push({
          classname: temp,
          learners: [],
        });

        // set learners for each class
        learners = this.getClassLearners(temp);

        console.log(this.getClassTeacher(temp));
        this.classTeachers.push(this.getClassTeacher(temp));
        learners.forEach((learner) => {
          this.allClassesReports[i].learners.push({
            reportInfo: {
              PASSFAIL: '',
              Class_Teacher: '',
              School_Reopens: '',
              id: learner._id || '',
              Name: learner.name + ' ' + learner.surname,
              Form: temp.name,
              Term: report.name,
              POSITION_in_Class: '',
              Num_of_Students: '',
              AGGREGATE: '',
              CLASS_AVERAGE: '',
              Num_of_Pass: '',
              Eng_PF: '',
              Attendance: '',
              Total_Days: '',
              Conduct: '',
              Class_teacher_s_remark: '',
              Head_teachers_remark: '',
              Staff_Resolution: '',
            },
            subjects: null as any,
          });
        });
      }
    });

    // assing subjects to students
    await this.assignSubjectsToLearners();

    // get scoresheet and assign learners marks
    await this.getLearnersMarks(report);

    // for await (const crit of report.criteria) {
    //   // loop through classes
    //   // let m = 0;
    //   const marks = [];
    //   let m = 0;
    //   for await (const stream of crit.classes) {
    //     // const stream = crit.classes[m];
    //     console.log(`Getting marks for ${stream.name}`);
    //     console.log('First');
    //
    //     let sheetIndex = 0;
    //     for await (const scoresheet of crit.scoresheets) {
    //       console.log(`For ${scoresheet.name} scoresheet`);
    //
    //
    //          this.getLearnerMarksByClassScoresheet(
    //           stream,
    //           scoresheet,
    //           sheetIndex,
    //           report,
    //         );
    //
    //       sheetIndex++;
    //     }
    //     of(marks).pipe(
    //       concatMap((val) => {
    //         return of(val);
    //       }),
    //     ).subscribe({
    //         next: (data) => {
    //           // get attendance and conduct for the class
    //
    //           m++;
    //         }
    //       });
    //   }
    // }


    // console.log(this.allClassesReports);

    // assign scoresheets marks to the allClassesReports values for each subject
    // this.assignScoresheetMarksToSubjects(
    //   scoresheetsWrapper,
    //   report.criteria[0],
    // );

    // get reports name
    // reportName = report.name;

    console.log(this.classTeachers);
    // let j = 0;
    // setTimeout(() => {
    //   this.allClassesReports.forEach((stream) => {
    //     const teacher = this.classTeachers[j];
    //
    //
    //
    //     j++;
    //   });
    // }, 1000);
  }

  // function to get class learners
  getClassLearners(stream: IClassname) {
    const learners: IClassStudent[] = [];

    this.classStudents$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IClassStudent[]) => {
        if (data?.length) {
          // get learners for the class
          data.forEach((learner) => {
            if (learner.class_id === stream._id || '') {
              learners.push(learner);
            }
          });
        }
      },
    });

    return learners;
  }

  // function to get class teacher
  getClassTeacher(stream: IClassname) {
    let teach: IClassTeacher = null as any;
    this.classTeachers$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IClassTeacher[]) => {
        if (data?.length) {
          data.forEach((teacher) => {
            if (
              (teacher.class_id as IClassname)._id! === stream._id ||
              ''
            ) {
              teach = teacher;
            }
          });
        }
      },
    });
    console.log(teach);

    const user = (teach.teacher_id as ITeacher).user_id as IUser;
    return (
      this.teacherService.computeTeacherTitle(
        (teach.teacher_id as ITeacher).gender,
        (teach.teacher_id as ITeacher).marital_status,
      ) +
      ' ' +
      user.name.substring(0, 1) +
      '. ' +
      user.surname
    );
  }

  // function to get learners marks separately using classes and scoresheet
  async getLearnerMarksByClassScoresheet(
    stream: IClassname,
    scoresheetId: IScoresheet,
    sheetIndex: number,
    report: IReports,
  ) {
    let subs: ISubjects[] = [];
    let allMarks: any[] = [];
    // find out if the classes if secondary or high school
    if (this.secondaryRegEx.test(stream.name)) {
      subs = this.secondarySubs;
    } else {
      subs = this.highSchoolSubs;
    }


    // for the selected stream, get the scoresheet marks and store them
    this.marksApi
      .getSubjectMarksWithArray(
        scoresheetId.year,
        scoresheetId._id!,
        subs,
        0,
        5,
      )
      .subscribe({
        next: (data) => {
          allMarks = data;

          // get the next batch of marks for the subjects
          this.marksApi
            .getSubjectMarksWithArray(
              scoresheetId.year,
              scoresheetId._id!,
              subs,
              6,
              subs.length,
            )
            .subscribe({
              next: (data2) => {
                data2.forEach((item) => allMarks.push(item));

                console.log(
                  `Here is all marks for the class ${stream.name} for scoresheet ${scoresheetId.name}`,
                );
                console.log(allMarks);

                this.setMarksToStream(stream, allMarks, sheetIndex, report);
              },
            });
        },
      });
  }

  // function to assign marks to class learners
  async setMarksToStream(
    stream: IClassname,
    marks: any,
    sheetIndex: number,
    report: IReports,
  ) {
    // find the class in allClassesReports array and add them to the correct learners

    for (let i = 0; i < this.allClassesReports.length; i++) {
      const className = this.allClassesReports[i];
      if (className.classname._id || '' === stream._id || '') {
        // console.log(`Here is the class ${className.classname.name}`);
        // found the class
        // now loop through the marks in each subject and find out who the learner is
        marks.forEach((mark: IMarks[]) => {
          // now I have a subjec marks on hand
          // loop through every mark
          mark.forEach((score: IMarks) => {
            // loop through the learners in the classname
            className.learners.forEach((learner) => {
              // console.log(score);
              if (score.class_student_id !== null) {
                if (
                  (score.class_student_id as IClassStudent)._id ===
                  learner.reportInfo.id
                ) {
                  // console.log(`Learner has been found`);

                  // now find the subject in the learner that the mark belongs to
                  learner.subjects.forEach((subject) => {
                    if (
                      score.subject_id.toString() ===
                      subject.name._id?.toString()
                    ) {
                      // found the subject
                      // append mark
                      const calMark = Math.round(
                        (Number.parseInt(score.mark) / score.max_score) * 100,
                      );
                      // console.log(calMark + ' '+ score.mark);

                      if (!isNaN(calMark)) {
                        if (subject.marks.first === '' && sheetIndex === 0) {
                          subject.marks.first = calMark.toString();
                        } else if (
                          subject.marks.second === '' &&
                          sheetIndex === 1
                        ) {
                          subject.marks.second = calMark.toString();
                        } else if (
                          subject.marks.third === '' &&
                          sheetIndex === 2
                        ) {
                          subject.marks.third = calMark.toString();
                        } else if (
                          subject.marks.fourth === '' &&
                          sheetIndex === 3
                        ) {
                          subject.marks.fourth = calMark.toString();
                        }

                        // add subject teacher
                        const tempUser: IUser = (
                          (score.subject_teacher_id as ISubjectTeacher)
                            .teacher_id as ITeacher
                        ).user_id as IUser;
                        const tempTeacher: ITeacher = (
                          score.subject_teacher_id as ISubjectTeacher
                        ).teacher_id as ITeacher;
                        subject.marks.teacher =
                          this.teacherService.computeTeacherTitle(
                            tempTeacher.gender,
                            tempTeacher.marital_status,
                          ) +
                          ' ' +
                          tempUser.name +
                          ' ' +
                          tempUser.surname;
                      }
                    }
                  });
                }
              }
            });
          });
        });
      } else {
        console.log('Could not find class');
      }
    }
  }

  // function to get learners marks from scoresheets
  async getLearnersMarks(report: IReports) {
    // const scoresheetsWrapper: any[][] = [];
    //
    // get marks per class per scoresheet
    const api = this.marksApi;

    console.log(report);
    report.criteria.forEach((crit) => {
      console.log(crit);
      for (let i = 0; i < crit.scoresheets.length; i++) {
        const temp = crit.scoresheets[i];

        console.log(temp.name);
        // get scoresheet foreach class at a time and store in global array
        for (let k = 0; k < 1; k++) {
          const stream = crit.classes[k];
          console.log(stream.name);
          const sheetMarks: any[] = [];
          // let subs = [];
          if (this.secondaryRegEx.test(stream.name)) {
            this.secondarySubjects$
              .pipe(takeWhile(() => this.alive))
              .subscribe({
                next: (secondarySubs: ISubjects[]) => {
                  // console.log(secondarySubs);

                  if (secondarySubs?.length) {
                    console.log(secondarySubs);
                    api
                      .getSubjectMarksWithArray(
                        temp.year,
                        temp._id || '',
                        secondarySubs,
                        0,
                        6,
                      )
                      .subscribe({
                        next: (firstMarks) => {
                          if (firstMarks?.length) {
                            // add marks to array
                            firstMarks.forEach((first: any) => {
                              sheetMarks.push(first);
                            });

                            this.marksApi
                              .getSubjectMarksWithArray(
                                temp.year,
                                temp._id || '',
                                secondarySubs,
                                7,
                                secondarySubs.length,
                              )
                              .subscribe((secondMarks) => {
                                if (secondMarks?.length) {
                                  secondMarks.forEach((second: any) => {
                                    sheetMarks.push(second);
                                  });

                                  sheetMarks.forEach((marks) => {
                                    console.log(`${marks}`);
                                    marks.forEach((mark: IMarks) => {
                                      this.allClassesReports.forEach(
                                        (stream) => {
                                          // console.log(stream);
                                          if (
                                            (
                                              mark.subject_teacher_id as ISubjectTeacher
                                            ).class_id === stream.classname._id!
                                          ) {
                                            // the mark belongs to the class
                                            // check who the mark belongs to
                                            console.log(stream);
                                            stream.learners.forEach(
                                              (learner) => {
                                                // console.log(mark.class_student_id);
                                                if (
                                                  mark.class_student_id !== null
                                                ) {
                                                  // console.log(
                                                  //   `Mark student_id: ${mark.class_student_id} Learner id: ${learner.reportInfo.id}`,
                                                  // );
                                                  if (
                                                    (
                                                      mark.class_student_id as IClassStudent
                                                    )._id ===
                                                    learner.reportInfo.id
                                                  ) {
                                                    // the mark belongs to the student
                                                    // check which subject the mark belongs to
                                                    console.log(
                                                      'Found owner of mark',
                                                    );

                                                    learner.subjects.forEach(
                                                      (sub) => {
                                                        // console.log(
                                                        //   `Mark Subject id: ${
                                                        //     (
                                                        //       mark.subject_teacher_id as ISubjectTeacher
                                                        //     ).subject_id._id
                                                        //   } Subject id: ${sub
                                                        //     .name
                                                        //     ._id!} SubjectName: ${
                                                        //     sub.name.name
                                                        //   }`,
                                                        // );
                                                        if (
                                                          sub.name._id! ===
                                                          (
                                                            mark.subject_teacher_id as ISubjectTeacher
                                                          ).subject_id._id
                                                        ) {
                                                          // the mark belongs to this subject
                                                          // check if the first scoresheet mark has been added
                                                          // if not, add the mark
                                                          if (
                                                            sub.marks.first ===
                                                            ''
                                                          ) {
                                                            sub.marks.first =
                                                              mark.mark;
                                                          } else if (
                                                            sub.marks.second ===
                                                            ''
                                                          ) {
                                                            sub.marks.second =
                                                              mark.mark;
                                                          } else if (
                                                            sub.marks.third ===
                                                            ''
                                                          ) {
                                                            sub.marks.third =
                                                              mark.mark;
                                                          } else {
                                                            sub.marks.fourth =
                                                              mark.mark;
                                                          }
                                                          // console.log(mark);
                                                          // sub.marks.first = mark.mark;
                                                          // console.log(learner);

                                                          // add subject teacher
                                                          const tempUser: IUser =
                                                            (
                                                              (
                                                                mark.subject_teacher_id as ISubjectTeacher
                                                              )
                                                                .teacher_id as ITeacher
                                                            ).user_id as IUser;
                                                          const tempTeacher: ITeacher =
                                                            (
                                                              mark.subject_teacher_id as ISubjectTeacher
                                                            )
                                                              .teacher_id as ITeacher;
                                                          sub.marks.teacher =
                                                            this.teacherService.computeTeacherTitle(
                                                              tempTeacher.gender,
                                                              tempTeacher.marital_status,
                                                            ) +
                                                            ' ' +
                                                            tempUser.name +
                                                            ' ' +
                                                            tempUser.surname;
                                                        }
                                                      },
                                                    );
                                                  }
                                                } else {
                                                  console.log(
                                                    `Class student is null`,
                                                  );
                                                }
                                              },
                                            );
                                          }
                                        },
                                      );
                                    });
                                  });
                                }
                              });
                          }
                        },
                      });

                    // console.log(typeof sheetMarks);
                  }
                },
              });
          }

          console.log('before sheet marks');
          console.log(sheetMarks[0]);
        }

        console.log(this.allClassesReports);
      }
    });

    // return scoresheetsWrapper;
  }

  // assing subjects to learners
  async assignSubjectsToLearners() {
    this.allClassesReports.forEach((stream) => {
      // console.log(stream);

      // check if stream is secondary or high school
      // assign secondary subjects to secondary streams
      // assign high school subjects to high school streams
      if (this.secondaryRegEx.test(stream.classname.name)) {
        this.secondarySubjects$.pipe(takeWhile(() => this.alive)).subscribe({
          next: (data: ISubjects[]) => {
            if (data?.length) {
              // console.log(stream.classname.name);
              // console.log(data);

              data.forEach((subject) => {
                stream.learners.forEach((learner) => {
                  if (learner.subjects === null) {
                    learner.subjects = [];
                  }
                  learner.subjects.push({
                    name: subject,
                    marks: {
                      first: '',
                      second: '',
                      third: '',
                      fourth: '',
                      final_mark: 0,
                      position: 0,
                      category: '',
                      comments: '',
                      teacher: '',
                    },
                  });
                });
              });
            }
          },
        });
      } else if (this.highSchoolRegEx.test(stream.classname.name)) {
        this.highSchoolSubjects$.pipe(takeWhile(() => this.alive)).subscribe({
          next: (data: ISubjects[]) => {
            if (data?.length) {
              // console.log(stream.classname.name);
              // console.log(data);

              data.forEach((subject) => {
                stream.learners.forEach((learner) => {
                  if (learner.subjects === null) {
                    learner.subjects = [];
                  }
                  learner.subjects.push({
                    name: subject,
                    marks: {
                      first: '',
                      second: '',
                      third: '',
                      fourth: '',
                      final_mark: 0,
                      position: 0,
                      category: '',
                      comments: '',
                      teacher: '',
                    },
                  });
                });
              });
            }
          },
        });
      }
    });

    console.log(this.allClassesReports);
  }

  // function to assign scoresheet marks to each learner
  assignScoresheetMarksToSubjects(
    scoresheetsWrapper: any[][],
    report: IReportsCriteria,
  ) {
    console.log(scoresheetsWrapper);
    // scoresheetsWrapper.forEach((sheet) => console.log(sheet));

    // for each scoresheet
    // for each class
    //  for each learner
    //    for each subject

    for (let m = 0; m < report.scoresheets.length; m++) {
      const scoresheet = report.scoresheets[m];

      for (let i = 0; i < this.allClassesReports.length; i++) {
        const tempClass = this.allClassesReports[i];

        for (let j = 0; j < tempClass.learners.length; j++) {
          const tempLearner = tempClass.learners[j];

          // secondary subjects
          if (this.secondaryRegEx.test(tempClass.classname.name)) {
            this.secondarySubjects$
              .pipe(takeWhile(() => this.alive))
              .subscribe({
                next: (data: ISubjects[]) => {
                  if (data?.length) {
                    // data.forEach((subject) => {
                    //   const mark = scoresheetsWrapper.find(
                    //     (score) => console.log(score),
                    //     // score.scoresheet_id === scoresheet._id! &&
                    //     // score.class_student_id._id ===
                    //     // tempLearner.reportInfo.id,
                    //     // score.subject_id === subject._id!
                    //   );
                    //
                    //   console.log(mark);
                    // });

                    scoresheetsWrapper.forEach((sheet) => {
                      console.log('item');
                      console.log(sheet);
                    });
                  } else {
                    console.log('There is no data in subjects');
                  }
                },
              });
          } else if (this.highSchoolRegEx.test(tempClass.classname.name)) {
            // high school subjects
          }
        }
      }
    }
  }
}
