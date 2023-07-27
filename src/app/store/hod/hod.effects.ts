import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, mergeMap, of } from 'rxjs';
import { IHOD, IHodGetResponse } from 'src/app/shared/hod/hod.interface';
import { HodService } from 'src/app/shared/hod/hod.service';
import {
    deleteHodError,
    deleteHodRequest,
  deleteHodSuccess,
  getHodError,
  getHodRequest,
  getHodSuccess,
  hodIsLoading,
  postHodError,
  postHodRequest,
  postHodSuccess,
  updateHodError,
  updateHodRequest,
  updateHodSuccess,
} from './hod.actions';

@Injectable()
export class HodEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly service: HodService
  ) {}

  postHodRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postHodRequest),
      mergeMap(({ hod }) =>
        from(this.service.postHOD(hod)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              hodIsLoading({ hodIsLoading: false }),
              postHodError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as IHOD;

        return of(
          hodIsLoading({ hodIsLoading: false }),
          postHodSuccess({ hod: result })
        );
      })
    );
  });

  getHodRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getHodRequest),
      mergeMap(({ currentPage, pageSize }) =>
        from(this.service.getAllHODs(currentPage, pageSize)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              hodIsLoading({ hodIsLoading: false }),
              getHodError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as IHodGetResponse;

        return of(
          hodIsLoading({ hodIsLoading: false }),
          getHodSuccess({ hods: result.data })
        );
      })
    );
  });

  updateHodRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateHodRequest),
      mergeMap(({id, hod}) => from(this.service.updateHOD(id, hod)).pipe(
        catchError((error) => {
          this.service.errorToast(error);

          return of(
            hodIsLoading({hodIsLoading: false}),
            updateHodError({message: error})
          );
        })
      )),
      mergeMap((res) => {
        console.log(res);

        const result  = res as IHOD;

        return of(
          hodIsLoading({hodIsLoading: false}),
          updateHodSuccess({hod: result})
        );

      }),
    );
  });

  deleteHodRequest$ = createEffect(()=> {
    return this.actions$.pipe(
      ofType(deleteHodRequest),
      mergeMap(({id}) => from(this.service.deleteHOD(id)).pipe(
        catchError((error) => {
          this.service.errorToast(error);

          return of(
            hodIsLoading({hodIsLoading: false}),
            deleteHodError({message: error})
          );
        })
      )),
      mergeMap((res) => {
        console.log(res);

        const result = res as {id: string};

        return of(
          hodIsLoading({hodIsLoading: false}),
          deleteHodSuccess({id: result.id})
        );
      }),
    );
  });
}
