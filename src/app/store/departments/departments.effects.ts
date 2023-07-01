import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, mergeMap, of, switchMap } from 'rxjs';
import {
  IDepartmentsGetResponse,
  IDepartmentsPostResult,
} from 'src/app/shared/add-departments/add-departments.interface';
import { AddDepartmentsService } from 'src/app/shared/add-departments/add-departments.service';
import {
  addDepartmentPaginatorOptions,
  deleteDepartmentError,
  deleteDepartmentRequest,
  deleteDepartmentSuccess,
  departmentsIsLoading,
  getDepartmentsError,
  getDepartmentsRequest,
  getDepartmentsSuccess,
  postDepartmentsArrayError,
  postDepartmentsArrayRequest,
  postDepartmentsArraySuccess,
  updateDepartmentError,
  updateDepartmentRequest,
} from './departments.actions';

@Injectable()
export class DepartmentEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly deptService: AddDepartmentsService,
    private readonly router: Router
  ) {}

  // get departments from server
  getDepartmentsRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getDepartmentsRequest),
      mergeMap(({ currentPage, pageSize }) =>
        from(this.deptService.viewAllDepartments(currentPage, pageSize)).pipe(
          catchError((error) => {
            this.deptService.errorToast(error);

            return of(
              departmentsIsLoading({ departmentsIsLoading: false }),
              getDepartmentsError({ message: error })
            );
          })
        )
      ),
      switchMap((response) => {
        console.log(response);
        const result = response as IDepartmentsGetResponse;

        return of(
          departmentsIsLoading({ departmentsIsLoading: false }),
          getDepartmentsSuccess({ departments: result.data }),
          addDepartmentPaginatorOptions({
            paginator: {
              pageSize: result.row_per_page,
              count: result.count,
              currentPage: result.pageNo,
            },
          })
        );
      })
    );
  });

  // post departments array from server
  postDepartmentsArrayRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postDepartmentsArrayRequest),
      mergeMap(({ departments }) =>
        from(this.deptService.postDepartmentsArray(departments)).pipe(
          catchError((error) => {
            this.deptService.errorToast(error);
            return of(
              departmentsIsLoading({ departmentsIsLoading: false }),
              postDepartmentsArrayError({ message: error })
            );
          })
        )
      ),
      switchMap((res) => {
        console.log(res);
        const result = res as any;

        return of(
          departmentsIsLoading({ departmentsIsLoading: false }),
          postDepartmentsArraySuccess({ departments: result.data })
        );
      })
    );
  });

  // update department
  updateDepartmentRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateDepartmentRequest),
      mergeMap(({ id, department }) =>
        from(this.deptService.updateDepartment(id, department)).pipe(
          catchError((error) => {
            return of(
              departmentsIsLoading({ departmentsIsLoading: false }),
              updateDepartmentError({ message: error })
            );
          })
        )
      ),
      switchMap((res) => {
        console.log(res);

        return of(departmentsIsLoading({ departmentsIsLoading: false }));
      })
    );
  });

  // delete department
  deleteDepartmentRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteDepartmentRequest),
      mergeMap(({ id }) =>
        from(this.deptService.deleteDepartment(id)).pipe(
          catchError((error) => {
            this.deptService.errorToast(error);

            return of(
              departmentsIsLoading({ departmentsIsLoading: false }),
              deleteDepartmentError({ message: error })
            );
          })
        )
      ),
      switchMap((res) => {
        // console.log(res);
        const result = res as { id: string };
        console.log(result);
        return of(
          departmentsIsLoading({ departmentsIsLoading: false }),
          deleteDepartmentSuccess({ id: result.id })
        );
      })
    );
  });
}
