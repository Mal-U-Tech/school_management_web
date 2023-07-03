import { createReducer, on } from '@ngrx/store';
import { ITeacher } from 'src/app/shared/teacher/teacher.interface';
import {
  addTeacherPaginatorOptions,
  deleteTeacherError,
  deleteTeacherRequest,
  deleteTeacherSuccess,
  getTeachersError,
  getTeachersRequest,
  getTeachersSuccess,
  postTeacherError,
  postTeacherRequest,
  postTeacherSuccess,
  teacherIsLoading,
  updateTeacherError,
  updateTeacherRequest,
  updateTeacherSuccess,
} from './teacher.actions';

export interface TeacherState {
  teachers: ITeacher[];
  errorMessage: string;
  paginator: {
    currentPage: number;
    pageSize: number;
    count: number;
  };
  teacherIsLoading: boolean;
}

export const initialState: TeacherState = {
  teachers: null as any,
  errorMessage: '',
  teacherIsLoading: false,
  paginator: {
    currentPage: 0,
    pageSize: 10,
    count: 0,
  },
};

export const teacherReducer = createReducer(
  initialState,
  on(
    teacherIsLoading,
    (state, { teacherIsLoading }): TeacherState => ({
      ...state,
      teacherIsLoading: teacherIsLoading,
    })
  ),
  on(
    addTeacherPaginatorOptions,
    (state, { paginator }): TeacherState => ({
      ...state,
      paginator: paginator,
    })
  ),

  // POST action states
  on(
    postTeacherRequest,
    (state, { teacher, schoolInfoId }): TeacherState => ({
      ...state,
    })
  ),
  on(
    postTeacherSuccess,
    (state, { teacher }): TeacherState => ({
      ...state,
      teachers: [...state.teachers, teacher],
      errorMessage: '',
    })
  ),
  on(
    postTeacherError,
    (state, { message }): TeacherState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // GET action state
  on(
    getTeachersRequest,
    (state, { currentPage, pageSize }): TeacherState => ({ ...state })
  ),
  on(
    getTeachersSuccess,
    (state, { teachers }): TeacherState => ({
      ...state,
      teachers: teachers,
      errorMessage: '',
    })
  ),
  on(
    getTeachersError,
    (state, { message }): TeacherState => ({ ...state, errorMessage: message })
  ),

  // UPDATE action state
  on(
    updateTeacherRequest,
    (state, { id, teacher }): TeacherState => ({ ...state })
  ),
  on(updateTeacherSuccess, (state, { teacher }): TeacherState => {
    const index = state.teachers.findIndex(
      (teach) => teach._id !== teacher._id
    );

    const newArr = [...state.teachers];
    newArr[index] = teacher;

    return {
      ...state,
      teachers: newArr,
      errorMessage: '',
    };
  }),
  on(
    updateTeacherError,
    (state, { message }): TeacherState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // DELETE actions state
  on(
    deleteTeacherRequest,
    (state, { id }): TeacherState => ({
      ...state,
    })
  ),
  on(deleteTeacherSuccess, (state, { id }): TeacherState => {
    const newArr = state.teachers.filter((teach) => teach._id !== id);

    return {
      ...state,
      teachers: newArr,
    };
  }),
  on(
    deleteTeacherError,
    (state, { message }): TeacherState => ({ ...state, errorMessage: message })
  )
);
