import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../interfaces/user.interface';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<IUser>(environment.users.api);
  }

  login(email: string, password: string) {
    return this.http
      .post<IUser>(`${environment.users.api}/login`, { identity: email, password })
      .pipe(tap((user) => this.store(user)));
  }

  register(user: Pick<IUser, 'email' | 'password'> & Partial<IUser>) {
    return this.http
      .post<IUser>(environment.users.api, user)
      .pipe(tap((user) => this.store(user)));
  }

  update(user: IUser) {
    return this.http
      .put<IUser>(environment.users.api, user)
      .pipe(tap((user) => this.store(user)));
  }

  private store(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}
