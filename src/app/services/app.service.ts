import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class AppService {
  loaduser() {
    const data = localStorage.getItem(environment.token);
    if (data) {
      return JSON.parse(data) as IUser;
    }

    return null;
  }

  logout() {
    localStorage.removeItem(environment.token);
  }

  verify() {
    const user = this.loaduser()
    if (!user) {
      return false;
    }

    const expiry = (JSON.parse(window.atob(user.token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) < expiry;
  }
}
