import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ClassUpdateDTO } from 'src/app/dtos/class_update.dto';
import { IClass } from 'src/app/interfaces/class.interface';
import { IStudent } from 'src/app/interfaces/student.interface';
import { ISubject } from 'src/app/interfaces/subject.interface';
import { IUser } from 'src/app/interfaces/user.interface';

export const ClassStudentsEffectActions = createActionGroup({
  source: 'Class Students Effect Actions',
  events: {
    success: props<{ students: IStudent[]; }>(),
    failed: props<{ error: Error; }>()
  }
})

export const ClassUpdateEffectActions = createActionGroup({
  source: 'Class Update Effect Actions',
  events: {
    update: props<{ class: Partial<Omit<ClassUpdateDTO, 'id'>> & Pick<ClassUpdateDTO, 'id'>; }>(),
    init: props<{ class: IClass; }>(),

    success: props<{ class: IClass; }>(),
    failed: props<{ error: Error; }>(),
  }
});

export const ClassNameChangeActions = createActionGroup({
  source: 'Class Name Change Actions',
  events: {
    submit: props<{ name: string; id: string; }>()
  }
});

export const ClassDetailPageActions = createActionGroup({
  source: 'Class Detail Page Actions',
  events: {
    addstudent: emptyProps(),
    changename: emptyProps(),
  },
});

export const ClassUpdateStudentActions = createActionGroup({
  source: 'Class Update Student Actions',
  events: {
    update: emptyProps(),
    remove: props<{ student: IStudent }>(),

    save: props<{ id: string; students: string[]; }>(),
    submit: props<{ class: IClass; student: string; }>(),
  }
})

export const ClassUpdateSubjectActions = createActionGroup({
  source: 'Class Update Subject Actions',
  events: {
    update: emptyProps(),
    remove: props<{ subject: ISubject }>(),

    save: props<{ id: string; subjects: string[]; }>(),
    submit: props<{ class: IClass; subject: string; }>(),
  }
});

export const ClassUpdateTeacherActions = createActionGroup({
  source: 'Class Update Teacher Actions',
  events: {
    update: emptyProps(),
    remove: props<{ teacher: IUser }>(),

    save: props<{ id: string; users: string[]; }>(),
    submit: props<{ class: IClass; teacher: string; }>(),
  }
});
