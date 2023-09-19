import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Scoresheet } from 'src/app/OOP/classes/scoresheet.class';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';
import { selectStreamsArray } from 'src/app/store/streams/streams.selector';
import { selectSubjectsArray } from 'src/app/store/subjects/subjects.selector';

@Component({
  selector: 'app-scoresheet-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss'],
})
export class ClassesComponent implements OnInit {
  public classes: any;
  streams$ = this.store.select(selectStreamsArray);
  subjects$ = this.store.select(selectSubjectsArray);

  constructor(
    public scoresheetService: ScoresheetService,
    public router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.getClasses();
    this.computeCheckedClassesArray();
    this.getSubjects();
  }

  // function to retrieve classes from sessionStorage
  getClasses() {
    // this.classes = JSON.parse(sessionStorage.getItem('streams') || '');
    this.streams$.subscribe({
      next: (data) => {
        if (data.length) {
          this.classes = data;
        }
      },
    });
  }

  // function to retrieve subjects from sessionStorage
  getSubjects() {
    // this.scoresheetService.subjects = JSON.parse(
    //   sessionStorage.getItem('subjects') || ''
    // );

    this.subjects$.subscribe({
      next: (data) => {
        if (data.length) {
          this.scoresheetService.subjects = data;
          console.log(data);
        }
      },
    });
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
