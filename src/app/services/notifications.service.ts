import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPayload } from '../interfaces/payload.interface';
import { INotification } from '../interfaces/notification.interface';
import { environment } from 'src/environments/environment';
import { IClass } from '../interfaces/class.interface';
import { ISubject } from '../interfaces/subject.interface';
import { ISchool } from '../interfaces/school.interface';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly http: HttpClient
  ) {}

  load() {
    return this.http.get<IPayload<INotification<IClass | ISubject | ISchool>>>(environment.notifications.api);
  }
}
