import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { createMockStore, MockStore } from '@ngrx/store/testing';
import { beforeEach, describe, expect, it, Mocked, vi } from 'vitest';
import { signIn } from './auth.actions';
import { AuthGuard } from './auth.guard';
import { selectAuthState } from './auth.reducer';

describe('Auth Guard', () => {
  const initialState = { loggedIn: false };
  const next = {} as Mocked<ActivatedRouteSnapshot>;
  const state = { url: 'path' } as Mocked<RouterStateSnapshot>;

  let store: MockStore;
  let guard: AuthGuard;

  beforeEach(() => {
    store = createMockStore({ initialState });
    guard = new AuthGuard(store);

    vi.spyOn(store, 'dispatch');
  });

  describe('authenticated', () => {
    it('can activate', () => {
      store.overrideSelector(selectAuthState, { authenticating: false, authenticated: true, user: undefined });

      const spy = subscribeSpyTo(guard.canActivate(next, state));

      expect(spy.getLastValue()).toBe(true);
    });
  });

  describe('not authenticated', () => {
    it('dispatches signin action', () => {
      store.overrideSelector(selectAuthState, { authenticating: false, authenticated: false, user: undefined });

      subscribeSpyTo(guard.canActivate(next, state));

      expect(store.dispatch).toHaveBeenCalledWith(signIn({ returnUrl: state.url }));
    });
  });

  describe('authenticating', () => {
    it('does not dispatch signin action', () => {
      store.overrideSelector(selectAuthState, { authenticating: true, authenticated: false, user: undefined });

      subscribeSpyTo(guard.canActivate(next, state));

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
