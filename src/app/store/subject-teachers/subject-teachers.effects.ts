import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, mergeMap, of } from 'rxjs';
import {
  ISubjectTeacher,
  ISubjectTeacherGetResponse,
} from 'src/app/shared/subject-teacher/subject-teacher.interface';
import { SubjectTeacherService } from 'src/app/shared/subject-teacher/subject-teacher.service';
import {
  deleteSubjectTeacherError,
  deleteSubjectTeacherRequest,
  deleteSubjectTeacherSuccess,
  getSubjectTeachersError,
  getSubjectTeachersRequest,
  getSubjectTeachersSuccess,
  postSubjectTeacherError,
  postSubjectTeacherRequest,
  postSubjectTeacherSuccess,
  subjectTeacherIsLoading,
  updateSubjectTeacherError,
  updateSubjectTeacherRequest,
  updateSubjectTeacherSuccess,
} from './subject-teachers.actions';

@Injectable()
export class SubjectTeacherEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly service: SubjectTeacherService
  ) {}

  // post request effect
  postSubjectTeacherRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postSubjectTeacherRequest),
      mergeMap(({ subjectTeacher }) =>
        from(this.service.postSubjectTeacher(subjectTeacher)).pipe(
          catchError((error) => {
            this.service.errorToast(error);
            return of(
              subjectTeacherIsLoading({ subjectTeacherIsLoading: false }),
              postSubjectTeacherError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as ISubjectTeacher;

        return of(
          subjectTeacherIsLoading({ subjectTeacherIsLoading: false }),
          postSubjectTeacherSuccess({ subjectTeacher: result })
        );
      })
    );
  });

  // get subject teachers request effect
  getSubjectTeachersRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getSubjectTeachersRequest),
      mergeMap(({ currentPage, pageSize }) =>
        from(this.service.getAllSubjectTeachers(currentPage, pageSize)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              subjectTeacherIsLoading({ subjectTeacherIsLoading: false }),
              getSubjectTeachersError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as any;

        return of(
          subjectTeacherIsLoading({ subjectTeacherIsLoading: false }),
          getSubjectTeachersSuccess({ subjectTeachers: result.data })
        );
      })
    );
  });

  // update subject teacher request effect
  updateSubjectTeacherRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateSubjectTeacherRequest),
      mergeMap(({ id, subjectTeacher }) =>
        from(this.service.updateSubjectTeacher(id, subjectTeacher)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              subjectTeacherIsLoading({ subjectTeacherIsLoading: false }),
              updateSubjectTeacherError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as ISubjectTeacher;

        return of(
          subjectTeacherIsLoading({ subjectTeacherIsLoading: false }),
          updateSubjectTeacherSuccess({ subjectTeacher: result })
        );
      })
    );
  });

  // delete subject teacher request effect
  deleteSubjectTeacherRequest$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteSubjectTeacherRequest),
      mergeMap(({ id }) =>
        from(this.service.deleteSubjectTeacher(id)).pipe(
          catchError((error) => {
            this.service.errorToast(error);

            return of(
              subjectTeacherIsLoading({ subjectTeacherIsLoading: false }),
              deleteSubjectTeacherError({ message: error })
            );
          })
        )
      ),
      mergeMap((res) => {
        console.log(res);

        const result = res as { id: string };
        // console.log(result);

        return of(
          subjectTeacherIsLoading({ subjectTeacherIsLoading: false }),
          deleteSubjectTeacherSuccess({ id: result.id })
        );
      })
    );
  });
}
