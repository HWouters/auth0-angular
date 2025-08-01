import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthError } from '@azure/msal-browser';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { provideMockActions } from '@ngrx/effects/testing';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, Mocked, vi } from 'vitest';
import {
  init,
  resetPassword,
  signedIn,
  signedOut,
  signIn,
  signInCompleted,
  signInFailed,
  signOut,
} from './auth.actions';
import { AuthEffects } from './auth.effects';
import { AuthService } from './auth.service';

describe('Auth Effects', () => {
  const error = new AuthError('code', 'message');
  const user = { sub: 'id' };
  const state = { target: 'path', passwordReset: false };

  let actions$: Observable<any>;
  let effects: AuthEffects;
  let service: Mocked<AuthService>;
  let router: Mocked<Router>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideZonelessChangeDetection(),
        provideMockActions(() => actions$),
        {
          provide: AuthService,
          useValue: {
            loginWithRedirect: vi.fn(),
            resetPasswordWithRedirect: vi.fn(),
            handleRedirectCallback: vi.fn(),
            logout: vi.fn(),
            checkSession: vi.fn(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl: vi.fn(),
          },
        },
      ],
    });

    effects = TestBed.inject(AuthEffects);
    service = TestBed.inject(AuthService) as Mocked<AuthService>;
    router = TestBed.inject(Router) as Mocked<Router>;
  });

  describe('sign in', () => {
    it('calls auth service', () => {
      const target = 'path';
      service.loginWithRedirect.mockReturnValue(EMPTY);

      actions$ = of(signIn({ returnUrl: target }));

      subscribeSpyTo(effects.signIn$);

      expect(service.loginWithRedirect).toHaveBeenCalledWith({ target });
    });
  });

  describe('reset password', () => {
    it('calls auth service', () => {
      const target = '/';
      service.resetPasswordWithRedirect.mockReturnValue(EMPTY);

      actions$ = of(resetPassword({ returnUrl: target }));

      subscribeSpyTo(effects.passwordReset$);

      expect(service.resetPasswordWithRedirect).toHaveBeenCalledWith({ target });
    });
  });

  describe('sign in completed', () => {
    it('should sign in the user', () => {
      actions$ = of(signInCompleted({ state, user }));

      const spy = subscribeSpyTo(effects.signInCompleted$);

      expect(spy.getLastValue()).toEqual(signedIn({ user }));
    });

    it('should sign out on password reset', () => {
      const target = '/';

      actions$ = of(signInCompleted({ state: { target, passwordReset: true }, user }));

      const spy = subscribeSpyTo(effects.signInCompleted$);

      expect(spy.getLastValue()).toEqual(signOut());
    });

    it('should navigate to target url', () => {
      router.navigateByUrl.mockReturnValue(Promise.resolve(true));

      actions$ = of(signInCompleted({ state, user }));

      subscribeSpyTo(effects.redirect$);

      expect(router.navigateByUrl).toHaveBeenCalledWith(state.target, expect.objectContaining({ replaceUrl: true }));
    });
  });

  describe('sign out', () => {
    beforeEach(() => {
      actions$ = of(signOut());
    });

    it('signs user out', () => {
      service.logout.mockReturnValue(of(undefined));

      const spy = subscribeSpyTo(effects.signOut$);

      expect(service.logout).toHaveBeenCalledTimes(1);
      expect(spy.getLastValue()).toEqual(signedOut());
    });

    it('signs user out on failure', () => {
      service.logout.mockReturnValue(throwError(() => error));

      const spy = subscribeSpyTo(effects.signOut$);

      expect(spy.getLastValue()).toEqual(signedOut());
    });
  });

  describe('app start', () => {
    beforeEach(() => {
      actions$ = of(init());
    });

    it('signs authenticated user in', () => {
      service.checkSession.mockReturnValue(of(user));

      const spy = subscribeSpyTo(effects.init$);

      expect(spy.getLastValue()).toEqual(signedIn({ user }));
    });

    it('handles sign in failures', () => {
      service.checkSession.mockReturnValue(throwError(() => error));

      const spy = subscribeSpyTo(effects.init$);

      expect(spy.getLastValue()).toEqual(signInFailed({ error }));
    });

    it('does nothing when there is no authenticated user', () => {
      service.checkSession.mockReturnValue(of(undefined));

      const spy = subscribeSpyTo(effects.init$);

      expect(spy.getLastValue()).toEqual(signedOut());
    });

    it('handles successfull redirects', () => {
      service.handleRedirectCallback.mockReturnValue(of({ state, user }));

      window.history.pushState({}, 'title', '#code=&state=');

      const spy = subscribeSpyTo(effects.init$);

      expect(spy.getLastValue()).toEqual(signInCompleted({ state, user }));
    });

    it('handles failed redirects', () => {
      service.handleRedirectCallback.mockReturnValue(throwError(() => error));

      window.history.pushState({}, 'title', '#error=&error_description=');

      const spy = subscribeSpyTo(effects.init$);

      expect(spy.getLastValue()).toEqual(signInFailed({ error }));
    });
  });

  describe('authentication failures', () => {
    it('handles forgotten password error', () => {
      const accessDenied = new AuthError('access_denied', 'AADB2C90118%3a+The+user+has+forgotten+their+password.');

      actions$ = of(signInFailed({ error: accessDenied }));

      const spy = subscribeSpyTo(effects.resetPassword$);

      expect(spy.getLastValue()).toEqual(resetPassword({ returnUrl: '/' }));
    });
  });
});
