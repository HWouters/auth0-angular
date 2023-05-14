import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { MockStore, createMockStore } from '@ngrx/store/testing';
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
    store = createMockStore({ initialState });
    guard = new AuthGuard(store);

    jest.spyOn(store, 'dispatch');
  });

  describe('authenticated', () => {
    it('can activate', () => {
      store.overrideSelector(selectState, { authenticating: false, authenticated: true });

      const spy = subscribeSpyTo(guard.canActivate(next, state));

      expect(spy.getLastValue()).toBe(true);
    });
  });

  describe('not authenticated', () => {
    it('dispatches signin action', () => {
      store.overrideSelector(selectState, { authenticating: false, authenticated: false });

      subscribeSpyTo(guard.canActivate(next, state));

      expect(store.dispatch).toHaveBeenCalledWith(signIn({ returnUrl: state.url }));
    });
  });

  describe('authenticating', () => {
    it('does not dispatch signin action', () => {
      store.overrideSelector(selectState, { authenticating: true, authenticated: false });

      subscribeSpyTo(guard.canActivate(next, state));

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
