import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StreamState } from './streams.reducer';

export const selectStream = createFeatureSelector<StreamState>('stream');

export const selectStreamIsLoading = createSelector(
  selectStream,
  (state: StreamState) => state.streamIsLoading
);

export const selectStreamErrorMessage = createSelector(
  selectStream,
  (state: StreamState) => state.errorMessage
);

export const selectStreamsArray = createSelector(
  selectStream,
  (state: StreamState) => state.streams
);

export const selectPostSuccess = createSelector(
  selectStream,
  (state: StreamState) => state.postSuccess
)
