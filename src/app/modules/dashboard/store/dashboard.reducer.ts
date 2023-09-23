import { createReducer, on } from '@ngrx/store';
import { DashboardState, initial } from './dashboard.state';
import { loadSchoolsEffectSuccessful } from 'src/app/store/app.actions';
import { ISchool } from 'src/app/interfaces/school.interface';
import { IMenu } from '../interfaces/menu.interface';

export const key = 'dashboard';

export const reducer = createReducer(
  initial,

  on(
    loadSchoolsEffectSuccessful,
    (state, action): DashboardState => ({
      ...state,
      menu: buildmenu(action.schools),
    })
  ),
);

function buildmenu(schools: ISchool[]): IMenu[] {
  return schools.map((school) => {
    return {
      title: school.name,
      icon: 'school',
      route: [school.id],

      items: [
        {
          title: 'Classes',
          icon: 'class',
          route: ['classes']
        },
        {
          title: 'Subjects',
          icon: 'subject',
          route: ['subjects']
        },
        {
          title: 'Students',
          icon: 'person',
          route: ['students']
        },
      ]
    } as IMenu
  })
}
