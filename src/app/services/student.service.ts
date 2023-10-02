import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStudent } from '../interfaces/student.interface';
import { environment } from 'src/environments/environment';

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
}
