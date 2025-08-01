import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
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
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideMockStore({ initialState })],
    });

    store = TestBed.inject(MockStore);
    guard = TestBed.inject(AuthGuard);

    store.dispatch = vi.fn();
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
