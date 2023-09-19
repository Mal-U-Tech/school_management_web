import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../interfaces/user.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<IUser>(environment.users.api);
  }

  login(email: string, password: string) {
    return this.http
      .post<IUser>(`${environment.users.api}/login`, { identity: email, password });
  }

  modules(admin: string) {
    return this.http
      .post(`check-modules/${admin}`, {});
  }

  register(user: {
    name: string;
    surname: string;
    contact: string;
    email: string;
    password: string;
  }) {
    return this.http
      .post<IUser>(environment.users.api, user);
  }

  profile(id: string) {
    return this.http
      .get<IUser>(`${environment.users.api}/profile?id=${id}`)
  }

  update(user: IUser) {
    return this.http
      .put<IUser>(environment.users.api, user)
  }

  delete(id: string) {
    return this.http
      .delete(`delete/${id}`);
  }
}
