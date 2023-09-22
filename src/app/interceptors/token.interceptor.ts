import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { AppService } from '../services/app.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  user = this.service.loaduser();

  constructor(private service: AppService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ) {
    if (this.user) {
      return next.handle(request.clone({ setHeaders: { authorization: `bearer ${this.user.token}` }}));
    }
    return next.handle(request);
  }
}
