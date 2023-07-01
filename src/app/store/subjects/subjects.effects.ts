import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, mergeMap, of, switchMap } from 'rxjs';
import {
  ISubjects,
  ISubjectsGetResponse,
} from 'src/app/shared/add-subjects/add-subjects.interface';
import { AddSubjectsService } from 'src/app/shared/add-subjects/add-subjects.service';
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

@Injectable()
export class SubjectEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly subjectsService: AddSubjectsService,
    private readonly router: Router
  ) {}

  // get subjects from server
  getSubjectsRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getSubjectsRequest),
      mergeMap(({ currentPage, pageSize }) =>
        from(this.subjectsService.getAllSubjects(currentPage, pageSize)).pipe(
          catchError((error) => {
            this.subjectsService.errorToast(error);
            return of(
              subjectsIsLoading({ subjectsIsLoading: false }),
              getSubjectsError({ message: error })
            );
          })
        )
      ),
      switchMap((res) => {
        console.log(res);
        const result = res as any;

        return of(
          subjectsIsLoading({ subjectsIsLoading: false }),
          getSubjectsSuccess({ subjects: result.data })
        );
      })
    );
  });

  // post subjects to server
  postSubjectsArrayRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postSubjectArrayRequest),
      mergeMap(({ subjects }) =>
        from(this.subjectsService.postSubjects(subjects)).pipe(
          catchError((error) => {
            this.subjectsService.errorToast(error);
            return of(
              subjectsIsLoading({ subjectsIsLoading: false }),
              postSubjectArrayError({ message: error })
            );
          })
        )
      ),
      switchMap((res) => {
        console.log(res);
        const result = res as any;
        return of(
          subjectsIsLoading({ subjectsIsLoading: false }),
          postSubjectArraySuccess({ subjects: result.data }),
          addSubjectsPaginatorOptions({
            paginator: {
              pageSize: result.rows_per_page,
              count: result.count,
              currentPage: result.pageNo,
            },
          })
        );
      })
    );
  });

  // update subjects
  updateSubjectRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateSubjectRequest),
      mergeMap(({ id, subjects }) =>
        from(this.subjectsService.updateSubject(id, subjects)).pipe(
          catchError((error) => {
            this.subjectsService.errorToast(error);
            return of(
              subjectsIsLoading({ subjectsIsLoading: false }),
              updateSubjectsError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);
        const result = res as any;
        return of(
          subjectsIsLoading({ subjectsIsLoading: false }),
          updateSubjectSuccess({ id: result._id, subjects: res as ISubjects })
        );
      })
    );
  });

  // delete subjects
  deleteSubjectRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteSubjectRequest),
      mergeMap(({ id }) =>
        from(this.subjectsService.deleteSubject(id)).pipe(
          catchError((error) => {
            this.subjectsService.errorToast(error);

            return of(
              subjectsIsLoading({ subjectsIsLoading: false }),
              deleteSubjectError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);
        const result = res as any;

        return of(
          subjectsIsLoading({ subjectsIsLoading: false }),
          deleteSubjectSuccess({ id: result.id })
        );
      })
    );
  });
}
