import { HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { EMPTY, of } from 'rxjs';
import { AuthService } from './auth.service';
import { jwtInterceptor } from './jwt.interceptor';

describe('JwtInterceptor', () => {
  const token = 'abcdef';
  const next = jest.fn().mockReturnValue(EMPTY);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            getAccessToken: jest.fn().mockReturnValue(of(token)),
          },
        },
      ],
    });
  });

  describe('relative url', () => {
    it('should add authentication header', () => {
      const request = new HttpRequest('GET', 'url');

      subscribeSpyTo(TestBed.runInInjectionContext(() => jwtInterceptor(request, next)));

      expect(next).toHaveBeenCalledWith(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
    });
  });

  describe('absolute url', () => {
    it('should not add authentication header', () => {
      const request = new HttpRequest('GET', 'https://api/url');

      subscribeSpyTo(TestBed.runInInjectionContext(() => jwtInterceptor(request, next)));

      expect(next).toHaveBeenCalledWith(request);
    });
  });
});
