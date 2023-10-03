import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPayload } from '../interfaces/payload.interface';
import { INotification } from '../interfaces/notification.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly http: HttpClient
  ) {}

  load() {
    return this.http.get<IPayload<INotification>>(environment.notifications.api);
  }
}
