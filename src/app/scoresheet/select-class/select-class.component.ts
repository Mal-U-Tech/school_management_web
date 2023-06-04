import { AfterViewInit, Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IPassControls } from 'src/app/pass-controls/models/pass-controls.model';
import { PassControlsComponent } from 'src/app/pass-controls/pass-controls.component';
import { AddSubjectsService } from 'src/app/shared/add-subjects/add-subjects.service';
import { IClassStudent } from 'src/app/shared/class-students/class-students.interface';
import { ClassStudentsService } from 'src/app/shared/class-students/class-students.service';
import { IMarks } from 'src/app/shared/marks/marks.interface';
import { MarksService } from 'src/app/shared/marks/marks.service';
import { PassControlsService } from 'src/app/shared/pass-controls/pass-controls.service';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';
import { SubjectTeacherService } from 'src/app/shared/subject-teacher/subject-teacher.service';

@Component({
  selector: 'app-select-class',
  templateUrl: './select-class.component.html',
  styleUrls: ['./select-class.component.scss'],
})
export class SelectClassComponent implements AfterViewInit {
  constructor(
    public service: ScoresheetService,
    public subjects: AddSubjectsService,
    public subjectTeacher: SubjectTeacherService,
    public router: Router,
    public marksService: MarksService,
    private dialog: MatDialog,
    private passControlsService: PassControlsService,
    private classStudentsService: ClassStudentsService
  ) {}

  ngAfterViewInit(): void {
    this.service
      .getStreamsFromScoresheet(this.service.selectedScoresheetId)
      .subscribe({
        next: (data: any) => {
          for (let i = 0; i < data[0].classes.length; i++) {
            const temp = data[0].classes[i];

            if (this.secondaryRegEx.test(temp.name)) {
              this.classes.push({
                class_id: temp._id,
                name: temp.name,
                subjects: this.subjects.secondarySubjects,
              });
            }
            if (this.highSchoolRegEx.test(temp.name)) {
              this.classes.push({
                class_id: temp._id,
                name: temp.name,
                subjects: this.subjects.highSchoolSubjects,
              });
            }
          }
          console.log(this.classes);
        },
      });

    setTimeout(() => {
      this.loadPassControls();
    }, 2000);
  }

  secondaryRegEx = new RegExp('^Form [1-3].');
  highSchoolRegEx = new RegExp('^Form [4-5].');
  classes: any[] = [];
  selectedClass = 0;
  passControls: IPassControls[] = [];
  isLoadingPassControls = true;
  isScoresheetLoading = false;

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
    const currentUser = JSON.parse(sessionStorage.getItem('user') || '');
    console.log(currentUser);
    // let teacherId = '6442e23f66c6b3a6650b0f02';
    this.subjectTeacher
      .getTeacherForSubject(
        subjectId,
        currentUser.teacher_id,
        classId,
        this.service.selectedYear
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          sessionStorage.setItem(
            'selected-class-scoresheet',
            JSON.stringify(data)
          );

          this.subjectTeacher.successToast('Successfully retrieved students');
          this.router.navigateByUrl('add-marks');
        },
        error: (error) => {
          console.log(error);
          this.subjectTeacher.errorToast(
            'Please correctly choose the class you teach'
          );
        },
      });
  }

  // function to take user to the full scoresheet view of the class
  viewScoresheet(stream: any) {
    // console.log(stream);
    const selectedStream = this.classes[this.selectedClass];

    this.isScoresheetLoading = true;
    // first get the class students
    this.classStudentsService
      .getAllLearnersByClassYear(stream.class_id, '2023', 0, 0)
      .subscribe({
        next: (data: IClassStudent[]) => {
          // console.log(data);
          sessionStorage.setItem('scoresheet-students', JSON.stringify(data));
        },
        error: (error) => {
          console.log(error);
          this.classStudentsService.errorToast(error);
        },
      });

    const finalSubjectsArray: any[] = [];

    // console.log('I am about to get marks now');
    // get subjects marks
    this.marksService
      .getSubjectMarksWithArray(
        this.service.selectedYear,
        this.service.selectedScoresheetId,
        selectedStream.subjects
      )
      .subscribe({
        next: (data) => {
          // console.log('I have retrieved marks');
          console.log(data);
          this.isScoresheetLoading = false;

          // try {
          for (let i = 0; i < data.length; i++) {
            const temp = data[i];
            const subjects: any = [];
            if (temp.length != 0) {
              temp.forEach((mark: any) => {
                // console.log(mark);
                // console.log('I am from api + '' +mark.class_student_id.class_id)
                // console.log(selectedStream);
                // console.log(mark.subject_teacher_id);
                if (mark.subject_teacher_id.class_id == null) {
                  console.log('i am null');
                }

                if (selectedStream.class_id == null) {
                  console.log('i am null too');
                }
                if (
                  mark.subject_teacher_id.class_id == selectedStream.class_id
                ) {
                  // console.log(
                  //   selectedStream.name + ' ' + selectedStream.class_id
                  // );
                  // console.log(mark.subject_teacher_id.class_id);
                  subjects.push(mark);
                }
              });
            }

            const subObj: any = {};
            subObj[selectedStream.subjects[i].name] = subjects;
            finalSubjectsArray.push(subObj);
          }
          // } catch (error) {
          //   console.log('This is error: ' + error);
          // }
          console.log(finalSubjectsArray);
          sessionStorage.setItem(
            'scoresheet-subjects',
            JSON.stringify(finalSubjectsArray)
          );
          this.service.className = stream.name;
          this.marksService.selectedClass = {
            class_id: stream.class_id,
            name: stream.name,
          };
          this.router.navigateByUrl('class-scoresheet');
        },
        error: (error) => {
          this.isScoresheetLoading = false;
          console.log(error);
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
      console.log(this.passControls);
    });
    instance.onConfirmControls.subscribe(() => {
      instance.submitPassControls();
    });
  }

  // function to retrieve pass controls for the current scoresheet
  private loadPassControls() {
    this.isLoadingPassControls = true;
    console.log(`This is scoresheet id: ${this.service.selectedScoresheetId}`);
    this.passControlsService
      .getControlsByScoresheet(this.service.selectedScoresheetId)
      .subscribe({
        next: (data: IPassControls[]) => {
          this.passControls = data;
          console.log(data);
          this.isLoadingPassControls = false;

          // setting pass controls in PassControls service
          this.passControlsService.setPassControls = data;
        },
        error: (error) => {
          this.isLoadingPassControls = false;
          this.passControlsService.errorToast(error);
        },
      });
  }
}
