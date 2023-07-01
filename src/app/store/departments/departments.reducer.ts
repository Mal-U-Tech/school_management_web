import { createReducer, on } from '@ngrx/store';
import { IDepartments } from 'src/app/shared/add-departments/add-departments.interface';
import {
  addDepartmentPaginatorOptions,
  deleteDepartmentError,
  deleteDepartmentRequest,
  deleteDepartmentSuccess,
  departmentsIsLoading,
  getDepartmentsError,
  getDepartmentsRequest,
  getDepartmentsSuccess,
  postDepartmentError,
  postDepartmentRequest,
  postDepartmentsArrayError,
  postDepartmentsArrayRequest,
  postDepartmentsArraySuccess,
  postDepartmentSuccess,
  updateDepartmentError,
  updateDepartmentRequest,
  updateDepartmentSuccess,
} from './departments.actions';

export interface DepartmentState {
  departments: IDepartments[];
  departmentsIsLoading: boolean;
  errorMessage: string;
  paginator: {
    currentPage: number;
    pageSize: number;
    count: number;
  };
}

export const initialState: DepartmentState = {
  departments: null as any,
  departmentsIsLoading: false,
  errorMessage: '',
  paginator: {
    currentPage: 0,
    pageSize: 10,
    count: 0,
  },
};

export const departmentsReducer = createReducer(
  initialState,
  on(
    departmentsIsLoading,
    (state, { departmentsIsLoading }): DepartmentState => ({
      ...state,
      departmentsIsLoading: departmentsIsLoading,
    })
  ),
  on(
    addDepartmentPaginatorOptions,
    (state, { paginator }): DepartmentState => ({
      ...state,
      paginator: paginator,
    })
  ),

  // get actions reducer
  on(
    getDepartmentsRequest,
    (state, { currentPage, pageSize }): DepartmentState => ({ ...state })
  ),
  on(
    getDepartmentsSuccess,
    (state, { departments }): DepartmentState => ({
      ...state,
      departments: departments,
    })
  ),
  on(
    getDepartmentsError,
    (state, { message }): DepartmentState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // post actions reducer
  on(
    postDepartmentRequest,
    (state, { department }): DepartmentState => ({ ...state })
  ),
  on(
    postDepartmentSuccess,
    (state, { department }): DepartmentState => ({
      ...state,
      departments: [...state.departments, department],
    })
  ),
  on(
    postDepartmentError,
    (state, { message }): DepartmentState => ({
      ...state,
      errorMessage: message,
    })
  ),
  on(
    postDepartmentsArrayRequest,
    (state, { departments }): DepartmentState => ({ ...state })
  ),
  on(
    postDepartmentsArraySuccess,
    (state, { departments }): DepartmentState => ({
      ...state,
      departments: departments,
    })
  ),
  on(
    postDepartmentsArrayError,
    (state, { message }): DepartmentState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // update actions reducer
  on(
    updateDepartmentRequest,
    (state, { id, department }): DepartmentState => ({ ...state })
  ),
  on(updateDepartmentSuccess, (state, { id, department }): DepartmentState => {
    const index = state.departments.findIndex(
      (department) => department._id || '' !== department._id || ''
    );

    const newArray = [...state.departments];
    newArray[index] = department;

    return {
      ...state,
      departments: newArray,
      errorMessage: '',
    };
  }),
  on(
    updateDepartmentError,
    (state, { message }): DepartmentState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // delete actions reducer
  on(
    deleteDepartmentRequest,
    (state, { id }): DepartmentState => ({
      ...state,
    })
  ),
  on(deleteDepartmentSuccess, (state, { id }): DepartmentState => {
    // console.log('This is the id: ' + id);
    const newArr = state.departments.filter(
      (dept) => dept._id!.toString() !== id.toString()
    );
    // console.log(newArr);
    return {
      ...state,
      departments: newArr,
    };
  }),
  on(
    deleteDepartmentError,
    (state, { message }): DepartmentState => ({
      ...state,
      errorMessage: message,
    })
  )
);
