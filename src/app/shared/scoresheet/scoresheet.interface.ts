import { IClassname } from '../classname/classname.interface';

export interface IScoresheet {
  _id?: string;
  name: string;
  year: string;
  classes: Array<string> | Array<IClassname>;
  // subjects: any[];
}
