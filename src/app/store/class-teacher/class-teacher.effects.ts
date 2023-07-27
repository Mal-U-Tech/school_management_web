import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, mergeMap, of } from 'rxjs';
import { IClassTeacher } from 'src/app/shared/class-teacher/class-teacher.interface';
import { ClassTeacherService } from 'src/app/shared/class-teacher/class-teacher.service';
import {
  classTeacherIsLoading,
  deleteClassTeacherError,
  deleteClassTeacherRequest,
  deleteClassTeacherSuccess,
  getClassTeachersError,
  getClassTeachersRequest,
  getClassTeachersSuccess,
  postClassTeacherError,
  postClassTeacherRequest,
  postClassTeacherSuccess,
  updateClassTeacherError,
  updateClassTeacherRequest,
  updateClassTeacherSuccess,
} from './class-teacher.actions';

@Injectable()
export class ClassTeacherEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly service: ClassTeacherService
  ) {}

  // post class teacher effect
  postClassTeacherRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postClassTeacherRequest),
      mergeMap(({ classTeacher }) =>
        from(this.service.postClassTeacher(classTeacher)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              classTeacherIsLoading({ classTeacherIsLoading: false }),
              postClassTeacherError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as IClassTeacher;

        return of(
          classTeacherIsLoading({ classTeacherIsLoading: false }),
          postClassTeacherSuccess({ classTeacher: result })
        );
      })
    );
  });

  // get class teacher reducer
  getClassTeachersRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getClassTeachersRequest),
      mergeMap(({ currentPage, pageSize }) =>
        from(this.service.getAllClassTeachers(currentPage, pageSize)).pipe(
          catchError((error) => {
            this.service.errorToast(error);
            return of(
              classTeacherIsLoading({ classTeacherIsLoading: false }),
              getClassTeachersError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as IClassTeacher[];

        return of(
          classTeacherIsLoading({ classTeacherIsLoading: false }),
          getClassTeachersSuccess({ classTeachers: result })
        );
      })
    );
  });

  // update class teacher reducer
  updateClassTeacherRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateClassTeacherRequest),
      mergeMap(({ id, classTeacher }) =>
        from(this.service.updateClassTeacher(id, classTeacher)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              classTeacherIsLoading({ classTeacherIsLoading: false }),
              updateClassTeacherError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as IClassTeacher;

        return of(
          classTeacherIsLoading({ classTeacherIsLoading: false }),
          updateClassTeacherSuccess({ classTeacher: result })
        );
      })
    );
  });

  // delete class teacher reducer
  deleteClassTeacherRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteClassTeacherRequest),
      mergeMap(({ id }) =>
        from(this.service.deleteClassTeacher(id)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              classTeacherIsLoading({ classTeacherIsLoading: false }),
              deleteClassTeacherError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as { id: string };

        return of(
          classTeacherIsLoading({ classTeacherIsLoading: false }),
          deleteClassTeacherSuccess({ id: result.id })
        );
      })
    );
  });
}
