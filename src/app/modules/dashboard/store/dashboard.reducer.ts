import { createReducer, on } from '@ngrx/store';
import { DashboardState, initial } from './dashboard.state';
import { loadSchoolsEffectSuccessful } from 'src/app/store/app.actions';
import { ISchool } from 'src/app/interfaces/school.interface';
import { IMenu } from '../interfaces/menu.interface';
import { routerMenuUpdateEffect } from './dashboard.actions';

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
  on(
    routerMenuUpdateEffect,
    (state, action): DashboardState => ({
      ...state,
      active: action.item,
    })
  ),
);

function buildmenu(schools: ISchool[]): IMenu[] {
  return schools.map((school) => {
    return {
      title: school.name,
      icon: 'school',
      route: [school.id, 'classes'],

      items: [
        {
          title: `Classes`,
          suffix: school.classes?.length ?? String(0),
          warning: school.classes?.some((c) => (c.subjects?.length ?? 0) < 2 || (c.users?.length ?? 0) < 2),
          icon: 'class',
          route: ['dashboard', school.id, 'classes']
        },
        {
          title: `Subjects`,
          icon: 'subject',
          suffix: school.subjects?.length ?? String(0),
          route: ['dashboard', school.id, 'subjects']
        },
        {
          title: 'Students',
          icon: 'person',
          suffix: school.students?.length ?? String(0),
          route: ['dashboard', school.id, 'students']
        },
      ]
    } as IMenu
  })
}
