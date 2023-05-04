import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AddSubjectsService } from 'src/app/shared/add-subjects/add-subjects.service';
import { MarksService } from 'src/app/shared/marks/marks.service';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';
import { SubjectTeacherService } from 'src/app/shared/subject-teacher/subject-teacher.service';

@Component({
  selector: 'app-select-class',
  templateUrl: './select-class.component.html',
  styleUrls: ['./select-class.component.scss'],
})
export class SelectClassComponent {
  constructor(
    public service: ScoresheetService,
    public subjects: AddSubjectsService,
    public subjectTeacher: SubjectTeacherService,
    public router: Router,
    public marksService: MarksService
  ) {}

  ngAfterViewInit(): void {
    this.service
      .getStreamsFromScoresheet(this.service.selectedScoresheetId)
      .subscribe({
        next: (data: any) => {
          for (let i = 0; i < data[0].classes.length; i++) {
            let temp = data[0].classes[i];

            if (this.secondaryRegEx.test(temp.name)) {
              this.classes.push({
                class_id: temp._id,
                name: temp.name,
                subjects: this.subjects.secondarySubjects,
              });
            }
            if (this.highSchoolRegEx.test(temp.name)) {
              this.classes.push({
                name: temp.name,
                subjects: this.subjects.highSchoolSubjects,
              });
            }
          }
          console.log(this.classes);
          // console.log(this.subjects.secondarySubjects);
          // console.log(this.subjects.highSchoolSubjects);
        },
      });
  }

  secondaryRegEx = new RegExp('^Form [1-3].');
  highSchoolRegEx = new RegExp('^Form [4-5].');
  classes: any[] = [];
  selectedClass = 0;

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
    let currentUser = JSON.parse(sessionStorage.getItem('user')!);
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
    console.log(stream);
    console.log(this.service.selectedScoresheetId);

    this.marksService
      .getFullScoresheet(stream.class_id, this.service.selectedScoresheetId)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.marksService.selectedClass = {
            class_id: stream.class_id,
            name: stream.name,
          };

          sessionStorage.setItem('scoresheet-data', JSON.stringify(data));
          // navigate to class scoresheet component
          this.router.navigateByUrl('class-scoresheet');
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
