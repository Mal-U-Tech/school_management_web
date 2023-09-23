import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ISchool } from '../interfaces/school.interface';

@Injectable()
export class SchoolService {
  constructor(private readonly http: HttpClient) {}

  schools() {
    return this.http.get<ISchool[]>(`${environment.schools.api}/school/user`);
  }

  profile(id: string) {
    return this.http.get<ISchool>(
      `${environment.schools.api}/school/profile?id=${id}`
    );
  }
}
