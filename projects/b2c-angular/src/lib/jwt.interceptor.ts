import { HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  public intercept(request: HttpRequest<any>, next: HttpHandler) {
    return jwtInterceptor(request, next.handle);
  }
}

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  if (isSameDomain(request)) {
    return inject(AuthService)
      .getAccessToken()
      .pipe(
        map(token => request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })),
        mergeMap(authorizedRequest => next(authorizedRequest)),
      );
  } else {
    return next(request);
  }
};

function isSameDomain(request: HttpRequest<any>) {
  const isAbsolute = /^https?:\/\//i.test(request.url);

  return !isAbsolute;
}
