import { ISchool } from 'src/app/interfaces/school.interface';

export interface SchoolsState {
  tab: string;
  school?: ISchool;
}

export const initial = {
  tab: 'classes',
};
