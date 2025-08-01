import { HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { EMPTY, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service';
import { jwtInterceptor } from './jwt.interceptor';
import { provideZonelessChangeDetection } from '@angular/core';

describe('JwtInterceptor', () => {
  const token = 'abcdef';
  const next = vi.fn().mockReturnValue(EMPTY);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: { getAccessToken: vi.fn().mockReturnValue(of(token)) } },
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
