import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeWhile } from 'rxjs';
import { ISubject } from 'src/app/add-subjects/models/subject.model';
import { ISubjects } from 'src/app/shared/add-subjects/add-subjects.interface';
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
import { ISubjectTeacher } from 'src/app/shared/subject-teacher/subject-teacher.interface';
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
export class GenerateReportsComponent implements OnDestroy {
  constructor(
    private store: Store,
    private marksApi: MarksService,
  ) {}

  private secondaryRegEx = new RegExp('^Form [1-3].');
  private highSchoolRegEx = new RegExp('^Form [4-5].');
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
    console.log('Generating reports now');
    let report: IReports = null as any;
    let learners: IClassStudent[] = [];
    const classes = [];
    let reportName = '';
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

        // hold temp classes array
        // classes.push(temp);

        // set learners for each class
        learners = this.getClassLearners(temp);
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

        // get class teacher
        // classTeacher = this.getClassTeacher(temp);
      }

      // console.log(this.allClassesReports);
    });

    // assing subjects to students
    this.assignSubjectsToLearners();

    // get scoresheet and assign learners marks
    await this.getLearnersMarks(report);

    // assign scoresheets marks to the allClassesReports values for each subject
    // this.assignScoresheetMarksToSubjects(
    //   scoresheetsWrapper,
    //   report.criteria[0],
    // );

    // get reports name
    reportName = report.name;

    // get number of students
    // numStudents = learners.length;

    // TODO: get total day

    // TODO: re-open data

    // TODO: get attendance data

    // TODO: get conduct

    // TODO:
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
    let teach = null as any;
    this.classTeachers$.pipe(takeWhile(() => this.alive)).subscribe({
      next: (data: IClassTeacher[]) => {
        if (data?.length) {
          data.forEach((teacher) => {
            if (teacher.class_id === stream._id || '') {
              teach = teacher;
            }
          });
        }
      },
    });

    return teach;
  }

  // function to get learners marks from scoresheets
  async getLearnersMarks(report: IReports) {
    // const scoresheetsWrapper: any[][] = [];

    console.log(report);
    report.criteria.forEach((crit) => {
      console.log(crit);
      for (let i = 0; i < crit.scoresheets.length; i++) {
        const temp = crit.scoresheets[i];

        console.log(`Year: ${temp.year}, Scoresheet: ${temp._id!}`);
        // get the marks for the scoresheets
        this.marksApi
          .getClassStudentMarks(temp.year, temp._id || '')
          .pipe(takeWhile(() => this.alive))
          .subscribe({
            next: (data: IMarks[]) => {
              // console.log('Retrieved scoresheet marks');
              if (data?.length) {
                // console.log(data);

                // let j = 0;
                data.forEach((mark) => {
                  // console.log(`${mark}`);
                  this.allClassesReports.forEach((stream) => {
                    // console.log(
                    //   `Class id: ${
                    //     (mark.subject_teacher_id as ISubjectTeacher).class_id
                    //   } streamId ${stream.classname._id!}`,
                    // );
                    if (
                      (mark.subject_teacher_id as ISubjectTeacher).class_id ===
                      stream.classname._id!
                    ) {
                      // the mark belongs to the class
                      // check who the mark belongs to
                      stream.learners.forEach((learner) => {
                        // console.log(mark.class_student_id);
                        if (mark.class_student_id !== null) {
                          // console.log(
                          //   `Mark student_id: ${mark.class_student_id} Learner id: ${learner.reportInfo.id}`,
                          // );
                          if (
                            (mark.class_student_id as IClassStudent)._id ===
                            learner.reportInfo.id
                          ) {
                            // the mark belongs to the student
                            // check which subject the mark belongs to

                            learner.subjects.forEach((sub) => {
                              // console.log(
                              //   `Mark Subject id: ${
                              //     (mark.subject_teacher_id as ISubjectTeacher)
                              //       .subject_id._id
                              //   } Subject id: ${sub.name._id!} SubjectName: ${
                              //     sub.name.name
                              //   }`,
                              // );
                              if (
                                sub.name._id! ===
                                (mark.subject_teacher_id as ISubjectTeacher)
                                  .subject_id._id
                              ) {
                                // the mark belongs to this subject
                                // check if the first scoresheet mark has been added
                                // if not, add the mark
                                if (sub.marks.first === null) {
                                  sub.marks.first = mark.mark;
                                } else if (sub.marks.second === null) {
                                  sub.marks.second = mark.mark;
                                } else if (sub.marks.third === null) {
                                  sub.marks.third = mark.mark;
                                } else {
                                  sub.marks.fourth = mark.mark;
                                }
                                console.log(mark);
                                // sub.marks.first = mark.mark;

                                // console.log(learner);
                              }
                            });
                          }
                        } else {
                          console.log(`Class student is null`);
                        }
                      });
                    }
                  });
                });
              }

              console.log(this.allClassesReports);
            },
          });

        // console.log(this.allClassesReports);
      }
    });

    // return scoresheetsWrapper;
  }

  // assing subjects to learners
  assignSubjectsToLearners() {
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
                      first: null as any,
                      second: null as any,
                      third: null as any,
                      fourth: null as any,
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
                      first: null as any,
                      second: null as any,
                      third: null as any,
                      fourth: null as any,
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
