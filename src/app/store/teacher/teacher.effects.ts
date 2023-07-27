import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, mergeMap, of } from 'rxjs';
import {
  ITeacher,
  ITeacherGetResponse,
} from 'src/app/shared/teacher/teacher.interface';
import { TeacherService } from 'src/app/shared/teacher/teacher.service';
import {
  deleteTeacherError,
  deleteTeacherRequest,
  deleteTeacherSuccess,
  getTeachersError,
  getTeachersRequest,
  getTeachersSuccess,
  postTeacherError,
  postTeacherRequest,
  postTeacherSuccess,
  teacherIsLoading,
  updateTeacherError,
  updateTeacherRequest,
  updateTeacherSuccess,
} from './teacher.actions';

@Injectable()
export class TeacherEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly teacherService: TeacherService,
    private readonly router: Router
  ) {}

  // post teacher to server
  postTeacherRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postTeacherRequest),
      mergeMap(({ teacher, schoolInfoId }) =>
        from(this.teacherService.postTeacher(teacher, schoolInfoId)).pipe(
          catchError((error) => {
            this.teacherService.errorToast(error);
            return of(
              teacherIsLoading({ teacherIsLoading: false }),
              postTeacherError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);
        const result = res as ITeacher;
        result.title = this.teacherService.computeTeacherTitle(
          result.gender,
          result.marital_status
        );

        return of(
          teacherIsLoading({ teacherIsLoading: false }),
          postTeacherSuccess({ teacher: result })
        );
      })
    );
  });

  // get teacher from server
  getTeacherRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getTeachersRequest),
      mergeMap(({ currentPage, pageSize }) =>
        from(this.teacherService.getAllTeachers(currentPage, pageSize)).pipe(
          catchError((error) => {
            this.teacherService.errorToast(error);
            return of(
              teacherIsLoading({ teacherIsLoading: false }),
              getTeachersError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);
        const result = res as ITeacherGetResponse;

        // add title to every teacher in array
        result.data.forEach((teacher) =>
          teacher.title = this.teacherService.computeTeacherTitle(
            teacher.gender,
            teacher.marital_status
          )
        );

        return of(
          teacherIsLoading({ teacherIsLoading: false }),
          getTeachersSuccess({ teachers: result.data })
        );
      })
    );
  });

  // update teacher in server
  updateTeacherRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateTeacherRequest),
      mergeMap(({ id, teacher }) =>
        from(this.teacherService.updateTeacher(id, teacher)).pipe(
          catchError((error) => {
            this.teacherService.errorToast(error);
            return of(
              teacherIsLoading({ teacherIsLoading: false }),
              updateTeacherError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);
        const result = res as any;

        return of(
          teacherIsLoading({ teacherIsLoading: false }),
          updateTeacherSuccess({ teacher: result })
        );
      })
    );
  });

  // delete teacher in server
  deleteTeacherRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteTeacherRequest),
      mergeMap(({ id, schoolInfoId, userId }) =>
        from(this.teacherService.deleteTeacher(id, schoolInfoId, userId)).pipe(
          catchError((error) => {
            this.teacherService.errorToast(error);
            return of(
              teacherIsLoading({ teacherIsLoading: false }),
              deleteTeacherError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);
        const result = res as any;

        return of(
          teacherIsLoading({ teacherIsLoading: false }),
          deleteTeacherSuccess({ id: result.id })
        );
      })
    );
  });
}
