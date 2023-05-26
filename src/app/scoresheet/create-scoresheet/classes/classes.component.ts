import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Scoresheet } from 'src/app/OOP/classes/scoresheet.class';
import { PassControlsComponent } from 'src/app/pass-controls/pass-controls.component';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';

@Component({
  selector: 'app-scoresheet-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss'],
})
export class ClassesComponent implements OnInit {
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
    this.classes = JSON.parse(sessionStorage.getItem('streams') || '');
  }

  // function to retrieve subjects from sessionStorage
  getSubjects() {
    this.scoresheetService.subjects = JSON.parse(
      sessionStorage.getItem('subjects') || ''
    );
  }

  // function to create checked variable for the number of classes available
  computeCheckedClassesArray() {
    const temp: boolean[] = [];

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

    const scoresheet = new Scoresheet({
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
    const temp: object[] = [];
    for (let i = 0; i < this.scoresheetService.checked.length; i++) {
      const val = this.scoresheetService.checked[i];

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
