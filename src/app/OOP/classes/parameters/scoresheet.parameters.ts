import { Router } from '@angular/router';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';
import { Classname } from '../classname.class';

export interface ScoresheetParameters {
  _id?: string;
  name?: string;
  year?: string;
  classes?: Classname[];
  subjects?: any[];
  api: ScoresheetService;
  router: Router;
}
