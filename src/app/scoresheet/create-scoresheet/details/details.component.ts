import { Component, Input } from '@angular/core';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';

@Component({
  selector: 'scoresheet-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  constructor(public scoresheetService: ScoresheetService) {}

  goToNextStep() {
    // remove first step
    // display second step
    if (this.scoresheetService.isStepOne) {
      this.scoresheetService.isStepOne = false;
      this.scoresheetService.isStepTwo = true;
    }
  }
}
