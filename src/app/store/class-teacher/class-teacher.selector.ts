import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IClassTeacher } from 'src/app/shared/class-teacher/class-teacher.interface';
import { ITeacher } from 'src/app/shared/teacher/teacher.interface';
import { TeacherState } from '../teacher/teacher.reducer';
import { selectTeacher } from '../teacher/teacher.selector';
import { ClassTeacherState } from './class-teacher.reducer';
import { AuthenticateState } from '../../modules/authenticate/store/authenticate.state';
import { selectAuth } from '../../modules/authenticate/store/authenticate.selectors';

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
  (classTeachers: ClassTeacherState, teachers: TeacherState, user: AuthenticateState) => {
    let classTeacher: IClassTeacher | undefined;
    let teach: ITeacher | undefined;

    teachers.teachers.forEach((teacher) => {
      if(teacher.user_id === user?.user?._id){
         teach = teacher;
      }
    });

    classTeachers.classTeachers.forEach((classTeach) => {
      if(teach?._id === classTeach.teacher_id){
        classTeacher = classTeach;
      }
    });

    return classTeacher;
  }
);

