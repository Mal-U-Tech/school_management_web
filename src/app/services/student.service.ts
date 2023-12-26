import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStudent } from '../interfaces/student.interface';
import { environment } from 'src/environments/environment';
import { IStudentFilter } from '../modules/students/interfaces/student_filter.interface';
import { IPayload } from '../interfaces/payload.interface';

@Injectable()
export class StudentService {
  constructor(
    private readonly http: HttpClient,
  ) {}

  grades(school: string, students: string[]) {
    return this.http.post<IStudent[]>(`${environment.students.api}/grade/student`, {
      school,
      students,
    });
  }

  list(filter: IStudentFilter) {
    const params = new HttpParams({
      fromObject: filter
    });

    return this.http.get<IPayload<IStudent>>(`${environment.students.api}/student`, {
      params
    })
  }
}
