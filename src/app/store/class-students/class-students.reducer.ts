import { createReducer, on } from '@ngrx/store';
import { IClassStudent } from 'src/app/shared/class-students/class-students.interface';
import {
  classStudentsIsLoading,
  classStudentsPaginatorOptions,
  deleteClassStudentObjectError,
  deleteClassStudentObjectRequest,
  deleteClassStudentObjectSuccess,
  getClassStudentsArrayError,
  getClassStudentsArrayRequest,
  getClassStudentsArraySuccess,
  postClassStudentObjectError,
  postClassStudentObjectRequest,
  postClassStudentObjectSuccess,
  postClassStudentsArrayError,
  postClassStudentsArrayRequest,
  postClassStudentsArraySuccess,
  updateClassStudentObjectError,
  updateClassStudentObjectRequest,
  updateClassStudentObjectSuccess,
} from './class-students.actions';

export interface ClassStudentState {
  classStudents: IClassStudent[];
  errorMessage: string;
  classStudentsIsLoading: boolean;
  paginator: {
    currentPage: number;
    pageSize: number;
    count: number;
  };
}

export const initialState: ClassStudentState = {
  classStudents: null as any,
  errorMessage: '',
  classStudentsIsLoading: false,
  paginator: {
    currentPage: 0,
    pageSize: 10,
    count: 0,
  },
};

export const classStudentsReducer = createReducer(
  initialState,
  on(
    classStudentsIsLoading,
    (state, { classStudentsIsLoading }): ClassStudentState => ({
      ...state,
      classStudentsIsLoading: classStudentsIsLoading,
    })
  ),
  on(
    classStudentsPaginatorOptions,
    (state, { paginator }): ClassStudentState => ({
      ...state,
      paginator: paginator,
    })
  ),

  // Post class students array
  on(
    postClassStudentsArrayRequest,
    (state, { classStudents }): ClassStudentState => ({
      ...state,
      errorMessage: '',
    })
  ),
  on(
    postClassStudentsArraySuccess,
    (state, { classStudents }): ClassStudentState => ({
      ...state,
      classStudents: [...classStudents],
      errorMessage: '',
    })
  ),
  on(
    postClassStudentsArrayError,
    (state, { message }): ClassStudentState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // Post class student object
  on(
    postClassStudentObjectRequest,
    (state, { classStudent }): ClassStudentState => ({
      ...state,
      errorMessage: '',
    })
  ),
  on(
    postClassStudentObjectSuccess,
    (state, { classStudent }): ClassStudentState => ({
      ...state,
      classStudents: [...state.classStudents, classStudent],
      errorMessage: '',
    })
  ),
  on(
    postClassStudentObjectError,
    (state, { message }): ClassStudentState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // get class students array
  on(
    getClassStudentsArrayRequest,
    (state, { currentPage, pageSize }): ClassStudentState => ({ ...state })
  ),
  on(
    getClassStudentsArraySuccess,
    (state, { classStudents }): ClassStudentState => ({
      ...state,
      classStudents: classStudents,
    })
  ),
  on(
    getClassStudentsArrayError,
    (state, { message }): ClassStudentState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // update class students array
  on(
    updateClassStudentObjectRequest,
    (state, { id, classStudent }): ClassStudentState => ({
      ...state,
    })
  ),
  on(
    updateClassStudentObjectSuccess,
    (state, { classStudent }): ClassStudentState => {
      const index = state.classStudents.findIndex(
        (student) => student._id! == classStudent._id!
      );

      console.log(`This is the update index: ${index}`);

      const newArray = [...state.classStudents];
      newArray[index] = classStudent;

      return {
        ...state,
        classStudents: newArray,
        errorMessage: '',
      };
    }
  ),
  on(
    updateClassStudentObjectError,
    (state, { message }): ClassStudentState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // delete class student object
  on(
    deleteClassStudentObjectRequest,
    (state, { id }): ClassStudentState => ({ ...state })
  ),
  on(deleteClassStudentObjectSuccess, (state, { id }): ClassStudentState => {
    const newArr = state.classStudents.filter((student) => student._id! !== id);
    console.log(newArr);

    return {
      ...state,
      classStudents: newArr,
    };
  }),
  on(
    deleteClassStudentObjectError,
    (state, { message }): ClassStudentState => ({
      ...state,
      errorMessage: message,
    })
  )
);
