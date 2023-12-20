import { createAction, props } from '@ngrx/store';
import { ISchool } from 'src/app/interfaces/school.interface';

export const routerUpdateSchoolTabEffect = createAction(
  '[Schools] User Click Schools Tab',
  props<{ tab: string }>()
);

export const loadSchoolEffect = createAction(
  '[Schools] Load School Effect',
  props<{ school: ISchool }>()
);

