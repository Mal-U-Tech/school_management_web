import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, mergeMap, of } from 'rxjs';
import { IClassStudent } from 'src/app/shared/class-students/class-students.interface';
import { ClassStudentsService } from 'src/app/shared/class-students/class-students.service';
import {
  classStudentsIsLoading,
  classStudentsPaginatorOptions,
  deleteClassStudentObjectError,
  deleteClassStudentObjectRequest,
  deleteClassStudentObjectSuccess,
  getClassStudentsArrayError,
  getClassStudentsArrayRequest,
  getClassStudentsArraySuccess,
  postClassStudentObjectError,
  postClassStudentObjectRequest,
  postClassStudentObjectSuccess,
  postClassStudentsArrayError,
  postClassStudentsArrayRequest,
  postClassStudentsArraySuccess,
  updateClassStudentObjectError,
  updateClassStudentObjectRequest,
  updateClassStudentObjectSuccess,
} from './class-students.actions';

@Injectable()
export class ClassStudentEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly service: ClassStudentsService
  ) {}

  // get class students array
  getClassStudentsArrayRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getClassStudentsArrayRequest),
      mergeMap(({ currentPage, pageSize }) =>
        from(this.service.getAllLearners(currentPage, pageSize)).pipe(
          catchError((error) => {
            this.service.errorToast(error);
            return of(
              classStudentsIsLoading({ classStudentsIsLoading: false }),
              getClassStudentsArrayError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as any;

        return of(
          classStudentsIsLoading({ classStudentsIsLoading: false }),
          getClassStudentsArraySuccess({ classStudents: result.data }),
          classStudentsPaginatorOptions({
            paginator: {
              currentPage: result.pageNo,
              pageSize: result.rows_per_page,
              count: result.count,
            },
          })
        );
      })
    );
  });

  // post class student array
  postClassStudentArrayRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postClassStudentsArrayRequest),
      mergeMap(({ classStudents }) =>
        from(this.service.postStudentArray(classStudents)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              classStudentsIsLoading({ classStudentsIsLoading: false }),
              postClassStudentsArrayError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as any;

        return of(
          classStudentsIsLoading({ classStudentsIsLoading: false }),
          postClassStudentsArraySuccess({ classStudents: result.data })
        );
      })
    );
  });

  // post class student object
  postClassStudentObjectRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postClassStudentObjectRequest),
      mergeMap(({ classStudent }) =>
        from(this.service.postStudent(classStudent)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              classStudentsIsLoading({ classStudentsIsLoading: false }),
              postClassStudentObjectError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as any;

        return of(
          classStudentsIsLoading({ classStudentsIsLoading: false }),
          postClassStudentObjectSuccess({ classStudent: result })
        );
      })
    );
  });

  // update class student object
  updateClassStudentObject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateClassStudentObjectRequest),
      mergeMap(({ id, classStudent }) =>
        from(this.service.updateStudent(id, classStudent)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              classStudentsIsLoading({ classStudentsIsLoading: false }),
              updateClassStudentObjectError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as IClassStudent;
        this.service.successToast('Class student updated successfully.');
        return of(
          classStudentsIsLoading({ classStudentsIsLoading: false }),
          updateClassStudentObjectSuccess({ classStudent: result })
        );
      })
    );
  });

  // delete class student object
  deleteClassStudentObjectRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteClassStudentObjectRequest),
      mergeMap(({ id }) =>
        from(this.service.deleteStudent(id)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              classStudentsIsLoading({ classStudentsIsLoading: false }),
              deleteClassStudentObjectError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);
        const result = res as {id:string};

        this.service.successToast('Successfully deleted student');

        return of(
          classStudentsIsLoading({ classStudentsIsLoading: false }),
          deleteClassStudentObjectSuccess({ id: result.id })
        );
      })
    );
  });
}
