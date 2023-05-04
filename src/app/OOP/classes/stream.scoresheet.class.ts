import { ScoresheetRolesEnum } from '../enums/scoresheet.roles.enum';
import { Classname } from './classname.class';
import { ScoresheetStudent } from './student.scoresheet.class';

export class StreamScoresheet {
  private acceptedRoles: ScoresheetRolesEnum = ScoresheetRolesEnum.none;
  private subjectTeacher?: string;
  private students?: ScoresheetStudent[];
  private scoresheetId: string;
  private numberOfLearners?: number;

  constructor(scoresheetId: string) {
    this.scoresheetId = scoresheetId;
  }
}
