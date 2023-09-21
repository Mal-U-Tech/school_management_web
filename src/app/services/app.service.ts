import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../modules/authenticate/interfaces/user.interface';

@Injectable()
export class AppService {
  loaduser() {
    const data = localStorage.getItem(environment.token);
    if (data) {
      return JSON.parse(data) as IUser;
    }

    return null;
  }
}
