import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, mergeMap, of } from 'rxjs';
import { IScoresheet } from 'src/app/shared/scoresheet/scoresheet.interface';
import { ScoresheetService } from 'src/app/shared/scoresheet/scoresheet.service';
import {
    deleteScoresheetError,
    deleteScoresheetRequest,
    deleteScoresheetSuccess,
    getScoresheetError,
    getScoresheetRequest,
  getScoresheetSuccess,
  postScoresheetError,
  postScoresheetRequest,
  postScoresheetSuccess,
  scoresheetIsLoading,
  updateScoresheetError,
  updateScoresheetRequest,
  updateScoresheetSuccess,
} from './scoresheet.action';

@Injectable()
export class ScoresheetEffects {
  constructor(
    private readonly service: ScoresheetService,
    private readonly actions$: Actions
  ) {}

  postScoresheetRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postScoresheetRequest),
      mergeMap(({ scoresheet }) =>
        from(this.service.postScoresheet(scoresheet)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              scoresheetIsLoading({ isLoading: false }),
              postScoresheetError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as IScoresheet;

        return of(
          scoresheetIsLoading({ isLoading: false }),
          postScoresheetSuccess({ scoresheet: result })
        );
      })
    );
  });

  getScoresheetRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getScoresheetRequest),
      mergeMap(() => from(this.service.getAllScoresheets()).pipe(
        catchError((error) => {
          this.service.errorToast(error);

          return of(
            scoresheetIsLoading({isLoading: false}),
            getScoresheetError({message: error})
          );
        })
      )),
      mergeMap((res) => {
        console.log(res);

        const result = res as IScoresheet[];

        return of(
          scoresheetIsLoading({isLoading: false}),
          getScoresheetSuccess({scoresheets: result})
        );
      })
    );
  });

  updateScoresheetRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateScoresheetRequest),
      mergeMap(({id, scoresheet}) => from(
        this.service.updateScoresheet(id, scoresheet)
      ).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              scoresheetIsLoading({isLoading: false}),
              updateScoresheetError({message: error})
            )
          })
        )),
      mergeMap((res) => {
        console.log(res);

        const result = res as IScoresheet;

        return of(
          scoresheetIsLoading({isLoading: false}),
          updateScoresheetSuccess({scoresheet: result})
        );
      })
    );
  });

  deleteScoresheetRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteScoresheetRequest),
      mergeMap(({id}) => from(
        this.service.deleteScoresheet(id)
      ).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              scoresheetIsLoading({isLoading: false}),
              deleteScoresheetError({message: error}),
            );
          })
        )),
      mergeMap((res) => {
        console.log(res);

        const result = res as {id: string};

        return of(
          scoresheetIsLoading({isLoading: false}),
          deleteScoresheetSuccess({id: result.id})
        );
      })
    );
  })
}
