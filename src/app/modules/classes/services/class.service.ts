import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IClass } from 'src/app/interfaces/class.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class ClassService {
  constructor(private readonly http: HttpClient) {}

  update(value: Partial<IClass> & Pick<IClass, 'id'>) {
    return this.http.put<IClass>(`${environment.schools.api}/class`, {
      id: value.id,
      name: value.name
    })
  }
}
