import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { AppService } from '../services/app.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private service: AppService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ) {
    const user = this.service.loaduser();
    if (user) {
      return next.handle(request.clone({ setHeaders: { authorization: `bearer ${user.token}` }}));
    }
    return next.handle(request);
  }
}
