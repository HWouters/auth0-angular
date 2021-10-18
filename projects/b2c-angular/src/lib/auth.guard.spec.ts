import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { getMockStore, MockStore } from '@ngrx/store/testing';
import { cold } from 'jest-marbles';
import { signIn } from './actions/auth.actions';
import { AuthGuard } from './auth.guard';
import { selectState } from './store';

describe('Auth Guard', () => {
  const initialState = { loggedIn: false };
  const next = {} as jest.Mocked<ActivatedRouteSnapshot>;
  const state = { url: 'path' } as jest.Mocked<RouterStateSnapshot>;

  let store: MockStore;
  let guard: AuthGuard;

  beforeEach(() => {
    store = getMockStore({ initialState });
    guard = new AuthGuard(store);

    spyOn(store, 'dispatch');
  });

  describe('authenticated', () => {
    it('can activate', () => {
      store.overrideSelector(selectState, { authenticating: false, authenticated: true });

      const expected = cold('(a|)', { a: true });

      expect(guard.canActivate(next, state)).toBeObservable(expected);
    });
  });

  describe('not authenticated', () => {
    it('dispatches signin action', () => {
      store.overrideSelector(selectState, { authenticating: false, authenticated: false });

      expect(guard.canActivate(next, state)).toSatisfyOnFlush(() =>
        expect(store.dispatch).toHaveBeenCalledWith(signIn({ returnUrl: state.url }))
      );
    });
  });

  describe('authenticating', () => {
    it('does not dispatch signin action', () => {
      store.overrideSelector(selectState, { authenticating: true, authenticated: false });

      expect(guard.canActivate(next, state)).toSatisfyOnFlush(() => expect(store.dispatch).not.toHaveBeenCalled());
    });
  });
});
