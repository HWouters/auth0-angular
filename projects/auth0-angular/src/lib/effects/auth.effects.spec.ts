import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { provideMockActions } from '@ngrx/effects/testing';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { init, signedIn, signedOut, signIn, signInCompleted, signInFailed, signOut } from '../actions/auth.actions';
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

      actions$ = of(signIn({ returnUrl: target }));

      subscribeSpyTo(effects.signIn$);

      expect(service.loginWithRedirect).toHaveBeenCalledWith({ target });
    });
  });

  describe('sign in completed', () => {
    it('should sign in the user', () => {
      service.getUser.mockReturnValue(of(user));

      actions$ = of(signInCompleted({ state }));

      const spy = subscribeSpyTo(effects.signInCompleted$);

      expect(spy.getLastValue()).toEqual(signedIn({ user }));
    });

    it('should handle failure', () => {
      service.getUser.mockReturnValue(throwError(() => error));

      actions$ = of(signInCompleted({ state }));

      const spy = subscribeSpyTo(effects.signInCompleted$);

      expect(spy.getLastValue()).toEqual(signInFailed({ error }));
    });

    it('should navigate to target url', () => {
      router.navigateByUrl.mockReturnValue(Promise.resolve(true));

      actions$ = of(signInCompleted({ state }));

      subscribeSpyTo(effects.redirect$);

      expect(router.navigateByUrl).toHaveBeenCalledWith(state.target, expect.objectContaining({ replaceUrl: true }));
    });
  });

  describe('sign out', () => {
    it('signs out on authorization server', () => {
      actions$ = of(signOut());

      subscribeSpyTo(effects.signOut$);

      expect(service.logout).toHaveBeenCalledTimes(1);
    });

    it('signs user out', () => {
      actions$ = of(signOut());

      const spy = subscribeSpyTo(effects.signOut$);

      expect(spy.getLastValue()).toEqual(signedOut());
    });

    it('signs user out on failure', () => {
      actions$ = of(signOut());

      service.logout.mockImplementation(() => {
        throw error;
      });

      const spy = subscribeSpyTo(effects.signOut$);

      expect(spy.getLastValue()).toEqual(signedOut());
    });
  });

  describe('app start', () => {
    beforeEach(() => {
      actions$ = of(init());
    });

    it('signs authenticated user in', () => {
      service.isAuthenticated.mockReturnValue(of(true));
      service.getUser.mockReturnValue(of(user));

      const spy = subscribeSpyTo(effects.init$);

      expect(spy.getLastValue()).toEqual(signedIn({ user }));
    });

    it('handles sign in failures', () => {
      service.isAuthenticated.mockReturnValue(throwError(() => error));

      const spy = subscribeSpyTo(effects.init$);

      expect(spy.getLastValue()).toEqual(signInFailed({ error }));
    });

    it('handles get user failures', () => {
      service.isAuthenticated.mockReturnValue(of(true));
      service.getUser.mockReturnValue(throwError(() => error));

      const spy = subscribeSpyTo(effects.init$);

      expect(spy.getLastValue()).toEqual(signInFailed({ error }));
    });

    it('does nothing when there is no authenticated user', () => {
      service.isAuthenticated.mockReturnValue(of(false));

      const spy = subscribeSpyTo(effects.init$);

      expect(spy.getLastValue()).toEqual(signedOut());
    });

    it('handles successfull redirects', () => {
      service.handleRedirectCallback.mockReturnValue(of(state));

      window.history.pushState({}, 'title', '?code=&state=');

      const spy = subscribeSpyTo(effects.init$);

      expect(spy.getLastValue()).toEqual(signInCompleted({ state }));
    });

    it('handles failed redirects', () => {
      service.handleRedirectCallback.mockReturnValue(throwError(() => error));

      window.history.pushState({}, 'title', '?code=&state=');

      const spy = subscribeSpyTo(effects.init$);

      expect(spy.getLastValue()).toEqual(signInFailed({ error }));
    });
  });
});
