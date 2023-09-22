import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPermission } from '../interfaces/permission.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class PermissionService {

  constructor(
    private readonly http: HttpClient,
  ) {}

  list() {
    return this.http.get<IPermission[]>(`${environment.permissions.api}/user`)
  }
}
