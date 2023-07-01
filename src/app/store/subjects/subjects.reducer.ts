import { createReducer, on } from '@ngrx/store';
import { ISubjects } from 'src/app/shared/add-subjects/add-subjects.interface';
import {
  addSubjectsPaginatorOptions,
  deleteSubjectError,
  deleteSubjectRequest,
  deleteSubjectSuccess,
  getSubjectsError,
  getSubjectsRequest,
  getSubjectsSuccess,
  postSubjectArrayError,
  postSubjectArrayRequest,
  postSubjectArraySuccess,
  subjectsIsLoading,
  updateSubjectRequest,
  updateSubjectsError,
  updateSubjectSuccess,
} from './subjects.actions';

export interface SubjectsState {
  subjects: ISubjects[];
  subjectsIsLoading: boolean;
  errorMessage: string;
  paginator: {
    currentPage: number;
    pageSize: number;
    count: number;
  };
}

export const initialState: SubjectsState = {
  subjects: null as any,
  subjectsIsLoading: false,
  errorMessage: '',
  paginator: {
    currentPage: 0,
    pageSize: 0,
    count: 0,
  },
};

export const subjectsReducer = createReducer(
  initialState,
  on(
    subjectsIsLoading,
    (state, { subjectsIsLoading }): SubjectsState => ({
      ...state,
      subjectsIsLoading: subjectsIsLoading,
    })
  ),
  on(
    addSubjectsPaginatorOptions,
    (state, { paginator }): SubjectsState => ({
      ...state,
      paginator: paginator,
    })
  ),

  // API GET
  on(
    getSubjectsRequest,
    (state, { currentPage, pageSize }): SubjectsState => ({
      ...state,
    })
  ),
  on(
    getSubjectsSuccess,
    (state, { subjects }): SubjectsState => ({
      ...state,
      subjects: subjects,
    })
  ),
  on(
    getSubjectsError,
    (state, { message }): SubjectsState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // API POST
  on(
    postSubjectArrayRequest,
    (state, { subjects }): SubjectsState => ({
      ...state,
    })
  ),
  on(
    postSubjectArraySuccess,
    (state, { subjects }): SubjectsState => ({
      ...state,
      subjects: subjects,
      errorMessage: '',
    })
  ),
  on(
    postSubjectArrayError,
    (state, { message }): SubjectsState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // API UPDATE
  on(
    updateSubjectRequest,
    (state, { id, subjects }): SubjectsState => ({
      ...state,
    })
  ),
  on(updateSubjectSuccess, (state, { id, subjects }): SubjectsState => {
    const index = state.subjects.findIndex(
      (subject) => subject._id || '' !== subjects._id || ''
    );

    const newArray = [...state.subjects];
    newArray[index] = subjects;

    return {
      ...state,
      subjects: newArray,
      errorMessage: '',
    };
  }),
  on(
    updateSubjectsError,
    (state, { message }): SubjectsState => ({
      ...state,
      errorMessage: message,
    })
  ),

  // API DELETE
  on(
    deleteSubjectRequest,
    (state, { id }): SubjectsState => ({
      ...state,
    })
  ),
  on(deleteSubjectSuccess, (state, { id }): SubjectsState => {
    const newArr = state.subjects.filter(
      (subject) => subject._id! !== id.toString()
    );

    return {
      ...state,
      subjects: newArr,
    };
  }),
  on(
    deleteSubjectError,
    (state, { message }): SubjectsState => ({
      ...state,
      errorMessage: message,
    })
  )
);
