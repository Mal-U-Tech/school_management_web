import { Component } from '@angular/core';
import { AddSubjectsService } from 'src/app/shared/add-subjects/add-subjects.service';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';

@Component({
  selector: 'app-select-class',
  templateUrl: './select-class.component.html',
  styleUrls: ['./select-class.component.scss'],
})
export class SelectClassComponent {
  constructor(
    public service: ScoresheetService,
    public subjects: AddSubjectsService
  ) {}

  ngAfterViewInit(): void {
    this.service
      .getStreamsFromScoresheet(this.service.selectedScoresheetId)
      .subscribe({
        next: (data: any) => {
          console.log(data[0].classes);
          console.log(this.secondaryRegEx.test(data[0].classes[1].name));
          console.log(data[0].classes[1].name);

          for (let i = 0; i < data[0].classes.length; i++) {
            let temp = data[0].classes[i];

            if (this.secondaryRegEx.test(temp.name)) {
              this.classes.push({
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
          // // this.classes = data[0].classes;
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
}
