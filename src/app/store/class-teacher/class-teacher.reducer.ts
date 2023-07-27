import { createReducer, on } from '@ngrx/store';
import { IClassTeacher } from 'src/app/shared/class-teacher/class-teacher.interface';
import {
  classTeacherIsLoading,
  deleteClassTeacherError,
  deleteClassTeacherRequest,
  deleteClassTeacherSuccess,
  getClassTeachersError,
  getClassTeachersRequest,
  getClassTeachersSuccess,
  postClassTeacherError,
  postClassTeacherRequest,
  postClassTeacherSuccess,
  updateClassTeacherError,
  updateClassTeacherRequest,
  updateClassTeacherSuccess,
} from './class-teacher.actions';

export interface ClassTeacherState {
  classTeachers: IClassTeacher[];
  errorMessage: string;
  classTeachersIsLoading: boolean;
}

export const initialState: ClassTeacherState = {
  classTeachers: null as any,
  errorMessage: '',
  classTeachersIsLoading: false,
};

export const classTeacherReducer = createReducer(
  initialState,
  on(
    classTeacherIsLoading,
    (state, { classTeacherIsLoading }): ClassTeacherState => ({
      ...state,
      classTeachersIsLoading: classTeacherIsLoading,
    })
  ),

  // post class teacher reducer
  on(
    postClassTeacherRequest,
    (state, { classTeacher }): ClassTeacherState => ({
      ...state,
    })
  ),
  on(
    postClassTeacherSuccess,
    (state, { classTeacher }): ClassTeacherState => ({
      ...state,
      classTeachers: [...state.classTeachers, classTeacher],
      errorMessage: '',
    })
  ),
  on(
    postClassTeacherError,
    (state, { message }): ClassTeacherState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // get class teacher reducer
  on(
    getClassTeachersRequest,
    (state, { currentPage, pageSize }): ClassTeacherState => ({
      ...state,
    })
  ),
  on(
    getClassTeachersSuccess,
    (state, { classTeachers }): ClassTeacherState => ({
      ...state,
      classTeachers: classTeachers,
      errorMessage: '',
    })
  ),
  on(
    getClassTeachersError,
    (state, { message }): ClassTeacherState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // update class teacher reducer
  on(
    updateClassTeacherRequest,
    (state, { id, classTeacher }): ClassTeacherState => ({
      ...state,
    })
  ),
  on(
    updateClassTeacherSuccess,
    (state, { classTeacher }): ClassTeacherState => {
      const index = state.classTeachers.findIndex(
        (teacher) => teacher._id === classTeacher._id
      );

      const newArr = [...state.classTeachers];
      newArr[index] = classTeacher;

      return {
        ...state,
        classTeachers: newArr,
        errorMessage: '',
      };
    }
  ),
  on(
    updateClassTeacherError,
    (state, { message }): ClassTeacherState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // delete class teacher reducer
  on(
    deleteClassTeacherRequest,
    (state, { id }): ClassTeacherState => ({
      ...state,
    })
  ),
  on(deleteClassTeacherSuccess, (state, { id }): ClassTeacherState => {
    const newArr = state.classTeachers.filter((teacher) => teacher._id !== id);

    return {
      ...state,
      classTeachers: newArr,
      errorMessage: '',
    };
  }),
  on(
    deleteClassTeacherError,
    (state, { message }): ClassTeacherState => ({
      ...state,
      errorMessage: message,
    })
  )
);
