import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthError } from '@azure/msal-browser';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot, Scheduler } from 'jest-marbles';
import { EMPTY, Observable } from 'rxjs';
import {
  resetPassword,
  signedIn,
  signedOut,
  signIn,
  signInCompleted,
  signInFailed,
  signOut,
} from '../actions/auth.actions';
import { AuthService } from '../auth.service';
import { AuthEffects } from './auth.effects';

describe('Auth Effects', () => {
  const error = new AuthError('code', 'message');
  const user = { sub: 'id' };
  const state = { target: 'path', passwordReset: false };

  let actions$: Observable<any>;
  let effects: AuthEffects;
  let service: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        {
          provide: AuthService,
          useValue: {
            loginWithRedirect: jest.fn(),
            resetPasswordWithRedirect: jest.fn(),
            handleRedirectCallback: jest.fn(),
            logout: jest.fn(),
            checkSession: jest.fn(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl: jest.fn(),
          },
        },
      ],
    });

    effects = TestBed.inject(AuthEffects);
    service = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  describe('sign in', () => {
    it('calls auth service', () => {
      const target = 'path';
      service.loginWithRedirect.mockReturnValue(EMPTY);

      actions$ = hot('a', { a: signIn({ returnUrl: target }) });

      expect(effects.signIn$).toSatisfyOnFlush(() => {
        expect(service.loginWithRedirect).toBeCalledWith({ target });
      });
    });
  });

  describe('reset password', () => {
    it('calls auth service', () => {
      const target = '/';
      service.resetPasswordWithRedirect.mockReturnValue(EMPTY);

      actions$ = hot('a', { a: resetPassword({ returnUrl: target }) });

      expect(effects.passwordReset$).toSatisfyOnFlush(() => {
        expect(service.resetPasswordWithRedirect).toBeCalledWith({ target });
      });
    });
  });

  describe('sign in completed', () => {
    it('should sign in the user', () => {
      actions$ = hot('a', { a: signInCompleted({ state, user }) });

      const expected = cold('c', { c: signedIn({ user }) });
      expect(effects.signInCompleted$).toBeObservable(expected);
    });

    it('should sign out on password reset', () => {
      const target = '/';

      actions$ = hot('a', { a: signInCompleted({ state: { target, passwordReset: true }, user }) });

      const expected = cold('c', { c: signOut() });
      expect(effects.signInCompleted$).toBeObservable(expected);
    });

    it('should navigate to target url', () => {
      router.navigateByUrl.mockReturnValue(Promise.resolve(true));

      actions$ = hot('a', { a: signInCompleted({ state, user }) });

      expect(effects.redirect$).toSatisfyOnFlush(() =>
        expect(router.navigateByUrl).toHaveBeenCalledWith(state.target, expect.objectContaining({ replaceUrl: true }))
      );
    });
  });

  describe('sign out', () => {
    it('signs out on authorization server', () => {
      actions$ = hot('a', { a: signOut() });

      expect(effects.signOut$).toSatisfyOnFlush(() => expect(service.logout).toHaveBeenCalledTimes(1));
    });

    it('signs user out', () => {
      service.logout.mockReturnValue(cold('a|', { a: {} }));

      actions$ = hot('a', { a: signOut() });

      const expected = cold('c', { c: signedOut() });
      expect(effects.signOut$).toBeObservable(expected);
    });

    it('signs user out on failure', () => {
      service.logout.mockReturnValue(cold('#', {}, error));

      actions$ = hot('a', { a: signOut() });

      const expected = cold('c', { c: signedOut() });
      expect(effects.signOut$).toBeObservable(expected);
    });
  });

  describe('app start', () => {
    it('signs authenticated user in', () => {
      service.checkSession.mockReturnValue(cold('a|', { a: user }));

      const expected = cold('c|', { c: signedIn({ user }) });
      expect(effects.init$({ scheduler: Scheduler.get() })).toBeObservable(expected);
    });

    it('handles sign in failures', () => {
      service.checkSession.mockReturnValue(cold('#', {}, error));

      const expected = cold('(c|)', { c: signInFailed({ error }) });
      expect(effects.init$({ scheduler: Scheduler.get() })).toBeObservable(expected);
    });

    it('does nothing when there is no authenticated user', () => {
      service.checkSession.mockReturnValue(cold('a|', { a: undefined }));

      const expected = cold('c|', { c: signedOut() });
      expect(effects.init$({ scheduler: Scheduler.get() })).toBeObservable(expected);
    });

    it('handles successfull redirects', () => {
      service.handleRedirectCallback.mockReturnValue(cold('a|', { a: { state, user } }));

      window.history.pushState({}, 'title', '#code=&state=');

      const expected = cold('c|', { c: signInCompleted({ state, user }) });
      expect(effects.init$({ scheduler: Scheduler.get() })).toBeObservable(expected);
    });

    it('handles failed redirects', () => {
      service.handleRedirectCallback.mockReturnValue(cold('#', {}, error));

      window.history.pushState({}, 'title', '#error=&error_description=');

      const expected = cold('(c|)', { c: signInFailed({ error }) });
      expect(effects.init$({ scheduler: Scheduler.get() })).toBeObservable(expected);
    });
  });

  describe('authentication failures', () => {
    it('handles forgotten password error', () => {
      const accessDenied = new AuthError('access_denied', 'AADB2C90118%3a+The+user+has+forgotten+their+password.');

      actions$ = hot('a', { a: signInFailed({ error: accessDenied }) });

      const expected = cold('c', { c: resetPassword({ returnUrl: '/' }) });
      expect(effects.resetPassword$).toBeObservable(expected);
    });
  });
});
