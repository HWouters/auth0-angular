import { describe, expect, it } from 'vitest';
import { signedIn, signedOut, signInFailed } from './auth.actions';
import { noAuthentication, reducer, startAuthentication } from './auth.reducer';

describe('auth reducer', () => {
  describe('undefined action', () => {
    it('should return not authenticated', () => {
      const action = {};
      const state = reducer(undefined, action as any);

      expect(state).toBe(startAuthentication);
    });
  });

  describe('Signed In', () => {
    const sub = 'id';
    const name = 'name';
    const email = 'a.b@mail.com';

    it('should add authenticated user to store', () => {
      const state = reducer(noAuthentication, signedIn({ user: { sub, name, email } }));

      expect(state.authenticated).toBe(true);
      expect(state.user).toEqual({ sub, name, email });
    });
  });

  describe('Signed Out', () => {
    const sub = 'id';
    const name = 'name';
    const email = 'a.b@mail.com';

    it('should remove authenticated user from store', () => {
      let state = reducer(noAuthentication, signedIn({ user: { sub, name, email } }));

      expect(state.authenticated).toBe(true);

      state = reducer(state, signedOut());

      expect(state).toBe(noAuthentication);
    });
  });

  describe('Sign in failed', () => {
    it('should remove authenticated user', () => {
      const state = reducer(startAuthentication, signInFailed({ error: new Error() }));

      expect(state).toBe(noAuthentication);
    });
  });
});
