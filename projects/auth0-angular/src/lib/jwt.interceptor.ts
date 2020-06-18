import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private readonly auth: AuthService) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (this.isSameDomain(request)) {
      return this.authorize(request).pipe(mergeMap(authorizedRequest => next.handle(authorizedRequest)));
    } else {
      return next.handle(request);
    }
  }

  private isSameDomain(request: HttpRequest<any>) {
    const isAbsolute = /^https?:\/\//i.test(request.url);

    return !isAbsolute;
  }

  private authorize(request: HttpRequest<any>) {
    const token$ = this.auth.getAccessToken();

    return token$.pipe(map(token => request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })));
  }
}
