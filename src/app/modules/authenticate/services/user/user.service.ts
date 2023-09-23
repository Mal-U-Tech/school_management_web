import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../../../interfaces/user.interface';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<IUser>(`${environment.users.api}/login`, { identity: email, password })
      .pipe(map((user) => this.store(user)));
  }

  register(user: Pick<IUser, 'email' | 'password'> & Partial<IUser>) {
    return this.http
      .post<IUser>(environment.users.api, user)
      .pipe(map((user) => this.store(user)));
  }

  update(user: IUser) {
    return this.http
      .put<IUser>(environment.users.api, user)
      .pipe(map((user) => this.store(user)));
  }

  private store(user: IUser) {
    localStorage.setItem(environment.token, JSON.stringify(user));
    return user;
  }
}
