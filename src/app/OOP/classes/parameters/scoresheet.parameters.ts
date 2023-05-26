import { Router } from '@angular/router';
import { IClassname } from 'src/app/shared/classname/classname.interface';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';
import { Classname } from '../classname.class';

export interface ScoresheetParameters {
  _id?: string;
  name?: string;
  year?: string;
  classes?: IClassname[] | string[];
  subjects?: any[];
  api: ScoresheetService;
  router: Router;
}
