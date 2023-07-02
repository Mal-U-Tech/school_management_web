import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Scoresheet } from 'src/app/OOP/classes/scoresheet.class';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';

@Component({
  selector: 'app-create-scoresheet',
  templateUrl: './create-scoresheet.component.html',
  styleUrls: ['./create-scoresheet.component.scss'],
})
export class CreateScoresheetComponent implements OnInit, OnDestroy {
  constructor(
    public scoresheetService: ScoresheetService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.scoresheetService.isStepTwo = false;
    this.scoresheetService.isStepOne = true;
  }

  // declare a new scoresheet object
  public scoresheet: Scoresheet = new Scoresheet({
    api: this.scoresheetService,
    year: '2022',
    router: this.router,
  });

  ngOnDestroy(): void {
    this.scoresheetService.checked = [];
    this.scoresheetService.selectedClasses = [];
    this.scoresheetService.name = '';
    this.scoresheetService.year = '';
  }
}
