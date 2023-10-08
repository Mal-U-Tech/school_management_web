import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClassUpdateDTO } from 'src/app/dtos/class_update.dto';
import { IClass } from 'src/app/interfaces/class.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class ClassService {
  constructor(private readonly http: HttpClient) {}

  update(value: Partial<ClassUpdateDTO> & Pick<ClassUpdateDTO, 'id'>) {
    return this.http.put<IClass>(`${environment.schools.api}/class`, value)
  }
}
