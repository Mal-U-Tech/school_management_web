import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IClassTeacher } from 'src/app/shared/class-teacher/class-teacher.interface';
import { ITeacher } from 'src/app/shared/teacher/teacher.interface';
import { TeacherState } from '../teacher/teacher.reducer';
import { selectTeacher } from '../teacher/teacher.selector';
import { selectAuth } from '../user/user.selector';
import { AuthState } from '../user/user.states';
import { ClassTeacherState } from './class-teacher.reducer';

export const selectClassTeacher =
  createFeatureSelector<ClassTeacherState>('classTeacher');

export const selectClassTeachersArray = createSelector(
  selectClassTeacher,
  (state: ClassTeacherState) => state.classTeachers
);

export const selectErrorMessage = createSelector(
  selectClassTeacher,
  (state: ClassTeacherState) => state.errorMessage
);

export const selectClassTeacherIsLoading = createSelector(
  selectClassTeacher,
  (state: ClassTeacherState) => state.classTeachersIsLoading
);

export const selectAndFindClassTeacher = createSelector(
  selectClassTeacher, selectTeacher, selectAuth,
  (classTeachers: ClassTeacherState, teachers: TeacherState, user: AuthState) => {

    console.log(user.user);
    let classTeacher: IClassTeacher = null as any;
    let teach: ITeacher = null as any;

    teachers.teachers.forEach((teacher) => {
      if(teacher.user_id === user.user._id || ''){
         teach = teacher;
      }
    });

    classTeachers.classTeachers.forEach((classTeach) => {
      if(teach._id === classTeach.teacher_id){
        classTeacher = classTeach;
      }
    });

    return classTeacher;
  }
);

