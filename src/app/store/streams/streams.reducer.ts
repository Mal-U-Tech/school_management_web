import { createReducer, on } from '@ngrx/store';
import { IClassname } from 'src/app/shared/classname/classname.interface';
import {
  deleteStreamError,
  deleteStreamRequest,
  deleteStreamSuccess,
  getStreamsError,
  getStreamsRequest,
  getStreamsSuccess,
  postStreamArrayError,
  postStreamArrayRequest,
  postStreamArraySuccess,
  postStreamRequest,
  postStreamRequestError,
  postStreamRequestSuccess,
  postSuccessAction,
  streamPaginatorOptions,
  streamsIsLoading,
  updateStreamError,
  updateStreamRequest,
  updateStreamSuccess,
} from './streams.actions';

export interface StreamState {
  streams: IClassname[];
  streamIsLoading: boolean;
  errorMessage: string;
  paginator: {
    currentPage: number;
    pageSize: number;
  };
  postSuccess: boolean;
}

export const initialState: StreamState = {
  streams: null as any,
  streamIsLoading: false,
  errorMessage: '',
  paginator: {
    currentPage: 0,
    pageSize: 10,
  },
  postSuccess: false,
};

export const streamsReducer = createReducer(
  initialState,
  on(
    streamsIsLoading,
    (state, { streamsIsLoading }): StreamState => ({
      ...state,
      streamIsLoading: streamsIsLoading,
    })
  ),
  on(
    streamPaginatorOptions,
    (state, { currentPage, pageSize }): StreamState => ({
      ...state,
      paginator: {
        currentPage: currentPage,
        pageSize: pageSize,
      },
    })
  ),
  // get streams actions
  on(
    getStreamsRequest,
    (state, { schoolId, currentPage, pageSize }): StreamState => ({ ...state })
  ),
  on(
    getStreamsSuccess,
    (state, { streams }): StreamState => ({ ...state, streams: streams })
  ),
  on(
    getStreamsError,
    (state, { message }): StreamState => ({ ...state, errorMessage: message })
  ),
  // post streams actions
  on(postStreamRequest, (state, { classname }): StreamState => ({ ...state })),
  on(
    postStreamRequestSuccess,
    (state, { classname }): StreamState => ({
      ...state,
      streams: [...state.streams, classname],
    })
  ),
  on(
    postStreamRequestError,
    (state, { message }): StreamState => ({
      ...state,
      errorMessage: message,
    })
  ),
  on(
    postStreamArrayRequest,
    (state, { classnames, postSuccess }): StreamState => ({ ...state })
  ),
  on(postStreamArraySuccess, (state, { classnames }): StreamState => {
    const newArray: IClassname[] = [];

    console.log(classnames);
    classnames.names.forEach((stream) => newArray.push(stream));

    return {
      ...state,
      streams: [...state.streams, ...newArray],
    };
  }),
  on(
    postSuccessAction,
    (state, { postSuccess }): StreamState => ({
      ...state,
      postSuccess: postSuccess,
    })
  ),
  on(
    postStreamArrayError,
    (state, { message }): StreamState => ({ ...state, errorMessage: message })
  ),

  // update streams actions
  on(
    updateStreamRequest,
    (state, { id, classname }): StreamState => ({ ...state })
  ),
  on(updateStreamSuccess, (state, { classname }): StreamState => {
    const index = state.streams.findIndex(
      (stream) => stream._id || '' !== classname._id || ''
    ); // finding index of the item

    const newArray = [...state.streams]; // making new array
    newArray[index] = classname;

    return {
      ...state,
      streams: newArray,
      errorMessage: '',
    };
  }),
  on(
    updateStreamError,
    (state, { message }): StreamState => ({ ...state, errorMessage: message })
  ),
  // delete streams actions
  on(deleteStreamRequest, (state, { id }): StreamState => ({ ...state })),
  on(
    deleteStreamSuccess,
    (state, { id }): StreamState => ({
      ...state,
      streams: state.streams.filter((stream) => stream._id! !== id),
    })
  ),
  on(
    deleteStreamError,
    (state, { message }): StreamState => ({ ...state, errorMessage: message })
  )
);
