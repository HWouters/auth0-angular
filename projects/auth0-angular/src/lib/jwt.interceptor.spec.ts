import { HTTP_INTERCEPTORS, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { cold } from 'jest-marbles';
import { EMPTY } from 'rxjs';
import { AuthService } from './auth.service';
import { JwtInterceptor } from './jwt.interceptor';

describe('JwtInterceptor', () => {
  const token = 'abcdef';

  let interceptor: HttpInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            getAccessToken: jest.fn(),
          },
        },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      ],
    });

    interceptor = TestBed.inject(HTTP_INTERCEPTORS)[0];
    const authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    authService.getAccessToken.mockReturnValue(cold('a|', { a: token }));
  });

  describe('relative url', () => {
    it('should add authentication header', () => {
      const next = { handle: jest.fn().mockReturnValue(EMPTY) };

      expect(interceptor.intercept(new HttpRequest('GET', 'url'), next)).toSatisfyOnFlush(() => {
        const request: HttpRequest<any> = next.handle.mock.calls[0][0];

        expect(request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      });
    });
  });

  describe('absolute url', () => {
    it('should not add authentication header', () => {
      const next = { handle: jest.fn().mockReturnValue(EMPTY) };

      expect(interceptor.intercept(new HttpRequest('GET', 'https://api/url'), next)).toSatisfyOnFlush(() => {
        const request: HttpRequest<any> = next.handle.mock.calls[0][0];

        expect(request.headers.has('Authorization')).toBe(false);
      });
    });
  });
});
