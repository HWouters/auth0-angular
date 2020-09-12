import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot, Scheduler } from 'jest-marbles';
import { EMPTY, Observable } from 'rxjs';
import { signedIn, signedOut, signIn, signInCompleted, signInFailed, signOut } from '../actions/auth.actions';
import { AuthService } from '../auth.service';
import { AuthEffects } from './auth.effects';

describe('Auth Effects', () => {
  const error = new Error('message');
  const user = { sub: 'id' };
  const state = { target: 'path' };

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
            isAuthenticated: jest.fn(),
            loginWithRedirect: jest.fn(),
            handleRedirectCallback: jest.fn(),
            getUser: jest.fn(),
            logout: jest.fn(),
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

  describe('sign in completed', () => {
    it('should sign in the user', () => {
      service.getUser.mockReturnValue(cold('a|', { a: user }));

      actions$ = hot('a', { a: signInCompleted({ state }) });

      const expected = cold('c', { c: signedIn(user) });
      expect(effects.signInCompleted$).toBeObservable(expected);
    });

    it('should handle failure', () => {
      service.getUser.mockReturnValue(cold('#', {}, error));

      actions$ = hot('a', { a: signInCompleted({ state }) });

      const expected = cold('c', { c: signInFailed({ error }) });
      expect(effects.signInCompleted$).toBeObservable(expected);
    });

    it('should navigate to target url', () => {
      router.navigateByUrl.mockReturnValue(Promise.resolve(true));

      actions$ = hot('a', { a: signInCompleted({ state }) });

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
      actions$ = hot('a', { a: signOut() });

      const expected = cold('c', { c: signedOut() });
      expect(effects.signOut$).toBeObservable(expected);
    });

    it('signs user out on failure', () => {
      actions$ = hot('a', { a: signOut() });

      service.logout.mockImplementation(() => {
        throw error;
      });

      const expected = cold('c', { c: signedOut() });
      expect(effects.signOut$).toBeObservable(expected);
    });
  });

  describe('app start', () => {
    it('signs authenticated user in', () => {
      service.isAuthenticated.mockReturnValue(cold('a|', { a: true }));
      service.getUser.mockReturnValue(cold('a|', { a: user }));

      const expected = cold('c|', { c: signedIn(user) });
      expect(effects.init$({ scheduler: Scheduler.get() })).toBeObservable(expected);
    });

    it('handles sign in failures', () => {
      service.isAuthenticated.mockReturnValue(cold('#', {}, error));

      const expected = cold('(c|)', { c: signInFailed({ error }) });
      expect(effects.init$({ scheduler: Scheduler.get() })).toBeObservable(expected);
    });

    it('handles get user failures', () => {
      service.isAuthenticated.mockReturnValue(cold('a|', { a: true }));
      service.getUser.mockReturnValue(cold('#', {}, error));

      const expected = cold('(c|)', { c: signInFailed({ error }) });
      expect(effects.init$({ scheduler: Scheduler.get() })).toBeObservable(expected);
    });

    it('does nothing when there is no authenticated user', () => {
      service.isAuthenticated.mockReturnValue(cold('a|', { a: false }));

      const expected = cold('c|', { c: signedOut() });
      expect(effects.init$({ scheduler: Scheduler.get() })).toBeObservable(expected);
    });

    it('handles successfull redirects', () => {
      service.handleRedirectCallback.mockReturnValue(cold('a|', { a: state }));

      delete window.location;
      window.location = { ...window.location, search: 'code=&state=' };

      const expected = cold('c|', { c: signInCompleted({ state }) });
      expect(effects.init$({ scheduler: Scheduler.get() })).toBeObservable(expected);
    });

    it('handles failed redirects', () => {
      service.handleRedirectCallback.mockReturnValue(cold('#', {}, error));

      delete window.location;
      window.location = { ...window.location, search: 'code=&state=' };

      const expected = cold('(c|)', { c: signInFailed({ error }) });
      expect(effects.init$({ scheduler: Scheduler.get() })).toBeObservable(expected);
    });
  });
});
