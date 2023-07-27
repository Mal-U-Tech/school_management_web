import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { IPassControls } from 'src/app/pass-controls/models/pass-controls.model';
import { PassControlsService } from 'src/app/shared/pass-controls/pass-controls.service';
import {
  deletePassControlsError,
  deletePassControlsRequest,
  deletePassControlsSuccess,
  getPassControlsByScoresheetError,
  getPassControlsByScoresheetRequest,
  getPassControlsByScoresheetSuccess,
  getPassControlsError,
  getPassControlsRequest,
  getPassControlsSuccess,
  passControlsIsLoading,
  postPassControlsError,
  postPassControlsRequest,
  postPassControlsSuccess,
  updatePassControlsError,
  updatePassControlsRequest,
  updatePassControlsSuccess,
} from './pass-control.action';

@Injectable()
export class PassControlsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly service: PassControlsService,
  ) {}

  postPassControlsRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postPassControlsRequest),
      mergeMap(({ passControls }) =>
        from(this.service.postPassControls(passControls)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              passControlsIsLoading({ isLoading: false }),
              postPassControlsError({ message: error }),
            );
          }),
        ),
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as IPassControls;
        // this.service.appendPassControls = result;

        return of(
          passControlsIsLoading({ isLoading: false }),
          postPassControlsSuccess({ passControls: result }),
        );
      }),
    );
  });

  getPassControlsRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getPassControlsRequest),
      mergeMap(() =>
        from(this.service.getAllPassControls()).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              passControlsIsLoading({ isLoading: false }),
              getPassControlsError({ message: error }),
            );
          }),
        ),
      ),
      mergeMap((res) => {
        console.log(res);

        const result: IPassControls[] = res as IPassControls[];

        return of(
          passControlsIsLoading({ isLoading: false }),
          getPassControlsSuccess({ passControls: result }),
        );
      }),
    );
  });

  getPassControlsByScoresheetRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getPassControlsByScoresheetRequest),
      mergeMap(({ id }) =>
        from(this.service.getControlsByScoresheet(id)).pipe(
          catchError((error) => {
            this.service.errorToast(error);
            console.log(`This is error pass controls by scoresheet`);

            return of(
              passControlsIsLoading({ isLoading: false }),
              getPassControlsByScoresheetError({ message: error }),
            );
          }),
        ),
      ),
      mergeMap((res) => {
        console.log(res);

        let result = res as IPassControls[];

        if (!result?.length) {
          console.log('This is where I am.');
          result = [];
        }
        return of(
          passControlsIsLoading({ isLoading: false }),
          getPassControlsByScoresheetSuccess({ passControls: result }),
        );
      }),
    );
  });

  updatePassControlsRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updatePassControlsRequest),
      mergeMap(({ id, passControls }) =>
        from(this.service.patchPassControl(id, passControls)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              passControlsIsLoading({ isLoading: false }),
              updatePassControlsError({ message: error }),
            );
          }),
        ),
      ),
      mergeMap((res) => {
        console.log(res);
        const result = res as IPassControls;

        // this.service.updatePassControl = result;

        return of(
          passControlsIsLoading({ isLoading: false }),
          updatePassControlsSuccess({ passControl: result }),
        );
      }),
    );
  });

  deletePassControlsRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deletePassControlsRequest),
      mergeMap(({ id }) =>
        from(this.service.deletePassControl(id)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              passControlsIsLoading({ isLoading: false }),
              deletePassControlsError({ message: error }),
            );
          }),
        ),
      ),
      mergeMap((res) => {
        console.log(res);
        const result = res as { id: string };

        return of(
          passControlsIsLoading({ isLoading: false }),
          deletePassControlsSuccess({ id: result.id }),
        );
      }),
    );
  });
}
