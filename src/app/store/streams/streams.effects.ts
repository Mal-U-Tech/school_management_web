import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { ClassnameApiService } from 'src/app/shared/classname/classname-api.service';
import {
  IClassnameArray,
  IClassnamePaginatorResult,
  IClassnamePostResult,
} from 'src/app/shared/classname/classname.interface';
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
  postSuccessAction,
  streamPaginatorOptions,
  streamsIsLoading,
} from './streams.actions';

@Injectable()
export class StreamEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly streamService: ClassnameApiService,
    private readonly router: Router
  ) {}

  // get streams from server
  getStreamsRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getStreamsRequest),
      mergeMap(({ currentPage, pageSize }) =>
        from(this.streamService.viewAllClasses(currentPage, pageSize)).pipe(
          catchError((error) => {
            this.streamService.errorToast(error);
            return of(
              streamsIsLoading({ streamsIsLoading: false }),
              getStreamsError({ message: error })
            );
          })
        )
      ),
      switchMap((res) => {
        console.log(res);
        const result = res as IClassnamePaginatorResult;
        return of(
          streamsIsLoading({ streamsIsLoading: false }),
          getStreamsSuccess({ streams: result.data })
        );
      })
      // switchMap(() => of(streamsIsLoading({ streamsIsLoading: false })))
    );
  });

  // post streams array
  postStreamsArrayRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postStreamArrayRequest),
      switchMap(({ classnames }) =>
        from(this.streamService.postClassnamesArray(classnames)).pipe(
          // tap(() => closeEmitter.emit()),
          // map(({ success, message, data }) =>
          //   of(postStreamArraySuccess({ classnames: data, postSuccess: true }))
          // ),
          catchError((error) => {
            this.streamService.errorToast(error);
            return of(
              streamsIsLoading({ streamsIsLoading: false }),
              postStreamArrayError({ message: error })
            );
          })
        )
      ),
      switchMap((data) => {
        const res = data as IClassnamePostResult;

        return of(
          streamsIsLoading({ streamsIsLoading: false }),
          postSuccessAction({ postSuccess: true }),
          postStreamArraySuccess({
            classnames: res.data as IClassnameArray,
          })
        );
      })
    );
  });

  // delete stream request
  deleteStreamRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteStreamRequest),
      switchMap(({ id }) =>
        from(this.streamService.deleteClassname(id)).pipe(
          catchError((error) => {
            this.streamService.errorToast(error);
            return of(
              streamsIsLoading({ streamsIsLoading: false }),
              deleteStreamError({ message: error })
            );
          })
        )
      ),
      switchMap((data) => {
        // console.log(data);

        const res = data as { id: string };

        console.log(res.id);
        return of(
          streamsIsLoading({ streamsIsLoading: false }),
          deleteStreamSuccess({ id:res.id})
        );
      })
    );
  });
}
