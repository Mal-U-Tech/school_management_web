import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Scoresheet } from 'src/app/OOP/classes/scoresheet.class';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';

@Component({
  selector: 'scoresheet-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss'],
})
export class ClassesComponent {
  public classes: any;

  constructor(
    public scoresheetService: ScoresheetService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getClasses();
    this.computeCheckedClassesArray();
    this.getSubjects();
  }

  // function to retrieve classes from sessionStorage
  getClasses() {
    this.classes = JSON.parse(sessionStorage.getItem('streams')!);
  }

  // function to retrieve subjects from sessionStorage
  getSubjects() {
    this.scoresheetService.subjects = JSON.parse(
      sessionStorage.getItem('subjects')!
    );
  }

  // function to create checked variable for the number of classes available
  computeCheckedClassesArray() {
    let temp: boolean[] = [];

    for (let i = 0; i < this.classes.length; i++) {
      temp.push(false);
    }

    this.checkIfCheckedExists(temp);
  }

  checkIfCheckedExists(temp: boolean[]) {
    if (!this.scoresheetService.checked.length) {
      this.scoresheetService.checked = temp;
    }
  }

  createScoresheet() {
    console.log(this.scoresheetService.name);
    console.log(this.scoresheetService.year);
    console.log(this.scoresheetService.checked);
    // console.log(this.scoresheetService.subjects);
    this.assignCheckedClasses();
    console.log(this.scoresheetService.selectedClasses);

    let scoresheet = new Scoresheet({
      api: this.scoresheetService,
      name: this.scoresheetService.name,
      year: this.scoresheetService.year,
      classes: this.scoresheetService.selectedClasses,
      router: this.router,
    });

    scoresheet.setClassIds;
    scoresheet.saveScoresheet();
  }

  assignCheckedClasses() {
    let temp: object[] = [];
    for (let i = 0; i < this.scoresheetService.checked.length; i++) {
      let val = this.scoresheetService.checked[i];

      if (val) {
        // this class has been selected
        temp.push(this.classes[i]);
      }
    }

    this.scoresheetService.selectedClasses = temp;
  }

  goBackToStepOne() {
    this.scoresheetService.isStepTwo = false;
    this.scoresheetService.isStepOne = true;
  }
}
