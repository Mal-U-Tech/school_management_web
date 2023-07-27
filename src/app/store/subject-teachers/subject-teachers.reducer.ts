import { createReducer, on } from '@ngrx/store';
import { ISubjectTeacher } from 'src/app/shared/subject-teacher/subject-teacher.interface';
import {
  deleteSubjectTeacherError,
  deleteSubjectTeacherRequest,
  deleteSubjectTeacherSuccess,
  getSubjectTeachersError,
  getSubjectTeachersRequest,
  getSubjectTeachersSuccess,
  postSubjectTeacherError,
  postSubjectTeacherRequest,
  postSubjectTeacherSuccess,
  subjectTeacherIsLoading,
  updateSubjectTeacherError,
  updateSubjectTeacherRequest,
  updateSubjectTeacherSuccess,
} from './subject-teachers.actions';

export interface SubjectTeacherState {
  subjectTeachers: ISubjectTeacher[];
  errorMessage: string;
  subjectTeacherIsLoading: boolean;
}

export const initialState: SubjectTeacherState = {
  subjectTeachers: null as any,
  errorMessage: '',
  subjectTeacherIsLoading: false,
};

export const subjectTeacherReducer = createReducer(
  initialState,
  on(
    subjectTeacherIsLoading,
    (state, { subjectTeacherIsLoading }): SubjectTeacherState => ({
      ...state,
      subjectTeacherIsLoading: subjectTeacherIsLoading,
    })
  ),

  // post subject teacher actions
  on(
    postSubjectTeacherRequest,
    (state, { subjectTeacher }): SubjectTeacherState => ({ ...state })
  ),
  on(
    postSubjectTeacherSuccess,
    (state, { subjectTeacher }): SubjectTeacherState => ({
      ...state,
      subjectTeachers: [...state.subjectTeachers, subjectTeacher],
      errorMessage: '',
    })
  ),
  on(
    postSubjectTeacherError,
    (state, { message }): SubjectTeacherState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // get subject teacher actions
  on(
    getSubjectTeachersRequest,
    (state, { currentPage, pageSize }): SubjectTeacherState => ({ ...state })
  ),
  on(
    getSubjectTeachersSuccess,
    (state, { subjectTeachers }): SubjectTeacherState => ({
      ...state,
      subjectTeachers: subjectTeachers,
      errorMessage: '',
    })
  ),
  on(
    getSubjectTeachersError,
    (state, { message }): SubjectTeacherState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // update subject teacher action
  on(
    updateSubjectTeacherRequest,
    (state, { id, subjectTeacher }): SubjectTeacherState => ({ ...state })
  ),
  on(
    updateSubjectTeacherSuccess,
    (state, { subjectTeacher }): SubjectTeacherState => {
      const index = state.subjectTeachers.findIndex(
        (teacher) => teacher._id! === subjectTeacher._id!
      );
      const newArr = [...state.subjectTeachers];
      newArr[index] = subjectTeacher;

      console.log(index);
      console.log(newArr[index]);
      console.log(newArr);

      return {
        ...state,
        subjectTeachers: newArr,
        errorMessage: '',
      };
    }
  ),
  on(
    updateSubjectTeacherError,
    (state, { message }): SubjectTeacherState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // delete subject teacher actions
  on(
    deleteSubjectTeacherRequest,
    (state, { id }): SubjectTeacherState => ({ ...state })
  ),
  on(deleteSubjectTeacherSuccess, (state, { id }): SubjectTeacherState => {
    const newArr = state.subjectTeachers.filter(
      (teacher) => teacher._id! !== id
    );
    return {
      ...state,
      subjectTeachers: newArr,
      errorMessage: '',
    };
  }),
  on(
    deleteSubjectTeacherError,
    (state, { message }): SubjectTeacherState => ({
      ...state,
      errorMessage: message,
    })
  )
);
